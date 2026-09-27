import type {
  FinancialSummary,
} from '@/domain/finance/enterprise/value-objects/financial-summary'
import type {
  FinancialSummaryType,
} from '@/infra/graphql/object-types/financial-summary-type'

export class FinancialSummaryPresenter {
  static toGraphQL(summary: FinancialSummary): FinancialSummaryType {
    return {
      balanceInCents: summary.balanceInCents,
      monthIncomeInCents: summary.monthIncomeInCents,
      monthExpenseInCents: summary.monthExpenseInCents,
    }
  }
}
