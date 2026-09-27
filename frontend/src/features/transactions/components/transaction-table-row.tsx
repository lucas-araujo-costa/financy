import { SquarePenIcon, TrashIcon } from 'lucide-react'

import { CategoryIcon } from '@/components/shared/category-icon'
import { CategoryTag } from '@/components/shared/category-tag'
import { Money } from '@/components/shared/money'
import { TransactionTypeBadge } from '@/components/shared/transaction-type-badge'
import { IconButton } from '@/components/ui/icon-button'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatShortDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { TransactionListItem } from '../types'

interface TransactionTableRowProps {
  transaction: TransactionListItem
  onEdit: (transaction: TransactionListItem) => void
  onDelete: (transaction: TransactionListItem) => void
  /** Sai com fade antes de o refetch reorganizar a lista (AGENTS.md › Movimento) */
  isRemoving?: boolean
}

export function TransactionTableRow({
  transaction,
  onEdit,
  onDelete,
  isRemoving = false,
}: TransactionTableRowProps) {
  const { description, date, category, type, amountInCents } = transaction

  return (
    <TableRow
      className={cn(
        // Linha nova ou editada entra com fade
        'animate-in duration-slow ease-out fade-in-0',
        isRemoving && 'pointer-events-none opacity-0 duration-base ease-in',
      )}
    >
      <TableCell>
        <div className="flex min-w-0 items-center gap-4">
          <CategoryIcon icon={category.icon} color={category.color} />
          <span className="truncate text-base leading-6 font-medium text-gray-800">
            {description}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center text-sm leading-5 whitespace-nowrap text-gray-600">
        {formatShortDate(date)}
      </TableCell>
      <TableCell className="text-center">
        <CategoryTag title={category.title} color={category.color} />
      </TableCell>
      <TableCell className="text-center">
        <TransactionTypeBadge type={type} />
      </TableCell>
      <TableCell className="text-right">
        <Money amountInCents={amountInCents} type={type} />
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <IconButton
            variant="danger"
            aria-label={`Excluir "${description}"`}
            onClick={() => onDelete(transaction)}
          >
            <TrashIcon />
          </IconButton>
          <IconButton
            aria-label={`Editar "${description}"`}
            onClick={() => onEdit(transaction)}
          >
            <SquarePenIcon />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  )
}
