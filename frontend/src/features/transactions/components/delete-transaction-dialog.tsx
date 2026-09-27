import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog'

import type { TransactionListItem } from '../types'

export function DeleteTransactionDialog({
  transaction,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  transaction: TransactionListItem | null
  onOpenChange: (open: boolean) => void
  onConfirm: (transaction: TransactionListItem) => void
  isPending?: boolean
}) {
  return (
    <ConfirmDeleteDialog
      open={transaction !== null}
      onOpenChange={onOpenChange}
      title="Excluir transação"
      description={
        transaction
          ? `"${transaction.description}" será excluída. Essa ação não pode ser desfeita.`
          : ''
      }
      onConfirm={() => transaction && onConfirm(transaction)}
      isPending={isPending}
    />
  )
}
