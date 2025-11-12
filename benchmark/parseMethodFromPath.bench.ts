import { bench, describe } from 'vitest'
import { parseMethodFromPath } from '../src/utils'

describe('parseMethodFromPath benchmarks', () => {
  bench('parse @get prefix', () => {
    parseMethodFromPath('@get/users')
  })

  bench('parse @post prefix', () => {
    parseMethodFromPath('@post/users')
  })

  bench('parse @put prefix with params', () => {
    parseMethodFromPath('@put/users/:id')
  })

  bench('parse @delete prefix', () => {
    parseMethodFromPath('@delete/users/:id')
  })

  bench('parse @patch prefix', () => {
    parseMethodFromPath('@patch/users/:id')
  })

  bench('parse path without prefix', () => {
    parseMethodFromPath('/users')
  })

  bench('parse path without prefix with params', () => {
    parseMethodFromPath('/users/:id/posts/:postId')
  })

  bench('parse @get without path', () => {
    parseMethodFromPath('@get')
  })

  bench('parse case-insensitive @GeT prefix', () => {
    parseMethodFromPath('@GeT/users')
  })

  bench('parse complex path with @post prefix', () => {
    parseMethodFromPath('@post/api/v1/users/:userId/posts/:postId/comments')
  })
})
