import { bench, describe } from 'vitest'
import { query } from '../src'

describe('query benchmarks', () => {
  describe('Parameter count scaling', () => {
    bench('Empty object', () => {
      query({})
    })

    bench('Single parameter', () => {
      query({ key: 'value' })
    })

    bench('Two parameters', () => {
      query({ key1: 'value1', key2: 'value2' })
    })

    bench('Five parameters', () => {
      query({
        search: 'test',
        category: 'books',
        limit: 20,
        offset: 0,
        sort: 'date',
      })
    })

    bench('Ten parameters', () => {
      query({
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
      query({
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
  })

  describe('Different value types', () => {
    bench('String values only', () => {
      query({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      })
    })

    bench('Number values only', () => {
      query({
        age: 25,
        score: 98,
        count: 150,
        rating: 4,
      })
    })

    bench('Boolean values only', () => {
      query({
        active: true,
        verified: false,
        premium: true,
        deleted: false,
      })
    })

    bench('Mixed types', () => {
      query({
        name: 'Product',
        price: 99.99,
        inStock: true,
        quantity: 5,
        featured: false,
      })
    })

    bench('Array values', () => {
      query({
        tags: ['javascript', 'typescript', 'node'],
        categories: ['web', 'backend'],
        ids: [1, 2, 3, 4, 5],
      })
    })

    bench('BigInt values', () => {
      query({
        userId: BigInt(9007199254740991),
        timestamp: BigInt(1609459200000),
        value: BigInt(100),
      })
    })
  })

  describe('Special characters', () => {
    bench('Values with spaces', () => {
      query({
        search: 'hello world',
        title: 'A long title with spaces',
        description: 'Some description text',
      })
    })

    bench('Values with special characters', () => {
      query({
        email: 'user@example.com',
        url: 'https://example.com/path',
        query: 'key=value&other=test',
      })
    })

    bench('Keys with special characters', () => {
      query({
        'user[name]': 'John',
        'filter[status]': 'active',
        'sort[by]': 'date',
      })
    })

    bench('Unicode characters', () => {
      query({
        name: '日本語',
        emoji: '🚀',
        text: 'Héllo Wörld',
      })
    })
  })

  describe('Real-world patterns', () => {
    bench('Pagination params', () => {
      query({
        page: 1,
        limit: 50,
        offset: 0,
      })
    })

    bench('Search with filters', () => {
      query({
        q: 'laptop',
        category: 'electronics',
        minPrice: 500,
        maxPrice: 2000,
        brand: 'Apple',
        inStock: true,
      })
    })

    bench('API query with includes', () => {
      query({
        include: 'author,comments,tags',
        fields: 'id,title,body',
        sort: '-created_at',
      })
    })

    bench('Original complex test', () => {
      query({
        frappucino: 'muffin',
        goat: 'scone',
        pond: 'moose',
        foo: ['bar', 'baz', 'bal'],
        bool: true,
        bigIntKey: BigInt(100),
        numberKey: 256,
      })
    })
  })

  describe('Value length scaling', () => {
    bench('Short values (5 chars)', () => {
      query({
        key1: 'short',
        key2: 'value',
        key3: 'test',
      })
    })

    bench('Medium values (20 chars)', () => {
      query({
        key1: 'a medium length value',
        key2: 'another medium value',
        key3: 'yet another one here',
      })
    })

    bench('Long values (50 chars)', () => {
      query({
        description: 'This is a very long description that contains many words',
        content: 'Another long string with lots of characters in it here',
        text: 'Yet another really long value to test performance with',
      })
    })
  })
})
