import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { createCategory } from 'test/e2e/create-category'
import { errorCode, graphqlRequest } from 'test/e2e/graphql-request'

const CREATE_TRANSACTION = `
  mutation ($input: TransactionInput!) {
    createTransaction(input: $input) {
      id description amountInCents type date
      category { id title icon color }
    }
  }
`

describe('createTransaction (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a transaction with the calendar date', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, token)

    const response = await graphqlRequest(app, CREATE_TRANSACTION, {
      token,
      variables: {
        input: {
          description: 'Jantar no Restaurante',
          amountInCents: 8950,
          type: 'EXPENSE',
          date: '2025-11-30',
          categoryId,
        },
      },
    })

    expect(response.data?.createTransaction).toEqual({
      id: expect.any(String),
      description: 'Jantar no Restaurante',
      amountInCents: 8950,
      type: 'EXPENSE',
      date: '2025-11-30',
      category: {
        id: categoryId,
        title: 'Alimentação',
        icon: 'utensils',
        color: 'blue',
      },
    })
  })

  it.each([
    ['a zero amount', { amountInCents: 0 }],
    ['an invalid date', { date: '2025-11-31' }],
    ['a date with time', { date: '2025-11-30T10:00:00Z' }],
  ])('should reject %s', async (_, override) => {
    const { token } = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, token)

    const response = await graphqlRequest(app, CREATE_TRANSACTION, {
      token,
      variables: {
        input: {
          description: 'Jantar',
          amountInCents: 100,
          type: 'EXPENSE',
          date: '2025-11-30',
          categoryId,
          ...override,
        },
      },
    })

    expect(errorCode(response)).toBe('BAD_USER_INPUT')
  })

  it('should not use a category from another user', async () => {
    const owner = await createAndAuthenticateUser(app)
    const intruder = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, owner.token)

    const response = await graphqlRequest(app, CREATE_TRANSACTION, {
      token: intruder.token,
      variables: {
        input: {
          description: 'Jantar',
          amountInCents: 100,
          type: 'EXPENSE',
          date: '2025-11-30',
          categoryId,
        },
      },
    })

    expect(errorCode(response)).toBe('FORBIDDEN')
  })
})
