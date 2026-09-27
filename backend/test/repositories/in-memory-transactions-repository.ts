import type { PaginationParams } from '@/core/repositories/pagination-params'
import { normalizeText } from '@/core/utils/normalize-text'
import type {
  FetchTransactionsFilters,
  TransactionsRepository,
} from '@/domain/finance/application/repositories/transactions-repository'
import type {
  Transaction,
} from '@/domain/finance/enterprise/entities/transaction'
import {
  getPeriodRange,
  type Period,
} from '@/domain/finance/enterprise/types/period'
import {
  FinancialSummary,
} from '@/domain/finance/enterprise/value-objects/financial-summary'
import {
  TransactionWithCategory,
} from '@/domain/finance/enterprise/value-objects/transaction-with-category'

import type {
  InMemoryCategoriesRepository,
} from './in-memory-categories-repository'

function isInPeriod(date: Date, period: Period) {
  const { start, end } = getPeriodRange(period)

  return date >= start && date < end
}

function sumAmounts(transactions: Transaction[]) {
  return transactions.reduce((sum, item) => sum + item.amountInCents, 0)
}

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  constructor(private categoriesRepository: InMemoryCategoriesRepository) {
    categoriesRepository.transactionsRepository = this
  }

  async findById(id: string) {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findManyWithCategoryByUserId(
    userId: string,
    { search, type, categoryId, period }: FetchTransactionsFilters,
    { page, perPage }: PaginationParams,
  ) {
    const filtered = this.items
      .filter((item) => item.userId.toString() === userId)
      .filter((item) =>
        search
          ? item.normalizedDescription.includes(normalizeText(search))
          : true,
      )
      .filter((item) => (type
        ? item.type === type
        : true))
      .filter((item) =>
        categoryId
          ? item.categoryId.toString() === categoryId
          : true,
      )
      .filter((item) => (period
        ? isInPeriod(item.date, period)
        : true))
      .sort(
        (a, b) =>
          b.date.getTime() - a.date.getTime() ||
          b.createdAt.getTime() - a.createdAt.getTime(),
      )

    const items = filtered
      .slice((page - 1) * perPage, page * perPage)
      .map((transaction) => {
        const category = this.categoriesRepository.items.find((item) =>
          item.id.equals(transaction.categoryId),
        )

        if (!category) {
          throw new Error(
            `Category "${transaction.categoryId}" does not exist.`,
          )
        }

        return TransactionWithCategory.fromTransaction(transaction, category)
      })

    return { items, total: filtered.length }
  }

  async countByCategoryId(categoryId: string) {
    return this.items.filter(
      (item) => item.categoryId.toString() === categoryId,
    ).length
  }

  async getSummary(userId: string, period: Period) {
    const userTransactions = this.items.filter(
      (item) => item.userId.toString() === userId,
    )
    const incomes = userTransactions.filter((item) => item.type === 'INCOME')
    const expenses = userTransactions.filter((item) => item.type === 'EXPENSE')

    return FinancialSummary.create({
      balanceInCents: sumAmounts(incomes) - sumAmounts(expenses),
      monthIncomeInCents: sumAmounts(
        incomes.filter((item) => isInPeriod(item.date, period)),
      ),
      monthExpenseInCents: sumAmounts(
        expenses.filter((item) => isInPeriod(item.date, period)),
      ),
    })
  }

  async create(transaction: Transaction) {
    this.items.push(transaction)
  }

  async save(transaction: Transaction) {
    const index = this.items.findIndex((item) => item.id.equals(transaction.id))

    this.items[index] = transaction
  }

  async delete(transaction: Transaction) {
    this.items = this.items.filter((item) => !item.id.equals(transaction.id))
  }
}
