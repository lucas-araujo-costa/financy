import {
  FetchUserTransactionsUseCase,
} from '@/domain/finance/application/use-cases/fetch-user-transactions'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaTransactionsRepository,
} from '@/infra/database/prisma/repositories/prisma-transactions-repository'

export function makeFetchUserTransactionsUseCase() {
  return new FetchUserTransactionsUseCase(
    new PrismaTransactionsRepository(prisma),
  )
}
