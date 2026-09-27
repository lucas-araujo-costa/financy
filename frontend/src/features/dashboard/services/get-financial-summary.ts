import { graphql } from '@/services/graphql/generated'

export const GetFinancialSummaryQuery = graphql(`
  query GetFinancialSummary($month: Int!, $year: Int!) {
    financialSummary(month: $month, year: $year) {
      balanceInCents
      monthIncomeInCents
      monthExpenseInCents
    }
  }
`)
