import { graphql } from '@/services/graphql/generated'

export const EditTransactionMutation = graphql(`
  mutation EditTransaction($id: ID!, $input: TransactionInput!) {
    editTransaction(id: $id, input: $input) {
      id
    }
  }
`)
