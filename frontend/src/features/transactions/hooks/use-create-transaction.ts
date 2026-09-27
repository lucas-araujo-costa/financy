import { useMutation } from '@apollo/client/react'

import { runMutation } from '@/services/graphql/run-mutation'

import {
  toTransactionInput,
  type TransactionFormValues,
} from '../schemas/transaction-form-schema'
import { CreateTransactionMutation } from '../services/create-transaction'
import { transactionRefetch } from './transaction-refetch'

export function useCreateTransaction() {
  const [createTransaction, { loading }] = useMutation(
    CreateTransactionMutation,
    transactionRefetch,
  )

  async function create(values: TransactionFormValues) {
    return runMutation(
      () =>
        createTransaction({ variables: { input: toTransactionInput(values) } }),
      { success: 'Transação criada.' },
    )
  }

  return { create, isSubmitting: loading }
}
