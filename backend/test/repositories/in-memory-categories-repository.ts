import { normalizeText } from '@/core/utils/normalize-text'
import type {
  CategoriesRepository,
} from '@/domain/finance/application/repositories/categories-repository'
import type { Category } from '@/domain/finance/enterprise/entities/category'
import {
  CategoryWithStats,
} from '@/domain/finance/enterprise/value-objects/category-with-stats'

import type {
  InMemoryTransactionsRepository,
} from './in-memory-transactions-repository'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  /**
   * Categorias e transações se referenciam, como as tabelas no banco. Quem
   * liga os dois é o construtor do InMemoryTransactionsRepository.
   */
  public transactionsRepository?: InMemoryTransactionsRepository

  async findById(id: string) {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findByTitle(userId: string, title: string) {
    const normalizedTitle = normalizeText(title)

    return (
      this.items.find(
        (item) =>
          item.userId.toString() === userId &&
          item.normalizedTitle === normalizedTitle,
      ) ?? null
    )
  }

  async findWithStatsById(id: string) {
    const category = await this.findById(id)

    if (!category) {
      return null
    }

    return this.withStats(category)
  }

  async findManyWithStatsByUserId(userId: string) {
    return this.items
      .filter((category) => category.userId.toString() === userId)
      .sort((a, b) => a.normalizedTitle.localeCompare(b.normalizedTitle))
      .map((category) => this.withStats(category))
  }

  async create(category: Category) {
    this.items.push(category)
  }

  async save(category: Category) {
    const index = this.items.findIndex((item) => item.id.equals(category.id))

    this.items[index] = category
  }

  async delete(category: Category) {
    this.items = this.items.filter((item) => !item.id.equals(category.id))
  }

  private withStats(category: Category) {
    const transactions = (this.transactionsRepository?.items ?? []).filter(
      (transaction) => transaction.categoryId.equals(category.id),
    )

    return CategoryWithStats.fromCategory(category, {
      transactionsCount: transactions.length,
      totalInCents: transactions.reduce(
        (sum, transaction) => sum + transaction.amountInCents,
        0,
      ),
    })
  }
}
