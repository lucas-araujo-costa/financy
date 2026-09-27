import { randomUUID } from 'node:crypto'

import type { FastifyInstance } from 'fastify'

import { graphqlRequest } from './graphql-request'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const email = `${randomUUID()}@example.com`

  const response = await graphqlRequest<{
    register: { accessToken: string; user: { id: string } }
  }>(
    app,
    `mutation ($input: RegisterInput!) {
      register(input: $input) { accessToken user { id } }
    }`,
    { variables: { input: { name: 'John Doe', email, password: '12345678' } } },
  )

  if (!response.data) {
    throw new Error(JSON.stringify(response.errors))
  }

  return {
    token: response.data.register.accessToken,
    userId: response.data.register.user.id,
    email,
  }
}
