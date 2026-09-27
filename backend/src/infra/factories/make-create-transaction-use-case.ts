import {
  CreateTransactionUseCase,
} from '@/domain/finance/application/use-cases/create-transaction'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaCategoriesRepository,
} from '@/infra/database/prisma/repositories/prisma-categories-repository'
import {
  PrismaTransactionsRepository,
} from '@/infra/database/prisma/repositories/prisma-transactions-repository'

export function makeCreateTransactionUseCase() {
  return new CreateTransactionUseCase(
    new PrismaTransactionsRepository(prisma),
    new PrismaCategoriesRepository(prisma),
  )
}
