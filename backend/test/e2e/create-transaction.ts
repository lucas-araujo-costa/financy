import type { FastifyInstance } from 'fastify'

import { graphqlRequest } from './graphql-request'

export async function createTransaction(
  app: FastifyInstance,
  token: string,
  input: {
    categoryId: string
    description?: string
    amountInCents?: number
    type?: 'INCOME' | 'EXPENSE'
    date?: string
  },
) {
  const response = await graphqlRequest<{ createTransaction: { id: string } }>(
    app,
    `mutation ($input: TransactionInput!) {
      createTransaction(input: $input) { id }
    }`,
    {
      token,
      variables: {
        input: {
          description: 'Jantar no Restaurante',
          amountInCents: 8950,
          type: 'EXPENSE',
          date: '2025-11-30',
          ...input,
        },
      },
    },
  )

  if (!response.data) {
    throw new Error(JSON.stringify(response.errors))
  }

  return response.data.createTransaction.id
}
