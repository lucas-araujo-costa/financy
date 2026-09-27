import { graphql } from '@/services/graphql/generated'

export const RegisterMutation = graphql(`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        name
        email
      }
    }
  }
`)
