import {
  DeleteTransactionUseCase,
} from '@/domain/finance/application/use-cases/delete-transaction'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaTransactionsRepository,
} from '@/infra/database/prisma/repositories/prisma-transactions-repository'

export function makeDeleteTransactionUseCase() {
  return new DeleteTransactionUseCase(new PrismaTransactionsRepository(prisma))
}
