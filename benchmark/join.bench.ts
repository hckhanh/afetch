import { bench, describe } from 'vitest'
import { join } from '../src'

describe('join benchmarks', () => {
  describe('Basic joins', () => {
    bench('Simple join without separators at boundaries', () => {
      join('first', ',', 'second')
    })

    bench('Join with separator at end of first part', () => {
      join('first,', ',', 'second')
    })

    bench('Join with separator at start of second part', () => {
      join('first', ',', ',second')
    })

    bench('Both parts have separator at boundary', () => {
      join('first,', ',', ',second')
    })
  })

  describe('URL path separators', () => {
    bench('Join URL parts with slash', () => {
      join('http://example.com', '/', '/path/to/resource')
    })

    bench('Join URL with trailing slash', () => {
      join('http://example.com/', '/', 'path')
    })

    bench('Join URL parts both with slash', () => {
      join('http://example.com/', '/', '/path')
    })

    bench('Join deep URL paths', () => {
      join('http://example.com/api/v1/', '/', '/users/123/posts')
    })
  })

  describe('Query string separators', () => {
    bench('Join query parts with ampersand', () => {
      join('param1=value1', '&', 'param2=value2')
    })

    bench('Join with leading ampersand', () => {
      join('param1=value1', '&', '&param2=value2')
    })

    bench('Join empty first part with query', () => {
      join('', '?', '?query=test')
    })

    bench('Join URL path with query string', () => {
      join('http://example.com/path', '?', 'search=test&limit=10')
    })
  })

  describe('Edge cases', () => {
    bench('Both parts empty', () => {
      join('', ',', '')
    })

    bench('First part empty', () => {
      join('', '/', '/second')
    })

    bench('Second part empty', () => {
      join('first/', '/', '')
    })

    bench('Multiple separators in content', () => {
      join('a|b|c', '|', '|d|e|f')
    })

    bench('Long strings with separator', () => {
      join(
        'http://example.com/very/long/path/with/many/segments/',
        '/',
        '/and/more/segments/here',
      )
    })
  })

  describe('Different separators', () => {
    bench('Comma separator', () => {
      join('first', ',', 'second')
    })

    bench('Slash separator', () => {
      join('first', '/', 'second')
    })

    bench('Ampersand separator', () => {
      join('first', '&', 'second')
    })

    bench('Question mark separator', () => {
      join('path', '?', 'query')
    })

    bench('Pipe separator', () => {
      join('first', '|', 'second')
    })
  })
})
