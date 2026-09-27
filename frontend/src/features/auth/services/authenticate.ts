import { graphql } from '@/services/graphql/generated'

export const AuthenticateMutation = graphql(`
  mutation Authenticate($input: AuthenticateInput!) {
    authenticate(input: $input) {
      accessToken
      user {
        id
        name
        email
      }
    }
  }
`)
