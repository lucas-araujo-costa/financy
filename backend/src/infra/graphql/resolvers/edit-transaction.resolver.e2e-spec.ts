import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { createCategory } from 'test/e2e/create-category'
import { createTransaction } from 'test/e2e/create-transaction'
import { errorCode, graphqlRequest } from 'test/e2e/graphql-request'

const EDIT_TRANSACTION = `
  mutation ($id: ID!, $input: TransactionInput!) {
    editTransaction(id: $id, input: $input) {
      description amountInCents type date category { title }
    }
  }
`

describe('editTransaction (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should edit a transaction, including its category', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const foodId = await createCategory(app, token, { title: 'Alimentação' })
    const salaryId = await createCategory(app, token, { title: 'Salário' })
    const transactionId = await createTransaction(app, token, {
      categoryId: foodId,
    })

    const response = await graphqlRequest(app, EDIT_TRANSACTION, {
      token,
      variables: {
        id: transactionId,
        input: {
          description: 'Pagamento de Salário',
          amountInCents: 425000,
          type: 'INCOME',
          date: '2025-12-01',
          categoryId: salaryId,
        },
      },
    })

    expect(response.data?.editTransaction).toEqual({
      description: 'Pagamento de Salário',
      amountInCents: 425000,
      type: 'INCOME',
      date: '2025-12-01',
      category: { title: 'Salário' },
    })
  })

  it('should not edit a transaction from another user', async () => {
    const owner = await createAndAuthenticateUser(app)
    const intruder = await createAndAuthenticateUser(app)
    const ownerCategoryId = await createCategory(app, owner.token)
    const intruderCategoryId = await createCategory(app, intruder.token)
    const transactionId = await createTransaction(app, owner.token, {
      categoryId: ownerCategoryId,
    })

    const response = await graphqlRequest(app, EDIT_TRANSACTION, {
      token: intruder.token,
      variables: {
        id: transactionId,
        input: {
          description: 'Hack',
          amountInCents: 1,
          type: 'INCOME',
          date: '2025-12-01',
          categoryId: intruderCategoryId,
        },
      },
    })

    expect(errorCode(response)).toBe('FORBIDDEN')
  })
})
