/**
 * Utility functions for what-the-fetch.
 *
 * @module
 */

import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ApiData, ApiPath, ApiSchema } from './types.ts'

/**
 * Validates data against a Standard Schema from an API path schema.
 *
 * Takes an API path schema object, extracts the specified schema (e.g., 'response', 'params'),
 * and validates the provided data against it. If validation fails, throws an error with the
 * validation issues.
 *
 * @template Schemas - The API schema type
 * @template Path - The specific API path
 * @param apiSchema - The complete schema object for a specific API path
 * @param option - The key of the schema to validate against (e.g., 'response', 'params', 'query', 'body')
 * @param data - The data to validate (can be any value)
 * @returns A promise that resolves to the validated data
 * @throws {Error} If validation fails, with validation issues in the error message
 *
 * @internal
 */
export async function validateData<
  Schemas extends ApiSchema,
  Path extends ApiPath<Schemas>,
  Option extends keyof Schemas[Path],
>(
  apiSchema: Schemas[Path],
  option: keyof Schemas[Path],
  data: unknown,
): Promise<ApiData<Schemas, Path, Option>> {
  const schema = apiSchema[option] as
    | StandardSchemaV1<Record<string, unknown>>
    | undefined

  if (!schema) {
    return data as ApiData<Schemas, Path, Option>
  }

  const result = await schema['~standard'].validate(data)

  if (result.issues) {
    throw new Error(`Validation failed: ${JSON.stringify(result.issues)}`)
  }

  return result.value as ApiData<Schemas, Path, Option>
}

const paramsRegex = /\/:\w+/

export async function validateRequestData<
  Schemas extends ApiSchema,
  Path extends ApiPath<Schemas>,
>(
  apiSchema: Schemas[Path],
  path: Path,
  options: Partial<Record<keyof Schemas[Path], unknown>> | undefined,
) {
  if (paramsRegex.test(path) && !apiSchema.params) {
    throw new Error(
      'Path contains parameters but no "params" schema is defined.',
    )
  }

  return Promise.all([
    validateData<Schemas, Path, 'params'>(apiSchema, 'params', options?.params),
    validateData<Schemas, Path, 'query'>(apiSchema, 'query', options?.query),
    validateData<Schemas, Path, 'body'>(apiSchema, 'body', options?.body),
  ])
}
