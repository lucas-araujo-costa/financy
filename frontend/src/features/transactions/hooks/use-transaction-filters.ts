import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import {
  type TransactionFilters,
  transactionFiltersSchema,
} from '../schemas/transaction-filters-schema'

type FiltersPatch = Partial<Record<keyof TransactionFilters, string | number>>

/*
 * Lê e escreve os filtros na URL. Mudar qualquer filtro volta para a página 1.
 * Valor vazio remove o parâmetro, para a URL ficar limpa.
 */
export function useTransactionFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(
    () => transactionFiltersSchema.parse(Object.fromEntries(searchParams)),
    [searchParams],
  )

  const setFilters = useCallback(
    (patch: FiltersPatch) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current)

        Object.entries(patch).forEach(([key, value]) => {
          if (value === undefined || value === '') next.delete(key)
          else next.set(key, String(value))
        })

        if (!('page' in patch)) next.delete('page')
        if (next.get('page') === '1') next.delete('page')
        return next
      })
    },
    [setSearchParams],
  )

  return { filters, setFilters }
}
