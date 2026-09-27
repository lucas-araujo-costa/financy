import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { createCategory } from 'test/e2e/create-category'
import { createTransaction } from 'test/e2e/create-transaction'
import { errorCode, graphqlRequest } from 'test/e2e/graphql-request'

const TRANSACTIONS = `
  query ($filter: TransactionsFilter, $page: Int, $perPage: Int) {
    transactions(filter: $filter, page: $page, perPage: $perPage) {
      total page perPage items { description date }
    }
  }
`

describe('transactions (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should paginate the user transactions, newest first', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const other = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, token)
    const otherCategoryId = await createCategory(app, other.token)

    for (let day = 1; day <= 12; day++) {
      await createTransaction(app, token, {
        categoryId,
        description: `Dia ${day}`,
        date: `2025-11-${String(day).padStart(2, '0')}`,
      })
    }
    await createTransaction(app, other.token, { categoryId: otherCategoryId })

    const response = await graphqlRequest(app, TRANSACTIONS, {
      token,
      variables: { page: 2, perPage: 5 },
    })

    expect(response.data?.transactions).toEqual({
      total: 12,
      page: 2,
      perPage: 5,
      items: [7, 6, 5, 4, 3].map((day) => ({
        description: `Dia ${day}`,
        date: `2025-11-${String(day).padStart(2, '0')}`,
      })),
    })
  })

  it('should combine search, type, category and month', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const foodId = await createCategory(app, token, { title: 'Alimentação' })
    const homeId = await createCategory(app, token, { title: 'Casa' })
    const match = {
      categoryId: homeId,
      description: 'Conta de Água',
      type: 'EXPENSE' as const,
      date: '2025-11-10',
    }

    await createTransaction(app, token, match)
    await createTransaction(app, token, { ...match, type: 'INCOME' })
    await createTransaction(app, token, { ...match, categoryId: foodId })
    await createTransaction(app, token, { ...match, date: '2025-12-01' })
    await createTransaction(app, token, { ...match, description: 'Luz' })

    const response = await graphqlRequest(app, TRANSACTIONS, {
      token,
      variables: {
        filter: {
          search: 'AGUA',
          type: 'EXPENSE',
          categoryId: homeId,
          month: 11,
          year: 2025,
        },
      },
    })

    expect(response.data?.transactions).toMatchObject({
      total: 1,
      items: [{ description: 'Conta de Água', date: '2025-11-10' }],
    })
  })

  it('should require month and year together', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await graphqlRequest(app, TRANSACTIONS, {
      token,
      variables: { filter: { month: 11 } },
    })

    expect(errorCode(response)).toBe('BAD_USER_INPUT')
  })
})
