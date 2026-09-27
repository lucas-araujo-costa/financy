import { useQuery } from '@apollo/client/react'

import type { GetTransactionsQueryVariables } from '@/services/graphql/generated/graphql'

import { GetTransactionsQuery } from '../services/get-transactions'

/*
 * Na troca de filtro ou de página, os dados anteriores continuam na tela
 * (`previousData`) com opacidade reduzida até os novos chegarem (AGENTS.md › Movimento).
 */
export function useTransactions(variables: GetTransactionsQueryVariables) {
  const { data, previousData, loading, error, refetch } = useQuery(
    GetTransactionsQuery,
    { variables },
  )
  const page = (data ?? previousData)?.transactions

  return {
    page,
    isLoading: loading && !page,
    isStale: loading && Boolean(page),
    error: page ? undefined : error,
    refetch,
  }
}
