import { bench, describe } from 'vitest'
import { createUrl } from '../src'

describe('createUrl benchmarks', () => {
  describe('Simple cases', () => {
    bench('Concatenate base URL and path only', () => {
      createUrl('http://example.com', '/path')
    })

    bench('Base URL with trailing slash + path', () => {
      createUrl('http://example.com/', '/path')
    })

    bench('Single path parameter', () => {
      createUrl('http://example.com/', '/users/:id', { id: 123 })
    })

    bench('Single query parameter', () => {
      createUrl('http://example.com/path', { search: 'test' })
    })
  })

  describe('Medium complexity', () => {
    bench('Two path params + two query params', () => {
      createUrl('http://example.com/', '/users/:userId/posts/:postId', {
        userId: 123,
        postId: 456,
        sort: 'date',
        order: 'desc',
      })
    })

    bench('Multiple query params (5 params)', () => {
      createUrl('http://example.com/api/search', {
        q: 'javascript',
        category: 'programming',
        limit: 20,
        offset: 0,
        sort: 'relevance',
      })
    })

    bench('Path params with special characters', () => {
      createUrl('http://example.com/', '/search/:query', {
        query: 'hello world',
        filter: 'tag:important',
      })
    })
  })

  describe('Complex cases', () => {
    bench('Complex URL with many params (original test)', () => {
      createUrl(
        'http://example.com/',
        '/users/:userId/posts/:postId/comments',
        {
          userId: 123,
          postId: 987,
          authorId: 456,
          limit: 10,
          offset: 120,
          frappucino: 'muffin',
          goat: 'scone',
          pond: 'moose',
          foo: ['bar', 'baz', 'bal'],
          bool: true,
          bigIntKey: BigInt(100),
          numberKey: 256,
        },
      )
    })

    bench('Deep path with 5 parameters', () => {
      createUrl(
        'http://example.com/',
        '/api/:version/users/:userId/projects/:projectId/tasks/:taskId/comments/:commentId',
        {
          version: 'v2',
          userId: 123,
          projectId: 456,
          taskId: 789,
          commentId: 101,
          include: 'author,metadata',
          fields: 'id,title,body',
        },
      )
    })

    bench('Large query string (15 params)', () => {
      createUrl('http://example.com/api/data', {
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
      })
    })
  })

  describe('Real-world patterns', () => {
    bench('REST API endpoint with pagination', () => {
      createUrl('http://api.example.com/', '/v1/users', {
        page: 1,
        limit: 50,
        sort: 'created_at',
        order: 'desc',
      })
    })

    bench('Search endpoint with filters', () => {
      createUrl('http://api.example.com/', '/search', {
        q: 'typescript',
        type: 'repository',
        language: 'typescript',
        stars: '>1000',
        sort: 'stars',
      })
    })

    bench('Resource with ID and nested resource', () => {
      createUrl('http://api.example.com/', '/users/:id/posts/:postId', {
        id: 42,
        postId: 123,
        include: 'comments,author',
      })
    })

    bench('URL with port number', () => {
      createUrl('http://localhost:8080/', '/api/:version/health', {
        version: 'v1',
        verbose: true,
      })
    })
  })

  describe('Edge cases', () => {
    bench('Base template only (no path)', () => {
      createUrl('http://example.com/:resource', {
        resource: 'users',
        page: 1,
      })
    })

    bench('Empty params object', () => {
      createUrl('http://example.com/', '/path')
    })

    bench('Boolean and number params', () => {
      createUrl('http://example.com/', '/settings/:feature', {
        feature: 'dark-mode',
        enabled: true,
        opacity: 0.8,
        count: 100,
      })
    })

    bench('Array in query params', () => {
      createUrl('http://example.com/filter', {
        tags: ['javascript', 'typescript', 'node'],
        active: true,
      })
    })
  })
})
