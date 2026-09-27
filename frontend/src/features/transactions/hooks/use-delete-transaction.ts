import { useMutation } from '@apollo/client/react'

import { runMutation } from '@/services/graphql/run-mutation'

import { DeleteTransactionMutation } from '../services/delete-transaction'
import { transactionRefetch } from './transaction-refetch'

export function useDeleteTransaction() {
  const [deleteTransaction, { loading }] = useMutation(
    DeleteTransactionMutation,
    transactionRefetch,
  )

  async function remove(id: string) {
    return runMutation(() => deleteTransaction({ variables: { id } }), {
      success: 'Transação excluída.',
    })
  }

  return { remove, isPending: loading }
}
