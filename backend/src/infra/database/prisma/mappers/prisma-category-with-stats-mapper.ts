import {
  CategoryWithStats,
} from '@/domain/finance/enterprise/value-objects/category-with-stats'

import type { Category as PrismaCategory } from '../generated/client'
import { PrismaCategoryMapper } from './prisma-category-mapper'

export interface PrismaCategoryStats {
  transactionsCount: number
  totalInCents: number
}

export class PrismaCategoryWithStatsMapper {
  static toDomain(raw: PrismaCategory, stats: PrismaCategoryStats) {
    return CategoryWithStats.fromCategory(
      PrismaCategoryMapper.toDomain(raw),
      stats,
    )
  }
}
