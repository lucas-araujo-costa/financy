import {
  CircleArrowDownIcon,
  CircleArrowUpIcon,
  WalletIcon,
} from 'lucide-react'

import { SummaryCard } from './summary-card'

export interface FinancialSummaryData {
  balanceInCents: number
  monthIncomeInCents: number
  monthExpenseInCents: number
}

/** Saldo total (todo o período) + receitas e despesas do mês (docs/api-contract.md). */
export function SummaryCards({
  summary,
}: {
  summary: FinancialSummaryData | undefined
}) {
  const isLoading = !summary

  return (
    <>
      <SummaryCard
        icon={WalletIcon}
        iconClassName="text-purple-base"
        label="Saldo total"
        amountInCents={summary?.balanceInCents}
        isLoading={isLoading}
      />
      <SummaryCard
        icon={CircleArrowUpIcon}
        iconClassName="text-brand-base"
        label="Receitas do mês"
        amountInCents={summary?.monthIncomeInCents}
        isLoading={isLoading}
      />
      <SummaryCard
        icon={CircleArrowDownIcon}
        iconClassName="text-red-base"
        label="Despesas do mês"
        amountInCents={summary?.monthExpenseInCents}
        isLoading={isLoading}
      />
    </>
  )
}
