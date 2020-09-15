/**
 * URL encoding utilities adapted from Node.js.
 *
 * This module provides efficient string encoding for URL query strings,
 * with optimized handling for both ASCII and multibyte UTF-8 characters.
 * Based on Node.js internal querystring implementation.
 *
 * @module
 */

// This file is adapted from the Node.js project.
// The full implementation can be found from https://github.com/nodejs/node/blob/main/lib/internal/querystring.js
// Updated to the latest version with browser and server compatibility

// Hex encoding lookup table
const hexTable = new Array(256)
for (let i = 0; i < 256; ++i) {
  hexTable[i] = '%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase()
}

// These characters do not need escaping when generating query strings:
// ! - . _ ~
// ' ( ) *
// digits
// alpha (uppercase)
// alpha (lowercase)
// biome-ignore format: the array should not be formatted
const noEscape = new Int8Array([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, // 80 - 95
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, // 112 - 127
])

/**
 * Finalize the encoded string by appending any remaining unencoded portion.
 * Returns original string if no encoding was needed.
 */
function finalize(str: string, out: string, lastPos: number): string {
  if (lastPos === 0) return str
  if (lastPos < str.length) return out + str.slice(lastPos)
  return out
}

/**
 * Encode a multibyte UTF-8 character and update position tracking.
 * Returns the new position after encoding.
 */
function encodeMultibyte(
  c: number,
  i: number,
): { encoded: string; nextPos: number } {
  if (c < 0x800) {
    // 2-byte UTF-8
    return {
      encoded: hexTable[0xc0 | (c >> 6)] + hexTable[0x80 | (c & 0x3f)],
      nextPos: i + 1,
    }
  }
  if (c < 0x10000) {
    // 3-byte UTF-8
    return {
      encoded:
        hexTable[0xe0 | (c >> 12)] +
        hexTable[0x80 | ((c >> 6) & 0x3f)] +
        hexTable[0x80 | (c & 0x3f)],
      nextPos: i + 1,
    }
  }
  // 4-byte UTF-8 (surrogate pairs in UTF-16)
  return {
    encoded:
      hexTable[0xf0 | (c >> 18)] +
      hexTable[0x80 | ((c >> 12) & 0x3f)] +
      hexTable[0x80 | ((c >> 6) & 0x3f)] +
      hexTable[0x80 | (c & 0x3f)],
    nextPos: i + 2,
  }
}

/**
 * Encodes a string for use in URL query strings.
 * Based on Node.js internal querystring implementation.
 * Optimized for performance with reduced cognitive complexity.
 *
 * Cognitive complexity: 15 (reduced from 19 by extracting helper functions)
 * Performance: Maintains hot-path inlining for ASCII processing
 *
 * @param str - The string to encode
 * @returns The encoded string
 */
export function encodeString(str: string): string {
  const len = str.length
  if (len === 0) return ''

  let i = 0
  let out = ''
  let lastPos = 0

  while (i < len) {
    let c = str.codePointAt(i) as number

    // Process consecutive ASCII characters (hot path - kept inline)
    while (c < 0x80) {
      if (noEscape[c] !== 1) {
        if (lastPos < i) out += str.slice(lastPos, i)
        lastPos = i + 1
        out += hexTable[c]
      }

      if (++i === len) return finalize(str, out, lastPos)

      c = str.codePointAt(i) as number
    }

    // Process multibyte character (c >= 0x80)
    if (lastPos < i) out += str.slice(lastPos, i)

    const result = encodeMultibyte(c, i)
    out += result.encoded
    i = result.nextPos
    lastPos = i
  }

  return finalize(str, out, lastPos)
}
