import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { createCategory } from 'test/e2e/create-category'
import { createTransaction } from 'test/e2e/create-transaction'
import { graphqlRequest } from 'test/e2e/graphql-request'

describe('financialSummary (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return the all-time balance and the month totals', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const categoryId = await createCategory(app, token)

    await createTransaction(app, token, {
      categoryId,
      type: 'INCOME',
      amountInCents: 425000,
      date: '2025-12-01',
    })
    await createTransaction(app, token, {
      categoryId,
      type: 'EXPENSE',
      amountInCents: 8800,
      date: '2025-12-18',
    })
    await createTransaction(app, token, {
      categoryId,
      type: 'EXPENSE',
      amountInCents: 170000,
      date: '2025-11-26',
    })

    const response = await graphqlRequest(
      app,
      `{
        financialSummary(month: 12, year: 2025) {
          balanceInCents monthIncomeInCents monthExpenseInCents
        }
      }`,
      { token },
    )

    expect(response.data?.financialSummary).toEqual({
      balanceInCents: 425000 - 8800 - 170000,
      monthIncomeInCents: 425000,
      monthExpenseInCents: 8800,
    })
  })
})
