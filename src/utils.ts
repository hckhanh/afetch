import type { ApiPath, ApiResponse, ApiSchema } from './types.ts'

export async function validateResponse<
  T extends ApiSchema,
  Path extends ApiPath<T>,
>(schema: T[Path], data: unknown): Promise<ApiResponse<T, Path>> {
  if (schema.response) {
    const result = await schema.response['~standard'].validate(data)

    if (result.issues) {
      throw new Error(`Validation failed: ${JSON.stringify(result.issues)}`)
    }

    return result.value as ApiResponse<T, Path>
  }

  return data as ApiResponse<T, Path>
}
