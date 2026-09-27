import { useQuery } from '@apollo/client/react'

import { GetFinancialSummaryQuery } from '../services/get-financial-summary'

export function useFinancialSummary(period: { month: number; year: number }) {
  const { data, loading, error, refetch } = useQuery(GetFinancialSummaryQuery, {
    variables: period,
  })

  return {
    summary: data?.financialSummary,
    isLoading: loading && !data,
    error: data ? undefined : error,
    refetch,
  }
}
