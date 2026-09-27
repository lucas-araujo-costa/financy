import { CircleArrowDownIcon, CircleArrowUpIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export type TransactionType = 'INCOME' | 'EXPENSE'

/** Componente "Type" do Style Guide: Entrada (verde) / Saída (vermelho). */
export function TransactionTypeBadge({
  type,
  className,
}: {
  type: TransactionType
  className?: string
}) {
  const isIncome = type === 'INCOME'
  const Icon = isIncome ? CircleArrowUpIcon : CircleArrowDownIcon

  return (
    <span
      data-slot="transaction-type-badge"
      className={cn(
        'inline-flex items-center gap-2 align-middle text-sm leading-5 font-medium',
        isIncome ? 'text-green-dark' : 'text-red-dark',
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn('size-4', isIncome ? 'text-green-base' : 'text-red-base')}
      />
      {isIncome ? 'Entrada' : 'Saída'}
    </span>
  )
}
