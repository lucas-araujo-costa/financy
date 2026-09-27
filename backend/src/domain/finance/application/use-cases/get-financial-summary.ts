import { type Either, right } from '@/core/either'

import type {
  FinancialSummary,
} from '../../enterprise/value-objects/financial-summary'
import type {
  TransactionsRepository,
} from '../repositories/transactions-repository'

interface GetFinancialSummaryUseCaseRequest {
  userId: string
  month: number
  year: number
}

type GetFinancialSummaryUseCaseResponse = Either<
  never,
  { summary: FinancialSummary }
>

export class GetFinancialSummaryUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(
    request: GetFinancialSummaryUseCaseRequest,
  ): Promise<GetFinancialSummaryUseCaseResponse> {
    const { userId, month, year } = request

    const summary = await this.transactionsRepository.getSummary(userId, {
      month,
      year,
    })

    return right({ summary })
  }
}
