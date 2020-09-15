import { describe, expect, it } from 'vitest'
import { encodeString } from '../src/querystring/node.ts'
import { stringify } from '../src/querystring/stringify.ts'

describe('encodeString', () => {
  describe('Basic encoding', () => {
    it('Returns empty string for empty input', () => {
      expect(encodeString('')).toBe('')
    })

    it('Returns the same string if no encoding needed', () => {
      expect(encodeString('simple')).toBe('simple')
    })

    it('Preserves alphanumeric characters', () => {
      expect(encodeString('abc123XYZ')).toBe('abc123XYZ')
    })

    it('Preserves safe special characters: - . _ ~', () => {
      expect(encodeString('file-name.ext_test~version')).toBe(
        'file-name.ext_test~version',
      )
    })

    it('Preserves safe special characters: ! ( ) *', () => {
      expect(encodeString("test!'()*")).toBe("test!'()*")
    })
  })

  describe('Special character encoding', () => {
    it('Encodes spaces as %20', () => {
      expect(encodeString('hello world')).toBe('hello%20world')
    })

    it('Encodes double quotes', () => {
      expect(encodeString('"quoted"')).toBe('%22quoted%22')
    })

    it('Encodes ampersand', () => {
      expect(encodeString('a&b')).toBe('a%26b')
    })

    it('Encodes equals sign', () => {
      expect(encodeString('a=b')).toBe('a%3Db')
    })

    it('Encodes hash/pound sign', () => {
      expect(encodeString('test#anchor')).toBe('test%23anchor')
    })

    it('Encodes question mark', () => {
      expect(encodeString('what?')).toBe('what%3F')
    })

    it('Encodes forward slash', () => {
      expect(encodeString('path/to/file')).toBe('path%2Fto%2Ffile')
    })

    it('Encodes percent sign', () => {
      expect(encodeString('100%')).toBe('100%25')
    })

    it('Encodes less than and greater than', () => {
      expect(encodeString('<tag>')).toBe('%3Ctag%3E')
    })

    it('Encodes square brackets', () => {
      expect(encodeString('[array]')).toBe('%5Barray%5D')
    })

    it('Encodes curly braces', () => {
      expect(encodeString('{object}')).toBe('%7Bobject%7D')
    })

    it('Encodes pipe', () => {
      expect(encodeString('a|b')).toBe('a%7Cb')
    })

    it('Encodes backslash', () => {
      expect(encodeString(String.raw`back\slash`)).toBe('back%5Cslash')
    })

    it('Encodes caret', () => {
      expect(encodeString('test^value')).toBe('test%5Evalue')
    })

    it('Encodes backtick', () => {
      expect(encodeString('`code`')).toBe('%60code%60')
    })
  })

  describe('Unicode encoding', () => {
    it('Encodes 2-byte UTF-8 characters', () => {
      expect(encodeString('café')).toBe('caf%C3%A9')
    })

    it('Encodes 3-byte UTF-8 characters', () => {
      expect(encodeString('日本語')).toBe('%E6%97%A5%E6%9C%AC%E8%AA%9E')
    })

    it('Encodes emojis (4-byte UTF-8 / surrogate pairs)', () => {
      expect(encodeString('🚀')).toBe('%F0%9F%9A%80')
    })

    it('Encodes mixed ASCII and Unicode', () => {
      expect(encodeString('Hello 世界')).toBe('Hello%20%E4%B8%96%E7%95%8C')
    })

    it('Encodes various emojis', () => {
      expect(encodeString('👍🎉💯')).toBe(
        '%F0%9F%91%8D%F0%9F%8E%89%F0%9F%92%AF',
      )
    })

    it('Encodes German umlauts', () => {
      expect(encodeString('München')).toBe('M%C3%BCnchen')
    })

    it('Encodes French accents', () => {
      expect(encodeString('àéèêëïôù')).toBe(
        '%C3%A0%C3%A9%C3%A8%C3%AA%C3%AB%C3%AF%C3%B4%C3%B9',
      )
    })

    it('Encodes Spanish characters', () => {
      expect(encodeString('español')).toBe('espa%C3%B1ol')
    })

    it('Encodes Russian Cyrillic', () => {
      expect(encodeString('Привет')).toBe(
        '%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82',
      )
    })

    it('Encodes Arabic', () => {
      expect(encodeString('مرحبا')).toBe('%D9%85%D8%B1%D8%AD%D8%A8%D8%A7')
    })
  })

  describe('Complex strings', () => {
    it('Encodes URL with special characters', () => {
      expect(encodeString('https://example.com/path?q=test')).toBe(
        'https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dtest',
      )
    })

    it('Encodes email addresses', () => {
      expect(encodeString('user@example.com')).toBe('user%40example.com')
    })

    it('Encodes mixed safe and unsafe characters', () => {
      expect(encodeString('hello-world_test.file~v1 (copy)')).toBe(
        'hello-world_test.file~v1%20(copy)',
      )
    })
  })

  describe('Edge cases', () => {
    it('Handles strings with only spaces', () => {
      expect(encodeString('   ')).toBe('%20%20%20')
    })

    it('Handles strings starting with special characters', () => {
      expect(encodeString(' test')).toBe('%20test')
    })

    it('Handles strings ending with special characters', () => {
      expect(encodeString('test ')).toBe('test%20')
    })

    it('Handles consecutive special characters', () => {
      expect(encodeString('test   value')).toBe('test%20%20%20value')
    })

    it('Encodes lone surrogates', () => {
      // Create a string with a lone high surrogate
      const malformedString = String.fromCodePoint(0xd800)
      expect(encodeString(malformedString)).toBe('%ED%A0%80')
    })

    it('Handles string with multibyte char followed by ASCII needing no encoding', () => {
      expect(encodeString('日a')).toBe('%E6%97%A5a')
    })

    it('Handles string with only multibyte characters', () => {
      expect(encodeString('日本')).toBe('%E6%97%A5%E6%9C%AC')
    })

    it('Handles emoji followed by ASCII', () => {
      expect(encodeString('🚀test')).toBe('%F0%9F%9A%80test')
    })

    it('Handles lone surrogate followed by regular character', () => {
      // Lone high surrogate + ASCII
      const str = String.fromCodePoint(0xd800) + 'a'
      expect(encodeString(str)).toBe('%ED%A0%80a')
    })
  })
})

describe('stringify', () => {
  describe('Basic functionality', () => {
    it('Returns empty string for empty object', () => {
      expect(stringify({})).toBe('')
    })

    it('Returns empty string for null', () => {
      expect(stringify(null)).toBe('')
    })

    it('Returns empty string for non-object inputs', () => {
      expect(stringify('string')).toBe('')
      expect(stringify(123)).toBe('')
      expect(stringify(true)).toBe('')
      expect(stringify(undefined)).toBe('')
    })

    it('Handles single string parameter', () => {
      expect(stringify({ key: 'value' })).toBe('key=value')
    })

    it('Handles multiple string parameters', () => {
      expect(stringify({ a: 'x', b: 'y', c: 'z' })).toBe('a=x&b=y&c=z')
    })
  })

  describe('Different value types', () => {
    it('Handles string values', () => {
      expect(stringify({ name: 'John' })).toBe('name=John')
    })

    it('Handles number values', () => {
      expect(stringify({ age: 25 })).toBe('age=25')
    })

    it('Handles boolean values', () => {
      expect(stringify({ active: true, deleted: false })).toBe(
        'active=true&deleted=false',
      )
    })

    it('Handles bigint values', () => {
      expect(stringify({ id: BigInt(12345) })).toBe('id=12345')
    })

    it('Handles large bigint values', () => {
      expect(stringify({ id: BigInt('9007199254740991') })).toBe(
        'id=9007199254740991',
      )
    })

    it('Handles very large numbers (>1e21) with encoding', () => {
      const largeNum = 1e22
      const result = stringify({ num: largeNum })
      expect(result).toContain('num=')
      // Large numbers get converted to string and encoded
      expect(result).toBe('num=1e%2B22')
    })

    it('Handles floating point numbers', () => {
      expect(stringify({ price: 19.99 })).toBe('price=19.99')
    })

    it('Handles zero', () => {
      expect(stringify({ count: 0 })).toBe('count=0')
    })

    it('Handles negative numbers', () => {
      expect(stringify({ temp: -5 })).toBe('temp=-5')
    })

    it('Handles mixed types', () => {
      expect(
        stringify({
          name: 'Product',
          price: 99.99,
          available: true,
          id: BigInt(123),
        }),
      ).toBe('name=Product&price=99.99&available=true&id=123')
    })
  })

  describe('Special value handling', () => {
    it('Ignores null values', () => {
      expect(stringify({ key: null })).toBe('key=')
    })

    it('Ignores undefined values', () => {
      expect(stringify({ key: undefined })).toBe('key=')
    })

    it('Handles NaN as empty string', () => {
      expect(stringify({ value: Number.NaN })).toBe('value=')
    })

    it('Handles Infinity as empty string', () => {
      expect(stringify({ value: Infinity })).toBe('value=')
    })

    it('Handles -Infinity as empty string', () => {
      expect(stringify({ value: -Infinity })).toBe('value=')
    })

    it('Handles empty string values', () => {
      expect(stringify({ key: '' })).toBe('key=')
    })
  })

  describe('Array values', () => {
    it('Handles array of strings', () => {
      expect(stringify({ tags: ['a', 'b', 'c'] })).toBe('tags=a&tags=b&tags=c')
    })

    it('Handles array of numbers', () => {
      expect(stringify({ ids: [1, 2, 3] })).toBe('ids=1&ids=2&ids=3')
    })

    it('Handles array of booleans', () => {
      expect(stringify({ flags: [true, false, true] })).toBe(
        'flags=true&flags=false&flags=true',
      )
    })

    it('Handles array of mixed types', () => {
      expect(stringify({ values: ['text', 42, true] })).toBe(
        'values=text&values=42&values=true',
      )
    })

    it('Handles empty array', () => {
      expect(stringify({ items: [] })).toBe('')
    })

    it('Handles array with null and undefined', () => {
      expect(stringify({ items: [null, undefined, 'test'] })).toBe(
        'items=&items=&items=test',
      )
    })

    it('Handles single element array', () => {
      expect(stringify({ item: ['single'] })).toBe('item=single')
    })

    it('Handles multiple arrays', () => {
      expect(stringify({ a: ['x', 'y'], b: ['1', '2'] })).toBe(
        'a=x&a=y&b=1&b=2',
      )
    })
  })

  describe('URL encoding', () => {
    it('Encodes spaces in values', () => {
      expect(stringify({ text: 'hello world' })).toBe('text=hello%20world')
    })

    it('Encodes special characters in values', () => {
      expect(stringify({ email: 'user@example.com' })).toBe(
        'email=user%40example.com',
      )
    })

    it('Encodes special characters in keys', () => {
      expect(stringify({ 'user[name]': 'John' })).toBe('user%5Bname%5D=John')
    })

    it('Encodes Unicode characters', () => {
      expect(stringify({ greeting: '你好' })).toBe(
        'greeting=%E4%BD%A0%E5%A5%BD',
      )
    })

    it('Encodes emojis', () => {
      expect(stringify({ emoji: '🚀' })).toBe('emoji=%F0%9F%9A%80')
    })

    it('Encodes ampersands', () => {
      expect(stringify({ code: 'a&b' })).toBe('code=a%26b')
    })

    it('Encodes equals signs', () => {
      expect(stringify({ expr: '1=1' })).toBe('expr=1%3D1')
    })

    it('Encodes question marks', () => {
      expect(stringify({ query: 'what?' })).toBe('query=what%3F')
    })
  })

  describe('Complex scenarios', () => {
    it('Handles real-world pagination params', () => {
      expect(stringify({ page: 1, limit: 50, offset: 0 })).toBe(
        'page=1&limit=50&offset=0',
      )
    })

    it('Handles search filters', () => {
      expect(
        stringify({
          q: 'laptop',
          category: 'electronics',
          minPrice: 500,
          maxPrice: 2000,
        }),
      ).toBe('q=laptop&category=electronics&minPrice=500&maxPrice=2000')
    })

    it('Handles API query with includes', () => {
      expect(
        stringify({
          include: 'author,comments',
          fields: 'id,title,body',
          sort: '-created_at',
        }),
      ).toBe(
        'include=author%2Ccomments&fields=id%2Ctitle%2Cbody&sort=-created_at',
      )
    })

    it('Handles mixed arrays and single values', () => {
      expect(
        stringify({
          foo: ['bar', 'baz'],
          single: 'value',
          num: 123,
        }),
      ).toBe('foo=bar&foo=baz&single=value&num=123')
    })

    it('Handles complex object with many types', () => {
      expect(
        stringify({
          string: 'text',
          number: 42,
          bool: true,
          bigint: BigInt(999),
          array: ['a', 'b'],
        }),
      ).toBe('string=text&number=42&bool=true&bigint=999&array=a&array=b')
    })
  })

  describe('Key ordering', () => {
    it('Preserves key order from Object.keys()', () => {
      const result = stringify({ z: '1', a: '2', m: '3' })
      // Object.keys() order is insertion order for string keys
      expect(result).toBe('z=1&a=2&m=3')
    })
  })

  describe('Edge cases', () => {
    it('Handles object with no enumerable properties', () => {
      const obj = Object.create(null)
      expect(stringify(obj)).toBe('')
    })

    it('Handles keys with empty values', () => {
      expect(stringify({ a: '', b: '', c: 'value' })).toBe('a=&b=&c=value')
    })

    it('Handles whitespace-only values', () => {
      expect(stringify({ key: '   ' })).toBe('key=%20%20%20')
    })

    it('Handles very long strings', () => {
      const longString = 'a'.repeat(1000)
      const result = stringify({ data: longString })
      expect(result).toBe(`data=${longString}`)
    })

    it('Handles large number of parameters', () => {
      const params: Record<`param${number}`, `value${number}`> = {}
      for (let i = 0; i < 100; i++) {
        params[`param${i}`] = `value${i}`
      }

      const result = stringify(params)

      expect(result.split('&')).toHaveLength(100)
      expect(result).toContain('param0=value0')
      expect(result).toContain('param99=value99')
    })

    it('Handles arrays with many elements', () => {
      const items = Array.from({ length: 50 }, (_, i) => `item${i}`)

      const result = stringify({ items })

      expect(result.split('&')).toHaveLength(50)
      expect(result).toContain('items=item0')
      expect(result).toContain('items=item49')
    })
  })
})
