import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { errorCode, graphqlRequest } from 'test/e2e/graphql-request'

describe('me (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return the logged user', async () => {
    const { token, email } = await createAndAuthenticateUser(app)

    const response = await graphqlRequest(app, '{ me { name email } }', {
      token,
    })

    expect(response.data?.me).toEqual({ name: 'John Doe', email })
  })

  it.each([
    ['without a token', undefined],
    ['with an invalid token', 'invalid.token.value'],
  ])('should be unauthenticated %s', async (_, token) => {
    const response = await graphqlRequest(app, '{ me { id } }', { token })

    expect(errorCode(response)).toBe('UNAUTHENTICATED')
  })
})
