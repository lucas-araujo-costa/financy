import { graphql } from '@/services/graphql/generated'

export const GetMeQuery = graphql(`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`)
