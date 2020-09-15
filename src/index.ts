/**
 * Fast URL builder with type safety and performance optimization.
 *
 * This module provides utilities to build URLs safely and efficiently,
 * handling path parameters, query strings, and URL joining operations.
 *
 * @example
 * ```ts
 * import { createUrl } from "fast-url";
 *
 * // Build URL with path and query parameters
 * createUrl('https://api.example.com', '/users/:id', { id: 42, search: 'foo' })
 * // -> 'https://api.example.com/users/42?search=foo'
 * ```
 *
 * @module
 */

import { stringify } from './querystring/stringify.ts'

/**
 * A map of parameters for URL building.
 * Used for both path parameters and query string parameters.
 */
export type ParamMap = Record<string, unknown>

/**
 * Builds a URL using the base template and specified parameters.
 *
 * @param {String} baseTemplate a URL template that contains zero or more :params
 * @param {Object} params an object with properties that correspond to the :params
 *   in the base template. Unused properties become query params.
 *
 * @returns {String} a URL with path params substituted and query params appended
 *
 * @example
 * ```ts
 * createUrl('http://api.example.com/users/:id', { id: 42, search: 'foo' })
 * // -> 'http://api.example.com/users/42?search=foo'
 * ```
 */
export function createUrl(baseTemplate: string, params: ParamMap): string

/**
 * Concatenates the base URL and the path specified using `/` as a separator.
 * If `/` occurs at the concatenation boundary in either parameter, it is removed.
 *
 * @param {String} baseUrl the first part of the URL
 * @param {String} path the second part of the URL
 *
 * @returns {String} the result of the concatenation
 *
 * @example
 * ```ts
 * createUrl('http://api.example.com/', '/users')
 * // -> 'http://api.example.com/users'
 * ```
 */
export function createUrl(baseUrl: string, path: string): string

/**
 * Concatenates the base URL and the path specified using `/` as a separator.
 * If `/` occurs at the concatenation boundary in either parameter, it is removed.
 * Substitutes path parameters with the properties of the @see params object and appends
 * unused properties in the path as query params.
 *
 * @param {String} baseUrl the first part of the URL
 * @param {String} pathTemplate the second part of the URL
 * @param {Object} params Object with properties that correspond to the :params
 *   in the base template. Unused properties become query params.
 *
 * @returns {String} URL with path params substituted and query params appended
 *
 * @example
 * ```ts
 * createUrl('http://api.example.com/', '/users/:id', { id: 42, search: 'foo' })
 * // -> 'http://api.example.com/users/42?search=foo'
 * ```
 */
export function createUrl(
  baseUrl: string,
  pathTemplate: string,
  params: ParamMap,
): string

export function createUrl(
  baseUrlOrTemplate: string,
  pathTemplateOrParams: string | ParamMap,
  maybeParams: ParamMap = {},
): string {
  return typeof pathTemplateOrParams === 'string'
    ? createUrlImpl(pathTemplateOrParams, maybeParams, baseUrlOrTemplate)
    : createUrlImpl(baseUrlOrTemplate, pathTemplateOrParams, undefined)
}

function joinFullUrl(
  renderedPath: string,
  baseUrl: string,
  pathAndQuery: string,
): string {
  return renderedPath.length
    ? join(baseUrl, '/', pathAndQuery)
    : join(baseUrl, '?', pathAndQuery)
}

function createUrlImpl(
  pathTemplate: string,
  params: ParamMap,
  baseUrl: string | undefined,
) {
  const { renderedPath, remainingParams } = path(pathTemplate, params)
  const cleanParams = removeNullOrUndef(remainingParams)
  const renderedQuery = query(cleanParams)
  const pathAndQuery = join(renderedPath, '?', renderedQuery)

  return baseUrl
    ? joinFullUrl(renderedPath, baseUrl, pathAndQuery)
    : pathAndQuery
}

/**
 * Creates a query string from the specified object.
 *
 * @param {Object} params an object to convert into a query string.
 *
 * @returns {String} Query string.
 *
 * @example
 * ```ts
 * query({ id: 42, search: 'foo' })
 * // -> 'id=42&search=foo'
 * ```
 */
export function query(params: ParamMap): string {
  return Object.keys(params).length ? stringify(params) : ''
}

/**
 * Substitutes :params in a template with property values of an object.
 *
 * @param {String} template a string that contains :params.
 * @param {Object} params an object with keys that correspond to the params in the template.
 *
 * @returns {String} Rendered path after substitution.
 *
 * @example
 * ```ts
 * subst('/users/:id/posts/:postId', { id: 42, postId: 36 })
 * // -> '/users/42/posts/36'
 * ```
 */
export function subst(template: string, params: ParamMap): string {
  const { renderedPath } = path(template, params)
  return renderedPath
}

function path(template: string, params: ParamMap) {
  const remainingParams = { ...params }
  const renderedPath = template.replace(/:[_A-Za-z]+\w*/g, (p) => {
    const key = p.slice(1)
    validatePathParam(params, key)
    delete remainingParams[key]
    return encodeURIComponent(params[key] as string | number | boolean)
  })
  return { renderedPath, remainingParams }
}

function validatePathParam(params: ParamMap, key: string) {
  if (!Object.hasOwn(params, key)) {
    throw new Error(`Missing value for path parameter ${key}.`)
  }
  const type = typeof params[key]
  if (type !== 'boolean' && type !== 'string' && type !== 'number') {
    throw new TypeError(
      `Path parameter ${key} cannot be of type ${type}. ` +
        'Allowed types are: boolean, string, number.',
    )
  }
  if (type === 'string' && (params[key] as string).trim() === '') {
    throw new Error(`Path parameter ${key} cannot be an empty string.`)
  }
}

/**
 * Joins two strings using a separator.
 * If the separator occurs at the concatenation boundary in either of the strings, it is removed.
 * This prevents accidental duplication of the separator.
 *
 * @param {String} part1 First string.
 * @param {String} separator Separator used for joining.
 * @param {String} part2 Second string.
 *
 * @returns {String} Joined string.
 *
 * @example
 * ```ts
 * join('first/', '/', '/second')
 * // -> 'first/second'
 * ```
 */
export function join(part1: string, separator: string, part2: string): string {
  const p1 = part1.endsWith(separator)
    ? part1.slice(0, -separator.length)
    : part1
  const p2 = part2.startsWith(separator) ? part2.slice(separator.length) : part2
  return !p1 || !p2 ? p1 + p2 : p1 + separator + p2
}

/**
 * Removes null and undefined values from a parameter map.
 * This function filters out any properties with null or undefined values,
 * returning a new object containing only defined values.
 *
 * @param {ParamMap} params The parameter map to filter
 *
 * @example
 * ```ts
 * removeNullOrUndef({ a: 'hello', b: null, c: undefined, d: 'world' })
 * // -> { a: 'hello', d: 'world' }
 * ```
 */
function removeNullOrUndef<P extends ParamMap>(params: P) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null),
  ) as { [K in keyof P]: NonNullable<P[K]> }
}
