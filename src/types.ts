import type { StandardSchemaV1 } from '@standard-schema/spec'

export type ApiSchema = Record<
  string,
  {
    params?: StandardSchemaV1<Record<string, unknown>, unknown>
    query?: StandardSchemaV1<Record<string, unknown>, unknown>
    body?: StandardSchemaV1<Record<string, unknown>, unknown>
    response?: StandardSchemaV1<Record<string, unknown>, unknown>
  }
>

export type ApiPath<T extends ApiSchema> = keyof T & string

export type FetchOptions<
  T extends ApiSchema,
  Path extends ApiPath<T>,
> = T[Path] extends infer Schema
  ? Schema extends {
      params?: infer P
      query?: infer Q
      body?: infer B
    }
    ? (P extends StandardSchemaV1<infer Params, unknown>
        ? { params: Params }
        : {}) &
        (Q extends StandardSchemaV1<infer Query, unknown>
          ? { query: Query }
          : {}) &
        (B extends StandardSchemaV1<infer Body, unknown> ? { body?: Body } : {})
    : never
  : never

export type ApiResponse<
  T extends ApiSchema,
  Path extends ApiPath<T>,
> = T[Path] extends infer Schema
  ? Schema extends { payload: infer P }
    ? P extends StandardSchemaV1<infer Payload, unknown>
      ? Payload
      : unknown
    : unknown
  : unknown
