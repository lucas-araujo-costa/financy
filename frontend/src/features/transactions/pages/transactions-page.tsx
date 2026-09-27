import { PlusIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/features/categories'
import { waitForExit } from '@/lib/motion'

import { DeleteTransactionDialog } from '../components/delete-transaction-dialog'
import { TransactionFormDialog } from '../components/transaction-form-dialog'
import { TransactionTableFilters } from '../components/transaction-table-filters'
import { TransactionsTable } from '../components/transactions-table'
import { useCreateTransaction } from '../hooks/use-create-transaction'
import { useDeleteTransaction } from '../hooks/use-delete-transaction'
import { useEditTransaction } from '../hooks/use-edit-transaction'
import { useTransactionFilters } from '../hooks/use-transaction-filters'
import { useTransactions } from '../hooks/use-transactions'
import {
  toTransactionsVariables,
  TRANSACTIONS_PER_PAGE,
} from '../schemas/transaction-filters-schema'
import type { TransactionFormValues } from '../schemas/transaction-form-schema'
import type { TransactionListItem } from '../types'

export function TransactionsPage() {
  const { filters, setFilters } = useTransactionFilters()
  const variables = useMemo(() => toTransactionsVariables(filters), [filters])
  const { page, isLoading, isStale, error, refetch } =
    useTransactions(variables)
  const { categories = [] } = useCategories()

  const { create, isSubmitting: isCreating } = useCreateTransaction()
  const { edit, isSubmitting: isEditing } = useEditTransaction()
  const { remove } = useDeleteTransaction()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<TransactionListItem | null>(null)
  const [deleting, setDeleting] = useState<TransactionListItem | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setIsFormOpen(true)
  }

  function openEdit(transaction: TransactionListItem) {
    setEditing(transaction)
    setIsFormOpen(true)
  }

  async function handleSave(values: TransactionFormValues) {
    const saved = editing
      ? await edit(editing.id, values)
      : await create(values)
    if (saved) setIsFormOpen(false)
  }

  async function handleDelete(transaction: TransactionListItem) {
    setDeleting(null)
    setRemovingId(transaction.id)
    await waitForExit()
    const removed = await remove(transaction.id)
    if (!removed) setRemovingId(null)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Transações"
        description="Gerencie todas as suas transações financeiras"
        action={
          <Button size="sm" onClick={openCreate}>
            <PlusIcon aria-hidden />
            Nova transação
          </Button>
        }
      />

      <TransactionTableFilters categories={categories} />

      <TransactionsTable
        transactions={page?.items ?? []}
        total={page?.total ?? 0}
        page={filters.page}
        perPage={TRANSACTIONS_PER_PAGE}
        onPageChange={(next) => setFilters({ page: next })}
        onEdit={openEdit}
        onDelete={setDeleting}
        isLoading={isLoading}
        isStale={isStale}
        removingId={removingId}
        error={error}
        onRetry={() => refetch()}
      />

      <TransactionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        transaction={editing}
        categories={categories}
        onSubmit={handleSave}
        isSubmitting={isCreating || isEditing}
      />

      <DeleteTransactionDialog
        transaction={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
