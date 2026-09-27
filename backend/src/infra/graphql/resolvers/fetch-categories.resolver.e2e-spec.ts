import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { createCategory } from 'test/e2e/create-category'
import { createTransaction } from 'test/e2e/create-transaction'
import { graphqlRequest } from 'test/e2e/graphql-request'

describe('categories (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should list only the user categories with their stats', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const other = await createAndAuthenticateUser(app)
    const foodId = await createCategory(app, token, { title: 'Alimentação' })
    await createCategory(app, token, { title: 'Saúde' })
    await createCategory(app, other.token, { title: 'Outra' })
    for (const amountInCents of [1000, 550]) {
      await createTransaction(app, token, { categoryId: foodId, amountInCents })
    }

    const response = await graphqlRequest(
      app,
      '{ categories { title transactionsCount totalInCents } }',
      { token },
    )

    expect(response.data?.categories).toEqual([
      { title: 'Alimentação', transactionsCount: 2, totalInCents: 1550 },
      { title: 'Saúde', transactionsCount: 0, totalInCents: 0 },
    ])
  })
})
