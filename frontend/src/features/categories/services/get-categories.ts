import { graphql } from '@/services/graphql/generated'

export const GetCategoriesQuery = graphql(`
  query GetCategories {
    categories {
      id
      title
      description
      icon
      color
      transactionsCount
      totalInCents
    }
  }
`)
