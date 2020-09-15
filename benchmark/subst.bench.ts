import { bench, describe } from 'vitest'
import { subst } from '../src'

describe('subst benchmarks', () => {
  describe('Parameter count scaling', () => {
    bench('Empty template', () => {
      subst('', {})
    })

    bench('Single parameter', () => {
      subst(':id', { id: 42 })
    })

    bench('Two parameters', () => {
      subst('/:userId/:postId', { userId: 123, postId: 456 })
    })

    bench('Three parameters (original)', () => {
      subst('/:p/:q/:r', { p: 1, q: 'a', r: false })
    })

    bench('Five parameters', () => {
      subst('/:a/:b/:c/:d/:e', {
        a: 'first',
        b: 'second',
        c: 'third',
        d: 'fourth',
        e: 'fifth',
      })
    })

    bench('Ten parameters', () => {
      subst('/:p1/:p2/:p3/:p4/:p5/:p6/:p7/:p8/:p9/:p10', {
        p1: 1,
        p2: 2,
        p3: 3,
        p4: 4,
        p5: 5,
        p6: 6,
        p7: 7,
        p8: 8,
        p9: 9,
        p10: 10,
      })
    })
  })

  describe('Different value types', () => {
    bench('String values', () => {
      subst('/:firstName/:lastName', {
        firstName: 'John',
        lastName: 'Doe',
      })
    })

    bench('Number values', () => {
      subst('/:id/:page/:limit', {
        id: 123,
        page: 1,
        limit: 50,
      })
    })

    bench('Boolean values', () => {
      subst('/:enabled/:verified', {
        enabled: true,
        verified: false,
      })
    })

    bench('Mixed value types', () => {
      subst('/:name/:count/:active', {
        name: 'test',
        count: 42,
        active: true,
      })
    })
  })

  describe('Template patterns', () => {
    bench('Parameter at beginning', () => {
      subst(':resource/items', { resource: 'users' })
    })

    bench('Parameter at end', () => {
      subst('/api/v1/:resource', { resource: 'posts' })
    })

    bench('Parameters with static segments', () => {
      subst('/users/:userId/posts/:postId/comments', {
        userId: 123,
        postId: 456,
      })
    })

    bench('Consecutive parameters', () => {
      subst('/:year/:month/:day', {
        year: 2024,
        month: 10,
        day: 30,
      })
    })

    bench('Long template with many segments', () => {
      subst(
        '/api/:version/org/:orgId/project/:projectId/repo/:repoId/branch/:branchId',
        {
          version: 'v2',
          orgId: 'acme',
          projectId: 'web',
          repoId: 'frontend',
          branchId: 'main',
        },
      )
    })
  })

  describe('Real-world patterns', () => {
    bench('REST API resource path', () => {
      subst('/api/v1/users/:id', { id: 12345 })
    })

    bench('Nested resource path', () => {
      subst('/users/:userId/posts/:postId', {
        userId: 123,
        postId: 456,
      })
    })

    bench('Deep nesting with IDs', () => {
      subst('/orgs/:orgId/teams/:teamId/members/:memberId', {
        orgId: 'acme',
        teamId: 'engineering',
        memberId: 'john',
      })
    })

    bench('Date-based path', () => {
      subst('/archive/:year/:month/:day/:slug', {
        year: 2024,
        month: 10,
        day: 30,
        slug: 'article-title',
      })
    })

    bench('Versioned API endpoint', () => {
      subst('/:version/:resource/:id', {
        version: 'v2',
        resource: 'users',
        id: 789,
      })
    })
  })

  describe('Special characters', () => {
    bench('Values with spaces', () => {
      subst('/:title', { title: 'hello world' })
    })

    bench('Values with special chars', () => {
      subst('/:email/:tag', {
        email: 'user@example.com',
        tag: 'important!',
      })
    })

    bench('Long parameter values', () => {
      subst('/:description', {
        description:
          'This is a very long description that contains many characters',
      })
    })

    bench('Unicode in values', () => {
      subst('/:name/:emoji', {
        name: '日本語',
        emoji: '🚀',
      })
    })
  })

  describe('Template complexity', () => {
    bench('Simple single-segment template', () => {
      subst(':id', { id: 42 })
    })

    bench('Medium complexity template', () => {
      subst('/api/:version/resource/:id', {
        version: 'v1',
        id: 123,
      })
    })

    bench('Complex multi-level template', () => {
      subst('/:category/:subcategory/:itemId/details/:section', {
        category: 'electronics',
        subcategory: 'laptops',
        itemId: 'mbp-2024',
        section: 'specs',
      })
    })

    bench('Very deep template (8 levels)', () => {
      subst('/:l1/:l2/:l3/:l4/:l5/:l6/:l7/:l8', {
        l1: 'a',
        l2: 'b',
        l3: 'c',
        l4: 'd',
        l5: 'e',
        l6: 'f',
        l7: 'g',
        l8: 'h',
      })
    })
  })

  describe('Parameter name patterns', () => {
    bench('Short parameter names', () => {
      subst('/:a/:b/:c', { a: 1, b: 2, c: 3 })
    })

    bench('Long parameter names', () => {
      subst('/:userId/:articleId/:commentId', {
        userId: 123,
        articleId: 456,
        commentId: 789,
      })
    })

    bench('CamelCase parameter names', () => {
      subst('/:firstName/:lastName/:emailAddress', {
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
      })
    })

    bench('Underscore parameter names', () => {
      subst('/:user_id/:post_id/:comment_id', {
        user_id: 1,
        post_id: 2,
        comment_id: 3,
      })
    })
  })
})
