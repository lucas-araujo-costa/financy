import { z } from 'zod'

import { formatPeriod } from '@/lib/format'

/*
 * Filtros e paginação da tela de Transações, lidos da URL (docs/decisions.md, ADR-09):
 * ?search=&type=&categoryId=&period=2025-11&page=1
 * Valor inválido na URL cai no padrão em vez de quebrar a tela.
 */

export const ALL_PERIODS = 'all'
export const TRANSACTIONS_PER_PAGE = 10

const periodPattern = /^\d{4}-(0[1-9]|1[0-2])$/

export const transactionFiltersSchema = z.object({
  search: z.string().trim().catch(''),
  type: z.enum(['INCOME', 'EXPENSE']).optional().catch(undefined),
  categoryId: z.string().min(1).optional().catch(undefined),
  /** "YYYY-MM", "all" (todo o período) ou vazio (mês atual) */
  period: z
    .union([z.string().regex(periodPattern), z.literal(ALL_PERIODS)])
    .optional()
    .catch(undefined),
  page: z.coerce.number().int().min(1).catch(1),
})

export type TransactionFilters = z.infer<typeof transactionFiltersSchema>

export function toPeriodValue(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

/** "2025-11" → { month: 11, year: 2025 }; "all" → null */
export function parsePeriod(value: string) {
  if (value === ALL_PERIODS) return null
  const [year, month] = value.split('-').map(Number)
  return { month, year }
}

/** Os últimos 12 meses (do atual para trás) e "Todo o período". */
export function getPeriodOptions(now = new Date()) {
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
    return {
      value: toPeriodValue(date),
      label: formatPeriod(date.getMonth() + 1, date.getFullYear()),
    }
  })

  return [...months, { value: ALL_PERIODS, label: 'Todo o período' }]
}

/** Variáveis da query `transactions` (docs/api-contract.md) a partir dos filtros da URL */
export function toTransactionsVariables(
  filters: TransactionFilters,
  now = new Date(),
) {
  const period = parsePeriod(filters.period ?? toPeriodValue(now))

  return {
    filter: {
      search: filters.search || undefined,
      type: filters.type,
      categoryId: filters.categoryId,
      month: period?.month,
      year: period?.year,
    },
    page: filters.page,
    perPage: TRANSACTIONS_PER_PAGE,
  }
}
