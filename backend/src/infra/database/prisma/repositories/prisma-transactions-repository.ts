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

import type { PrismaClient } from '../generated/client'
import type { TransactionWhereInput } from '../generated/models'
import { PrismaTransactionMapper } from '../mappers/prisma-transaction-mapper'
import {
  PrismaTransactionWithCategoryMapper,
} from '../mappers/prisma-transaction-with-category-mapper'

export class PrismaTransactionsRepository implements TransactionsRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    })

    return transaction
      ? PrismaTransactionMapper.toDomain(transaction)
      : null
  }

  async findManyWithCategoryByUserId(
    userId: string,
    { search, type, categoryId, period }: FetchTransactionsFilters,
    { page, perPage }: PaginationParams,
  ) {
    const periodRange = period && getPeriodRange(period)

    const where: TransactionWhereInput = {
      userId,
      type,
      categoryId,
      // A coluna já está normalizada, então a busca ignora maiúsculas e
      // acentos (o LIKE do SQLite só faria isso para ASCII).
      normalizedDescription: search
        ? { contains: normalizeText(search) }
        : undefined,
      date: periodRange
        ? { gte: periodRange.start, lt: periodRange.end }
        : undefined,
    }

    const [transactions, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.transaction.count({ where }),
    ])

    return {
      items: transactions.map(PrismaTransactionWithCategoryMapper.toDomain),
      total,
    }
  }

  async countByCategoryId(categoryId: string) {
    return this.prisma.transaction.count({ where: { categoryId } })
  }

  async getSummary(userId: string, period: Period) {
    const { start, end } = getPeriodRange(period)

    const [allTime, month] = await Promise.all([
      this.prisma.transaction.groupBy({
        by: ['type'],
        where: { userId },
        _sum: { amountInCents: true },
      }),
      this.prisma.transaction.groupBy({
        by: ['type'],
        where: { userId, date: { gte: start, lt: end } },
        _sum: { amountInCents: true },
      }),
    ])

    const sumOf = (groups: typeof allTime, type: 'INCOME' | 'EXPENSE') =>
      groups.find((group) => group.type === type)?._sum.amountInCents ?? 0

    return FinancialSummary.create({
      balanceInCents: sumOf(allTime, 'INCOME') - sumOf(allTime, 'EXPENSE'),
      monthIncomeInCents: sumOf(month, 'INCOME'),
      monthExpenseInCents: sumOf(month, 'EXPENSE'),
    })
  }

  async create(transaction: Transaction) {
    await this.prisma.transaction.create({
      data: PrismaTransactionMapper.toPrisma(transaction),
    })
  }

  async save(transaction: Transaction) {
    const { id, ...data } = PrismaTransactionMapper.toPrisma(transaction)

    await this.prisma.transaction.update({ where: { id }, data })
  }

  async delete(transaction: Transaction) {
    await this.prisma.transaction.delete({
      where: { id: transaction.id.toString() },
    })
  }
}
