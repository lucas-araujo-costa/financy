import { graphql } from '@/services/graphql/generated'

export const CreateTransactionMutation = graphql(`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`)
