import { ValueObject } from '@/core/entities/value-object'

export interface FinancialSummaryProps {
  /** Entradas menos saídas de todo o período. Pode ser negativo. */
  balanceInCents: number
  monthIncomeInCents: number
  monthExpenseInCents: number
}

export class FinancialSummary extends ValueObject<FinancialSummaryProps> {
  get balanceInCents() {
    return this.props.balanceInCents
  }

  get monthIncomeInCents() {
    return this.props.monthIncomeInCents
  }

  get monthExpenseInCents() {
    return this.props.monthExpenseInCents
  }

  static create(props: FinancialSummaryProps) {
    return new FinancialSummary(props)
  }
}
