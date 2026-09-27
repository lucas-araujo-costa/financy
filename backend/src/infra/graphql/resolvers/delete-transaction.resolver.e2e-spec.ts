import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { createCategory } from 'test/e2e/create-category'
import { createTransaction } from 'test/e2e/create-transaction'
import { errorCode, graphqlRequest } from 'test/e2e/graphql-request'

const DELETE_TRANSACTION = 'mutation ($id: ID!) { deleteTransaction(id: $id) }'

describe('deleteTransaction (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should delete a transaction', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, token)
    const transactionId = await createTransaction(app, token, { categoryId })

    const response = await graphqlRequest(app, DELETE_TRANSACTION, {
      token,
      variables: { id: transactionId },
    })
    const list = await graphqlRequest(app, '{ transactions { total } }', {
      token,
    })

    expect(response.data).toEqual({ deleteTransaction: true })
    expect(list.data).toEqual({ transactions: { total: 0 } })
  })

  it('should not delete a transaction from another user', async () => {
    const owner = await createAndAuthenticateUser(app)
    const intruder = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, owner.token)
    const transactionId = await createTransaction(app, owner.token, {
      categoryId,
    })

    const response = await graphqlRequest(app, DELETE_TRANSACTION, {
      token: intruder.token,
      variables: { id: transactionId },
    })

    expect(errorCode(response)).toBe('FORBIDDEN')
  })

  it('should return not found for an unknown id', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await graphqlRequest(app, DELETE_TRANSACTION, {
      token,
      variables: { id: 'unknown-id' },
    })

    expect(errorCode(response)).toBe('NOT_FOUND')
  })
})
