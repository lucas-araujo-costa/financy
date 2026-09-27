import { ChevronRightIcon, PlusIcon, ReceiptTextIcon } from 'lucide-react'
import { Link as RouterLink } from 'react-router'

import { CategoryIcon } from '@/components/shared/category-icon'
import { CategoryTag } from '@/components/shared/category-tag'
import { EmptyState } from '@/components/shared/empty-state'
import { Money } from '@/components/shared/money'
import { Card, CardLabel } from '@/components/ui/card'
import { Link } from '@/components/ui/link'
import { Skeleton } from '@/components/ui/skeleton'
import type { TransactionListItem } from '@/features/transactions'
import { formatShortDate } from '@/lib/format'

/** "Transações recentes": as 5 últimas, "Ver todas" e "+ Nova transação". */
export function RecentTransactionsCard({
  transactions,
  onCreate,
}: {
  transactions: TransactionListItem[] | undefined
  onCreate: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 py-5 pr-3 pl-6">
        <CardLabel>Transações recentes</CardLabel>
        <Link asChild>
          <RouterLink to="/transacoes" viewTransition>
            Ver todas
            <ChevronRightIcon aria-hidden />
          </RouterLink>
        </Link>
      </div>

      {transactions?.length === 0 ? (
        <EmptyState
          icon={ReceiptTextIcon}
          title="Nenhuma transação ainda"
          description="Registre sua primeira despesa ou receita."
          className="border-b border-gray-200"
        />
      ) : (
        <ul>
          {transactions
            ? transactions.map((transaction) => (
                <RecentTransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            : Array.from({ length: 5 }, (_, index) => (
                <RecentTransactionSkeleton key={index} />
              ))}
        </ul>
      )}

      <div className="flex justify-center px-6 py-5">
        <Link asChild>
          <button type="button" onClick={onCreate}>
            <PlusIcon aria-hidden />
            Nova transação
          </button>
        </Link>
      </div>
    </Card>
  )
}

function RecentTransactionItem({
  transaction,
}: {
  transaction: TransactionListItem
}) {
  const { description, date, category, type, amountInCents } = transaction

  return (
    <li className="flex h-20 animate-in items-center border-b border-gray-200 duration-slow ease-out fade-in-0">
      <div className="flex min-w-0 flex-1 items-center gap-4 px-6">
        <CategoryIcon icon={category.icon} color={category.color} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-base leading-6 font-medium text-gray-800">
            {description}
          </p>
          <p className="text-sm leading-5 text-gray-600">
            {formatShortDate(date)}
          </p>
        </div>
      </div>
      <div className="hidden min-w-40 shrink-0 justify-center px-6 sm:flex">
        <CategoryTag title={category.title} color={category.color} />
      </div>
      <div className="flex w-40 shrink-0 justify-end px-6">
        <Money amountInCents={amountInCents} type={type} withIcon />
      </div>
    </li>
  )
}

function RecentTransactionSkeleton() {
  return (
    <li aria-hidden className="flex h-20 items-center border-b border-gray-200">
      <div className="flex flex-1 items-center gap-4 px-6">
        <Skeleton className="size-10 rounded-lg" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="hidden w-40 justify-center px-6 sm:flex">
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <div className="flex w-40 justify-end px-6">
        <Skeleton className="h-5 w-24" />
      </div>
    </li>
  )
}
