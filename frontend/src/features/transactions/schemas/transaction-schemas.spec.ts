import { describe, expect, it } from 'vitest'

import {
  getPeriodOptions,
  toTransactionsVariables,
  transactionFiltersSchema,
} from './transaction-filters-schema'
import {
  toTransactionInput,
  transactionFormSchema,
} from './transaction-form-schema'

describe('transactionFiltersSchema', () => {
  it('cai no padrão quando a URL tem valores inválidos', () => {
    expect(
      transactionFiltersSchema.parse({
        type: 'OUTRO',
        period: '2025-13',
        page: 'abc',
      }),
    ).toEqual({
      search: '',
      type: undefined,
      categoryId: undefined,
      period: undefined,
      page: 1,
    })
  })
})

describe('toTransactionsVariables', () => {
  const now = new Date(2025, 10, 15)

  it('usa o mês atual quando não há período', () => {
    const variables = toTransactionsVariables(
      transactionFiltersSchema.parse({}),
      now,
    )
    expect(variables.filter).toMatchObject({ month: 11, year: 2025 })
    expect(variables).toMatchObject({ page: 1, perPage: 10 })
  })

  it('"Todo o período" não manda mês nem ano', () => {
    const variables = toTransactionsVariables(
      transactionFiltersSchema.parse({ period: 'all', search: ' jantar ' }),
      now,
    )
    expect(variables.filter).toMatchObject({
      search: 'jantar',
      month: undefined,
      year: undefined,
    })
  })
})

describe('getPeriodOptions', () => {
  it('lista 12 meses do atual para trás e "Todo o período"', () => {
    const options = getPeriodOptions(new Date(2026, 0, 10))
    expect(options).toHaveLength(13)
    expect(options[0]).toEqual({ value: '2026-01', label: 'Janeiro / 2026' })
    expect(options[1]).toEqual({ value: '2025-12', label: 'Dezembro / 2025' })
    expect(options.at(-1)?.value).toBe('all')
  })
})

describe('transactionFormSchema', () => {
  const valid = {
    type: 'EXPENSE',
    description: 'Jantar',
    date: new Date(2025, 10, 30),
    amountInCents: 8950,
    categoryId: 'cat-1',
  }

  it('aceita uma transação válida e converte para o input do contrato', () => {
    const values = transactionFormSchema.parse(valid)
    expect(toTransactionInput(values)).toEqual({
      description: 'Jantar',
      amountInCents: 8950,
      type: 'EXPENSE',
      date: '2025-11-30',
      categoryId: 'cat-1',
    })
  })

  it('exige valor maior que zero, data e categoria', () => {
    const result = transactionFormSchema.safeParse({
      ...valid,
      amountInCents: 0,
      date: undefined,
      categoryId: undefined,
    })
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Selecione a data',
      'Informe um valor maior que zero',
      'Selecione a categoria',
    ])
  })
})
