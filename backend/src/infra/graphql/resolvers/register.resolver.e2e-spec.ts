import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import { errorCode, graphqlRequest } from 'test/e2e/graphql-request'

const REGISTER = `
  mutation ($input: RegisterInput!) {
    register(input: $input) { accessToken user { id name email } }
  }
`

describe('register (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register and return an access token', async () => {
    const response = await graphqlRequest(app, REGISTER, {
      variables: {
        input: {
          name: 'John Doe',
          email: 'JohnDoe@Example.com',
          password: '12345678',
        },
      },
    })

    expect(response.errors).toBeUndefined()
    expect(response.data?.register).toEqual({
      accessToken: expect.any(String),
      user: {
        id: expect.any(String),
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    })
  })

  it('should not register the same email twice', async () => {
    const input = {
      name: 'Jane',
      email: 'jane@example.com',
      password: '12345678',
    }

    await graphqlRequest(app, REGISTER, { variables: { input } })
    const response = await graphqlRequest(app, REGISTER, {
      variables: { input: { ...input, email: 'JANE@example.com' } },
    })

    expect(errorCode(response)).toBe('CONFLICT')
  })

  it('should validate the input', async () => {
    const response = await graphqlRequest(app, REGISTER, {
      variables: { input: { name: ' ', email: 'invalid', password: '123' } },
    })

    expect(errorCode(response)).toBe('BAD_USER_INPUT')
  })
})
