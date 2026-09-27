import { graphql } from '@/services/graphql/generated'

export const GetTransactionsQuery = graphql(`
  query GetTransactions(
    $filter: TransactionsFilter
    $page: Int!
    $perPage: Int!
  ) {
    transactions(filter: $filter, page: $page, perPage: $perPage) {
      items {
        id
        description
        amountInCents
        type
        date
        category {
          id
          title
          icon
          color
        }
      }
      total
      page
      perPage
    }
  }
`)
