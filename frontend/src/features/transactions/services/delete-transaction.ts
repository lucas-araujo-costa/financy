import { graphql } from '@/services/graphql/generated'

export const DeleteTransactionMutation = graphql(`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`)
