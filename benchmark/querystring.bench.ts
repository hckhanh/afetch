import { bench, describe } from 'vitest'
import { encodeString } from '../src/querystring/node.ts'
import { stringify } from '../src/querystring/stringify.ts'

describe('encodeString benchmarks', () => {
  describe('String length scaling', () => {
    bench('Empty string', () => {
      encodeString('')
    })

    bench('Short ASCII string (10 chars)', () => {
      encodeString('helloworld')
    })

    bench('Medium ASCII string (50 chars)', () => {
      encodeString('The quick brown fox jumps over the lazy dog twice')
    })

    bench('Long ASCII string (200 chars)', () => {
      encodeString(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      )
    })

    bench('Very long ASCII string (1000 chars)', () => {
      encodeString('a'.repeat(1000))
    })
  })

  describe('Character type variations', () => {
    bench('Pure alphanumeric (no encoding needed)', () => {
      encodeString(
        'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      )
    })

    bench('Safe special characters (no encoding needed)', () => {
      encodeString('test-file_name.extension~version1.0!(hello)*')
    })

    bench('All spaces (maximum encoding)', () => {
      encodeString('     ')
    })

    bench('Mixed safe and unsafe (50% encoding)', () => {
      encodeString('hello world & goodbye universe @ tomorrow')
    })

    bench('Heavy special characters (75% encoding)', () => {
      encodeString(String.raw`!@#$%^&*()+={}[]|\:;"'<>?,/`)
    })
  })

  describe('Unicode and multi-byte characters', () => {
    bench('2-byte UTF-8 characters', () => {
      encodeString('café résumé naïve')
    })

    bench('3-byte UTF-8 characters (CJK)', () => {
      encodeString('日本語中文한국어')
    })

    bench('4-byte UTF-8 characters (emojis)', () => {
      encodeString('🚀🎉💯👍🔥')
    })

    bench('Mixed ASCII and Unicode', () => {
      encodeString('Hello 世界! Welcome to 日本 🚀')
    })

    bench('Various language scripts', () => {
      encodeString(
        'English Español Français Deutsch 日本語 中文 العربية Русский',
      )
    })
  })

  describe('Real-world patterns', () => {
    bench('Email address', () => {
      encodeString('user.name+tag@example.com')
    })

    bench('URL path', () => {
      encodeString('https://example.com/path/to/resource?query=value')
    })

    bench('JSON-like string', () => {
      encodeString('{"key":"value","number":123,"bool":true}')
    })

    bench('SQL-like query', () => {
      encodeString("SELECT * FROM users WHERE name = 'John' AND age > 25")
    })

    bench('File path with spaces', () => {
      encodeString('/Users/username/My Documents/important file (copy).pdf')
    })

    bench('Search query with special chars', () => {
      encodeString('how to use "quotes" & special chars?')
    })
  })
})

describe('stringify benchmarks', () => {
  describe('Parameter count scaling', () => {
    bench('Empty object', () => {
      stringify({})
    })

    bench('Single parameter', () => {
      stringify({ key: 'value' })
    })

    bench('Two parameters', () => {
      stringify({ key1: 'value1', key2: 'value2' })
    })

    bench('Five parameters', () => {
      stringify({
        param1: 'value1',
        param2: 'value2',
        param3: 'value3',
        param4: 'value4',
        param5: 'value5',
      })
    })

    bench('Ten parameters', () => {
      stringify({
        param1: 'value1',
        param2: 'value2',
        param3: 'value3',
        param4: 'value4',
        param5: 'value5',
        param6: 'value6',
        param7: 'value7',
        param8: 'value8',
        param9: 'value9',
        param10: 'value10',
      })
    })

    bench('Twenty parameters', () => {
      stringify({
        param1: 'value1',
        param2: 'value2',
        param3: 'value3',
        param4: 'value4',
        param5: 'value5',
        param6: 'value6',
        param7: 'value7',
        param8: 'value8',
        param9: 'value9',
        param10: 'value10',
        param11: 'value11',
        param12: 'value12',
        param13: 'value13',
        param14: 'value14',
        param15: 'value15',
        param16: 'value16',
        param17: 'value17',
        param18: 'value18',
        param19: 'value19',
        param20: 'value20',
      })
    })

    bench('Fifty parameters', () => {
      const params: Record<`param${number}`, `value${number}`> = {}

      for (let i = 1; i <= 50; i++) {
        params[`param${i}`] = `value${i}`
      }

      stringify(params)
    })
  })

  describe('Value types', () => {
    bench('String values only', () => {
      stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        city: 'New York',
        country: 'USA',
      })
    })

    bench('Number values only', () => {
      stringify({
        age: 25,
        score: 98,
        count: 150,
        rating: 4,
        price: 19.99,
      })
    })

    bench('Boolean values only', () => {
      stringify({
        active: true,
        verified: false,
        premium: true,
        deleted: false,
        featured: true,
      })
    })

    bench('BigInt values only', () => {
      stringify({
        userId: BigInt(9007199254740991),
        timestamp: BigInt(1609459200000),
        transactionId: BigInt(123456789),
        value: BigInt(100),
      })
    })

    bench('Mixed primitive types', () => {
      stringify({
        name: 'Product',
        price: 99.99,
        inStock: true,
        quantity: 5,
        id: BigInt(12345),
        featured: false,
        weight: 2.5,
        available: true,
      })
    })
  })

  describe('Array values', () => {
    bench('Small array (3 items)', () => {
      stringify({
        tags: ['javascript', 'typescript', 'node'],
      })
    })

    bench('Medium array (10 items)', () => {
      stringify({
        items: Array.from({ length: 10 }, (_, i) => `item${i}`),
      })
    })

    bench('Large array (50 items)', () => {
      stringify({
        ids: Array.from({ length: 50 }, (_, i) => i),
      })
    })

    bench('Multiple arrays', () => {
      stringify({
        tags: ['a', 'b', 'c'],
        categories: ['cat1', 'cat2'],
        ids: [1, 2, 3, 4, 5],
      })
    })

    bench('Array of mixed types', () => {
      stringify({
        values: ['text', 42, true, 'another', 99, false],
      })
    })
  })

  describe('Value length scaling', () => {
    bench('Short values (5 chars each)', () => {
      stringify({
        key1: 'short',
        key2: 'value',
        key3: 'test',
        key4: 'data',
        key5: 'quick',
      })
    })

    bench('Medium values (20 chars each)', () => {
      stringify({
        key1: 'a medium length value',
        key2: 'another medium value',
        key3: 'yet another one here',
        key4: 'more medium content!',
      })
    })

    bench('Long values (50 chars each)', () => {
      stringify({
        description: 'This is a very long description that contains many words',
        content: 'Another long string with lots of characters in it here',
        text: 'Yet another really long value to test performance with',
      })
    })

    bench('Very long values (200 chars each)', () => {
      stringify({
        data: 'a'.repeat(200),
        content: 'b'.repeat(200),
        text: 'c'.repeat(200),
      })
    })
  })

  describe('Special characters and encoding', () => {
    bench('No encoding needed (pure alphanumeric)', () => {
      stringify({
        key1: 'simplevalue',
        key2: 'anothervalue',
        key3: 'testdata',
      })
    })

    bench('Light encoding (spaces only)', () => {
      stringify({
        search: 'hello world',
        title: 'my title',
        description: 'some description',
      })
    })

    bench('Medium encoding (common special chars)', () => {
      stringify({
        email: 'user@example.com',
        url: 'https://example.com/path',
        query: 'key=value&other=test',
      })
    })

    bench('Heavy encoding (many special chars)', () => {
      stringify({
        'key[1]': 'value',
        'filter[status]': 'active',
        'data{nested}': 'test',
        'query<tag>': 'value',
      })
    })

    bench('Unicode characters', () => {
      stringify({
        name: '日本語',
        emoji: '🚀',
        text: 'Héllo Wörld',
        greeting: '你好世界',
      })
    })

    bench('Mixed encoding complexity', () => {
      stringify({
        simple: 'value',
        withSpaces: 'hello world',
        email: 'user@example.com',
        unicode: '日本語',
        emoji: '🚀',
      })
    })
  })

  describe('Real-world use cases', () => {
    bench('Pagination params', () => {
      stringify({
        page: 1,
        limit: 50,
        offset: 0,
        sort: 'created_at',
        order: 'desc',
      })
    })

    bench('Search with filters', () => {
      stringify({
        q: 'laptop',
        category: 'electronics',
        minPrice: 500,
        maxPrice: 2000,
        brand: 'Apple',
        inStock: true,
        rating: 4,
        freeShipping: true,
      })
    })

    bench('API query with includes', () => {
      stringify({
        include: 'author,comments,tags',
        fields: 'id,title,body,created_at',
        sort: '-created_at',
        page: 1,
        limit: 20,
      })
    })

    bench('Form submission data', () => {
      stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        newsletter: true,
      })
    })

    bench('E-commerce cart params', () => {
      stringify({
        productId: 12345,
        quantity: 2,
        color: 'blue',
        size: 'large',
        gift: false,
        giftMessage: '',
        couponCode: 'SAVE20',
        shipping: 'express',
      })
    })

    bench('Analytics tracking params', () => {
      stringify({
        event: 'page_view',
        userId: BigInt(9876543210),
        sessionId: 'abc123def456',
        timestamp: 1609459200000,
        referrer: 'https://google.com',
        campaign: 'summer_sale',
        source: 'email',
        medium: 'newsletter',
      })
    })

    bench('Multi-select filter params', () => {
      stringify({
        categories: ['electronics', 'computers', 'accessories'],
        brands: ['Apple', 'Dell', 'HP'],
        priceRanges: ['0-500', '500-1000', '1000-2000'],
        features: ['wifi', 'bluetooth', 'touchscreen'],
      })
    })
  })

  describe('Edge cases', () => {
    bench('Empty arrays', () => {
      stringify({
        items: [],
        tags: [],
        categories: [],
      })
    })

    bench('Null and undefined values', () => {
      stringify({
        key1: null,
        key2: undefined,
        key3: 'value',
        key4: null,
      })
    })

    bench('Empty string values', () => {
      stringify({
        key1: '',
        key2: '',
        key3: '',
        key4: 'value',
      })
    })

    bench('Special numeric values', () => {
      stringify({
        zero: 0,
        negative: -42,
        float: Math.PI,
        nan: Number.NaN,
        infinity: Infinity,
        negInfinity: -Infinity,
      })
    })
  })

  describe('Comparison scenarios', () => {
    const smallObject = {
      page: 1,
      limit: 20,
    }

    const mediumObject = {
      search: 'laptop',
      category: 'electronics',
      minPrice: 500,
      maxPrice: 2000,
      brand: 'Apple',
      inStock: true,
      sort: 'price',
      order: 'asc',
      page: 1,
      limit: 20,
    }

    const largeObject = {
      ...mediumObject,
      tags: ['portable', 'powerful', 'lightweight'],
      features: ['wifi', 'bluetooth', 'usb-c', 'hdmi', 'backlit-keyboard'],
      colors: ['silver', 'space-gray', 'gold'],
      sizes: ['13-inch', '15-inch', '16-inch'],
      warranties: ['1-year', '2-year', '3-year'],
      shippingOptions: ['standard', 'express', 'overnight'],
    }

    bench('Small object (2 params)', () => {
      stringify(smallObject)
    })

    bench('Medium object (10 params)', () => {
      stringify(mediumObject)
    })

    bench('Large object (16 params with arrays)', () => {
      stringify(largeObject)
    })
  })
})
