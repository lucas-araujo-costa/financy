import type { FastifyInstance } from 'fastify'

interface GraphQLResponse<Data> {
  data?: Data
  errors?: { message: string; extensions?: { code?: string } }[]
}

export async function graphqlRequest<Data = Record<string, unknown>>(
  app: FastifyInstance,
  query: string,
  { variables, token }: { variables?: object; token?: string } = {},
) {
  const response = await app.inject({
    method: 'POST',
    url: '/graphql',
    headers: token
      ? { authorization: `Bearer ${token}` }
      : {},
    payload: { query, variables },
  })

  return response.json<GraphQLResponse<Data>>()
}

export function errorCode(response: GraphQLResponse<unknown>) {
  return response.errors?.[0]?.extensions?.code
}
