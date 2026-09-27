import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { createCategory } from 'test/e2e/create-category'
import { createTransaction } from 'test/e2e/create-transaction'
import { errorCode, graphqlRequest } from 'test/e2e/graphql-request'

const DELETE_CATEGORY = 'mutation ($id: ID!) { deleteCategory(id: $id) }'

describe('deleteCategory (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should delete a category', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, token)

    const response = await graphqlRequest(app, DELETE_CATEGORY, {
      token,
      variables: { id: categoryId },
    })
    const categories = await graphqlRequest(app, '{ categories { id } }', {
      token,
    })

    expect(response.data).toEqual({ deleteCategory: true })
    expect(categories.data).toEqual({ categories: [] })
  })

  it('should not delete a category that has transactions', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, token)
    await createTransaction(app, token, { categoryId })

    const response = await graphqlRequest(app, DELETE_CATEGORY, {
      token,
      variables: { id: categoryId },
    })

    expect(errorCode(response)).toBe('CONFLICT')
  })

  it('should not delete a category from another user', async () => {
    const owner = await createAndAuthenticateUser(app)
    const intruder = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, owner.token)

    const response = await graphqlRequest(app, DELETE_CATEGORY, {
      token: intruder.token,
      variables: { id: categoryId },
    })

    expect(errorCode(response)).toBe('FORBIDDEN')
  })
})
