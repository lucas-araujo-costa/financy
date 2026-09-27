import type { FastifyInstance } from 'fastify'

import { graphqlRequest } from './graphql-request'

export async function createCategory(
  app: FastifyInstance,
  token: string,
  input: Partial<{ title: string; icon: string; color: string }> = {},
) {
  const response = await graphqlRequest<{ createCategory: { id: string } }>(
    app,
    `mutation ($input: CategoryInput!) {
      createCategory(input: $input) { id }
    }`,
    {
      token,
      variables: {
        input: {
          title: 'Alimentação',
          icon: 'utensils',
          color: 'blue',
          ...input,
        },
      },
    },
  )

  if (!response.data) {
    throw new Error(JSON.stringify(response.errors))
  }

  return response.data.createCategory.id
}
