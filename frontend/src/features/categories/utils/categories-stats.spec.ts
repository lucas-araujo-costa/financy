import { describe, expect, it } from 'vitest'

import type { CategoryListItem } from '../types'
import {
  formatItemsCount,
  getCategoriesStats,
  getMostUsedCategories,
} from './categories-stats'

function makeCategory(
  override: Partial<CategoryListItem> = {},
): CategoryListItem {
  return {
    id: crypto.randomUUID(),
    title: 'Categoria',
    icon: 'utensils',
    color: 'blue',
    transactionsCount: 0,
    totalInCents: 0,
    ...override,
  }
}

describe('getCategoriesStats', () => {
  it('soma as transações e acha a mais utilizada', () => {
    const food = makeCategory({ title: 'Alimentação', transactionsCount: 12 })
    const transport = makeCategory({
      title: 'Transporte',
      transactionsCount: 8,
    })

    const stats = getCategoriesStats([transport, food, makeCategory()])

    expect(stats.totalCategories).toBe(3)
    expect(stats.totalTransactions).toBe(20)
    expect(stats.mostUsed?.title).toBe('Alimentação')
  })

  it('não tem categoria mais utilizada quando nenhuma tem transações', () => {
    expect(getCategoriesStats([makeCategory()]).mostUsed).toBeNull()
    expect(getCategoriesStats([]).mostUsed).toBeNull()
  })
})

describe('getMostUsedCategories', () => {
  it('ordena por uso, desempata pelo total e respeita o limite', () => {
    const categories = [
      makeCategory({ title: 'A', transactionsCount: 2, totalInCents: 100 }),
      makeCategory({ title: 'B', transactionsCount: 5 }),
      makeCategory({ title: 'C', transactionsCount: 2, totalInCents: 900 }),
    ]

    expect(
      getMostUsedCategories(categories, 2).map((item) => item.title),
    ).toEqual(['B', 'C'])
  })
})

describe('formatItemsCount', () => {
  it('usa singular e plural', () => {
    expect(formatItemsCount(1)).toBe('1 item')
    expect(formatItemsCount(0)).toBe('0 itens')
    expect(formatItemsCount(12)).toBe('12 itens')
  })
})
