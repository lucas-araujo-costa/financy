import {
  DeleteCategoryUseCase,
} from '@/domain/finance/application/use-cases/delete-category'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaCategoriesRepository,
} from '@/infra/database/prisma/repositories/prisma-categories-repository'
import {
  PrismaTransactionsRepository,
} from '@/infra/database/prisma/repositories/prisma-transactions-repository'

export function makeDeleteCategoryUseCase() {
  return new DeleteCategoryUseCase(
    new PrismaCategoriesRepository(prisma),
    new PrismaTransactionsRepository(prisma),
  )
}
