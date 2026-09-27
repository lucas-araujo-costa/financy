import { useState } from 'react'

import { QueryErrorState } from '@/components/shared/query-error-state'
import { Card } from '@/components/ui/card'
import { useCategories } from '@/features/categories'
import {
  TransactionFormDialog,
  type TransactionFormValues,
  useCreateTransaction,
  useTransactions,
} from '@/features/transactions'

import { CategoriesOverviewCard } from '../components/categories-overview-card'
import { RecentTransactionsCard } from '../components/recent-transactions-card'
import { SummaryCards } from '../components/summary-cards'
import { useFinancialSummary } from '../hooks/use-financial-summary'

// "Recentes": as 5 últimas de todo o período (docs/api-contract.md)
const RECENT_VARIABLES = { page: 1, perPage: 5 }

export function DashboardPage() {
  const [currentPeriod] = useState(() => {
    const now = new Date()
    return { month: now.getMonth() + 1, year: now.getFullYear() }
  })

  const summary = useFinancialSummary(currentPeriod)
  const recent = useTransactions(RECENT_VARIABLES)
  const { categories, error: categoriesError, refetch } = useCategories()
  const { create, isSubmitting } = useCreateTransaction()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const error = summary.error ?? recent.error ?? categoriesError

  async function handleCreate(values: TransactionFormValues) {
    if (await create(values)) setIsFormOpen(false)
  }

  if (error) {
    return (
      <Card>
        <QueryErrorState
          error={error}
          onRetry={() => {
            summary.refetch()
            recent.refetch()
            refetch()
          }}
        />
      </Card>
    )
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-3">
      <SummaryCards summary={summary.summary} />

      <div className="lg:col-span-2">
        <RecentTransactionsCard
          transactions={recent.page?.items}
          onCreate={() => setIsFormOpen(true)}
        />
      </div>

      <CategoriesOverviewCard categories={categories} />

      <TransactionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categories={categories ?? []}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
