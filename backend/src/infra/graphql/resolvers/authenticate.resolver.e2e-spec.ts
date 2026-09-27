import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { errorCode, graphqlRequest } from 'test/e2e/graphql-request'

const AUTHENTICATE = `
  mutation ($input: AuthenticateInput!) {
    authenticate(input: $input) { accessToken user { email } }
  }
`

describe('authenticate (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should authenticate with the right credentials', async () => {
    const { email } = await createAndAuthenticateUser(app)

    const response = await graphqlRequest(app, AUTHENTICATE, {
      variables: { input: { email, password: '12345678' } },
    })

    expect(response.data?.authenticate).toEqual({
      accessToken: expect.any(String),
      user: { email },
    })
  })

  it('should reject a wrong password', async () => {
    const { email } = await createAndAuthenticateUser(app)

    const response = await graphqlRequest(app, AUTHENTICATE, {
      variables: { input: { email, password: 'wrong-password' } },
    })

    expect(errorCode(response)).toBe('UNAUTHENTICATED')
  })
})
