import {
  GetFinancialSummaryUseCase,
} from '@/domain/finance/application/use-cases/get-financial-summary'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaTransactionsRepository,
} from '@/infra/database/prisma/repositories/prisma-transactions-repository'

export function makeGetFinancialSummaryUseCase() {
  return new GetFinancialSummaryUseCase(
    new PrismaTransactionsRepository(prisma),
  )
}
