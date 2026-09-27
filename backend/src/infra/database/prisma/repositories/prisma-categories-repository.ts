import { normalizeText } from '@/core/utils/normalize-text'
import type {
  CategoriesRepository,
} from '@/domain/finance/application/repositories/categories-repository'
import type { Category } from '@/domain/finance/enterprise/entities/category'

import type { PrismaClient } from '../generated/client'
import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'
import {
  PrismaCategoryWithStatsMapper,
} from '../mappers/prisma-category-with-stats-mapper'

export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } })

    return category
      ? PrismaCategoryMapper.toDomain(category)
      : null
  }

  async findByTitle(userId: string, title: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        userId_normalizedTitle: {
          userId,
          normalizedTitle: normalizeText(title),
        },
      },
    })

    return category
      ? PrismaCategoryMapper.toDomain(category)
      : null
  }

  async findWithStatsById(id: string) {
    const [category, stats] = await Promise.all([
      this.prisma.category.findUnique({ where: { id } }),
      this.prisma.transaction.aggregate({
        where: { categoryId: id },
        _count: { _all: true },
        _sum: { amountInCents: true },
      }),
    ])

    if (!category) {
      return null
    }

    return PrismaCategoryWithStatsMapper.toDomain(category, {
      transactionsCount: stats._count._all,
      totalInCents: stats._sum.amountInCents ?? 0,
    })
  }

  async findManyWithStatsByUserId(userId: string) {
    const [categories, stats] = await Promise.all([
      this.prisma.category.findMany({
        where: { userId },
        orderBy: { normalizedTitle: 'asc' },
      }),
      this.prisma.transaction.groupBy({
        by: ['categoryId'],
        where: { userId },
        _count: { _all: true },
        _sum: { amountInCents: true },
      }),
    ])

    const statsByCategoryId = new Map(
      stats.map((item) => [item.categoryId, item]),
    )

    return categories.map((category) => {
      const categoryStats = statsByCategoryId.get(category.id)

      return PrismaCategoryWithStatsMapper.toDomain(category, {
        transactionsCount: categoryStats?._count._all ?? 0,
        totalInCents: categoryStats?._sum.amountInCents ?? 0,
      })
    })
  }

  async create(category: Category) {
    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    })
  }

  async save(category: Category) {
    const { id, ...data } = PrismaCategoryMapper.toPrisma(category)

    await this.prisma.category.update({ where: { id }, data })
  }

  async delete(category: Category) {
    await this.prisma.category.delete({ where: { id: category.id.toString() } })
  }
}
