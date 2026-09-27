import { useMutation } from '@apollo/client/react'

import { runMutation } from '@/services/graphql/run-mutation'

import {
  toTransactionInput,
  type TransactionFormValues,
} from '../schemas/transaction-form-schema'
import { EditTransactionMutation } from '../services/edit-transaction'
import { transactionRefetch } from './transaction-refetch'

export function useEditTransaction() {
  const [editTransaction, { loading }] = useMutation(
    EditTransactionMutation,
    transactionRefetch,
  )

  async function edit(id: string, values: TransactionFormValues) {
    return runMutation(
      () =>
        editTransaction({
          variables: { id, input: toTransactionInput(values) },
        }),
      { success: 'Transação atualizada.' },
    )
  }

  return { edit, isSubmitting: loading }
}
