import type { CategoryListItem } from '../types'

/*
 * Os cards "Total de categorias", "Total de transações" e "Categoria mais
 * utilizada", e o card de categorias do dashboard, saem da lista de
 * categorias, calculados no front (docs/api-contract.md).
 */

export function getCategoriesStats(categories: CategoryListItem[]) {
  const totalTransactions = categories.reduce(
    (sum, category) => sum + category.transactionsCount,
    0,
  )

  return {
    totalCategories: categories.length,
    totalTransactions,
    mostUsed: getMostUsedCategories(categories, 1)[0] ?? null,
  }
}

/** As mais usadas primeiro (empate: maior total). Sem transações não entra. */
export function getMostUsedCategories(
  categories: CategoryListItem[],
  limit: number,
) {
  return categories
    .filter((category) => category.transactionsCount > 0)
    .toSorted(
      (a, b) =>
        b.transactionsCount - a.transactionsCount ||
        b.totalInCents - a.totalInCents,
    )
    .slice(0, limit)
}

/** 1 → "1 item", 12 → "12 itens" */
export function formatItemsCount(count: number) {
  return `${count} ${count === 1 ? 'item' : 'itens'}`
}
