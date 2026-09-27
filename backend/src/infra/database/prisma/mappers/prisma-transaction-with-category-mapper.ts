import {
  TransactionWithCategory,
} from '@/domain/finance/enterprise/value-objects/transaction-with-category'

import type {
  Category as PrismaCategory,
  Transaction as PrismaTransaction,
} from '../generated/client'
import { PrismaCategoryMapper } from './prisma-category-mapper'
import { PrismaTransactionMapper } from './prisma-transaction-mapper'

type PrismaTransactionWithCategory = PrismaTransaction & {
  category: PrismaCategory
}

export class PrismaTransactionWithCategoryMapper {
  static toDomain(raw: PrismaTransactionWithCategory) {
    return TransactionWithCategory.fromTransaction(
      PrismaTransactionMapper.toDomain(raw),
      PrismaCategoryMapper.toDomain(raw.category),
    )
  }
}
