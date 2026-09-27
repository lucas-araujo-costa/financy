import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { graphqlRequest } from 'test/e2e/graphql-request'

describe('editProfile (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should edit the name and keep the email', async () => {
    const { token, email } = await createAndAuthenticateUser(app)

    const response = await graphqlRequest(
      app,
      'mutation { editProfile(input: { name: "Jane Doe" }) { name email } }',
      { token },
    )

    expect(response.data?.editProfile).toEqual({ name: 'Jane Doe', email })
  })
})
