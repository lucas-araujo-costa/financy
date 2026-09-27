import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { createCategory } from 'test/e2e/create-category'
import { createTransaction } from 'test/e2e/create-transaction'
import { errorCode, graphqlRequest } from 'test/e2e/graphql-request'

const EDIT_CATEGORY = `
  mutation ($id: ID!, $input: CategoryInput!) {
    editCategory(id: $id, input: $input) {
      title icon color transactionsCount totalInCents
    }
  }
`
const input = { title: 'Transporte', icon: 'car-front', color: 'purple' }

describe('editCategory (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should edit a category and return its stats', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, token)
    await createTransaction(app, token, { categoryId, amountInCents: 1000 })

    const response = await graphqlRequest(app, EDIT_CATEGORY, {
      token,
      variables: { id: categoryId, input },
    })

    expect(response.data?.editCategory).toEqual({
      ...input,
      transactionsCount: 1,
      totalInCents: 1000,
    })
  })

  it('should not edit a category from another user', async () => {
    const owner = await createAndAuthenticateUser(app)
    const intruder = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, owner.token)

    const response = await graphqlRequest(app, EDIT_CATEGORY, {
      token: intruder.token,
      variables: { id: categoryId, input },
    })

    expect(errorCode(response)).toBe('FORBIDDEN')
  })
})
