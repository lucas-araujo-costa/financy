import {
  EditTransactionUseCase,
} from '@/domain/finance/application/use-cases/edit-transaction'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaCategoriesRepository,
} from '@/infra/database/prisma/repositories/prisma-categories-repository'
import {
  PrismaTransactionsRepository,
} from '@/infra/database/prisma/repositories/prisma-transactions-repository'

export function makeEditTransactionUseCase() {
  return new EditTransactionUseCase(
    new PrismaTransactionsRepository(prisma),
    new PrismaCategoriesRepository(prisma),
  )
}
