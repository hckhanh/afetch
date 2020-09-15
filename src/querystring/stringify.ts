/**
 * Query string serialization utilities.
 *
 * This module provides functions to convert JavaScript objects into URL-encoded
 * query strings, handling various data types including primitives and arrays.
 *
 * @module
 */

import { encodeString } from './node.ts'

/**
 * Converts a value to its primitive string representation for query strings.
 * Handles string, bigint, boolean, and number types.
 *
 * @param value - The value to convert
 * @returns The encoded primitive string or empty string if invalid
 */
function getAsPrimitive(value: unknown) {
  const type = typeof value

  if (type === 'string') {
    // Length check is handled inside the encodeString function
    return encodeString(value as string)
  } else if (type === 'bigint' || type === 'boolean') {
    return '' + value
  } else if (type === 'number' && Number.isFinite(value)) {
    return (value as number) < 1e21 ? '' + value : encodeString('' + value)
  }

  return ''
}

/**
 * Converts an object into a URL-encoded query string.
 *
 * Handles various data types including strings, numbers, booleans, bigints, and arrays.
 * Array values are serialized by repeating the key for each value.
 *
 * @param input - The object to stringify
 * @returns The URL-encoded query string
 *
 * @example
 * ```ts
 * stringify({ name: 'John', age: 30 })
 * // -> 'name=John&age=30'
 *
 * stringify({ tags: ['a', 'b', 'c'] })
 * // -> 'tags=a&tags=b&tags=c'
 * ```
 */
export function stringify(input: unknown) {
  let result = ''

  if (input === null || typeof input !== 'object') {
    return result
  }

  const separator = '&'
  const keys = Object.keys(input)
  const keyLength = keys.length
  let valueLength = 0

  for (let i = 0; i < keyLength; i++) {
    const key = keys[i]
    const value = (input as Record<string, unknown>)[key]
    const encodedKey = encodeString(key) + '='

    if (i) {
      result += separator
    }

    if (Array.isArray(value)) {
      valueLength = value.length
      for (let j = 0; j < valueLength; j++) {
        if (j) {
          result += separator
        }

        // Optimization: Dividing into multiple lines improves the performance.
        // Since v8 does not need to care about the '+' character if it was one-liner.
        result += encodedKey
        result += getAsPrimitive(value[j])
      }
    } else {
      result += encodedKey
      result += getAsPrimitive(value)
    }
  }

  return result
}
