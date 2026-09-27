import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog'

import type { CategoryListItem } from '../types'
import { formatItemsCount } from '../utils/categories-stats'

/*
 * Categoria com transações não pode ser excluída (docs/decisions.md, ADR-12). A interface já
 * avisa e bloqueia; o backend também recusa com CONFLICT.
 */
export function DeleteCategoryDialog({
  category,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  category: CategoryListItem | null
  onOpenChange: (open: boolean) => void
  onConfirm: (category: CategoryListItem) => void
  isPending?: boolean
}) {
  const hasTransactions = (category?.transactionsCount ?? 0) > 0

  function getDescription() {
    if (!category) return ''
    if (hasTransactions) {
      return `"${category.title}" tem ${formatItemsCount(category.transactionsCount)}. Exclua ou mude a categoria dessas transações antes.`
    }
    return `"${category.title}" será excluída. Essa ação não pode ser desfeita.`
  }

  return (
    <ConfirmDeleteDialog
      open={category !== null}
      onOpenChange={onOpenChange}
      title="Excluir categoria"
      description={getDescription()}
      canConfirm={!hasTransactions}
      onConfirm={() => category && onConfirm(category)}
      isPending={isPending}
    />
  )
}
