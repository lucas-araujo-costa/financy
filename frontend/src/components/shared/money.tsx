import { CircleArrowDownIcon, CircleArrowUpIcon } from 'lucide-react'

import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { TransactionType } from './transaction-type-badge'

/**
 * Valor da transação com sinal: "+ R$ 4.250,00" / "- R$ 89,50".
 * `withIcon` adiciona a seta ↑/↓ colorida (lista de recentes do dashboard).
 */
export function Money({
  amountInCents,
  type,
  withIcon = false,
  className,
}: {
  amountInCents: number
  type: TransactionType
  withIcon?: boolean
  className?: string
}) {
  const isIncome = type === 'INCOME'
  const Icon = isIncome ? CircleArrowUpIcon : CircleArrowDownIcon

  return (
    <span
      data-slot="money"
      className={cn(
        'inline-flex items-center gap-2 align-middle text-sm leading-5 font-semibold whitespace-nowrap text-gray-800',
        className,
      )}
    >
      <span>
        {isIncome ? '+' : '-'} {formatCurrency(amountInCents)}
      </span>
      {withIcon && (
        <Icon
          aria-hidden
          className={cn(
            'size-4',
            isIncome ? 'text-green-base' : 'text-red-base',
          )}
        />
      )}
    </span>
  )
}
