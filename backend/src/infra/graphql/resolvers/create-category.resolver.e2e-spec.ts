import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '@/infra/app'
import {
  createAndAuthenticateUser,
} from 'test/e2e/create-and-authenticate-user'
import { errorCode, graphqlRequest } from 'test/e2e/graphql-request'

const CREATE_CATEGORY = `
  mutation ($input: CategoryInput!) {
    createCategory(input: $input) {
      id title description icon color transactionsCount totalInCents
    }
  }
`

describe('createCategory (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a category', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await graphqlRequest(app, CREATE_CATEGORY, {
      token,
      variables: {
        input: {
          title: 'Saúde',
          description: 'Medicamentos, consultas e exames',
          icon: 'heart-pulse',
          color: 'red',
        },
      },
    })

    expect(response.data?.createCategory).toEqual({
      id: expect.any(String),
      title: 'Saúde',
      description: 'Medicamentos, consultas e exames',
      icon: 'heart-pulse',
      color: 'red',
      transactionsCount: 0,
      totalInCents: 0,
    })
  })

  it('should reject a title that differs only in case or accents', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const input = { icon: 'heart-pulse', color: 'red' }

    await graphqlRequest(app, CREATE_CATEGORY, {
      token,
      variables: { input: { ...input, title: 'Saúde' } },
    })
    const response = await graphqlRequest(app, CREATE_CATEGORY, {
      token,
      variables: { input: { ...input, title: 'SAUDE' } },
    })

    expect(errorCode(response)).toBe('CONFLICT')
  })

  it('should reject an icon out of the Figma list', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await graphqlRequest(app, CREATE_CATEGORY, {
      token,
      variables: { input: { title: 'Foguete', icon: 'rocket', color: 'red' } },
    })

    expect(errorCode(response)).toBe('BAD_USER_INPUT')
  })

  it('should require authentication', async () => {
    const response = await graphqlRequest(app, CREATE_CATEGORY, {
      variables: {
        input: { title: 'Saúde', icon: 'heart-pulse', color: 'red' },
      },
    })

    expect(errorCode(response)).toBe('UNAUTHENTICATED')
  })
})
