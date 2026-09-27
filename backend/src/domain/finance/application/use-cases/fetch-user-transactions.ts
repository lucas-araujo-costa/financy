import { type Either, right } from '@/core/either'

import type {
  TransactionWithCategory,
} from '../../enterprise/value-objects/transaction-with-category'
import type {
  FetchTransactionsFilters,
  TransactionsRepository,
} from '../repositories/transactions-repository'

interface FetchUserTransactionsUseCaseRequest {
  userId: string
  filters?: FetchTransactionsFilters
  page: number
  perPage: number
}

type FetchUserTransactionsUseCaseResponse = Either<
  never,
  { transactions: TransactionWithCategory[]; total: number }
>

export class FetchUserTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(
    request: FetchUserTransactionsUseCaseRequest,
  ): Promise<FetchUserTransactionsUseCaseResponse> {
    const { userId, filters = {}, page, perPage } = request

    const search = filters.search?.trim()

    const { items, total } =
      await this.transactionsRepository.findManyWithCategoryByUserId(
        userId,
        { ...filters, search: search || undefined },
        { page, perPage },
      )

    return right({ transactions: items, total })
  }
}
