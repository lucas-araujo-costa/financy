import type { PaginatedResult } from '@/core/repositories/paginated-result'
import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { Transaction } from '../../enterprise/entities/transaction'
import type { Period } from '../../enterprise/types/period'
import type { TransactionType } from '../../enterprise/types/transaction-type'
import type {
  FinancialSummary,
} from '../../enterprise/value-objects/financial-summary'
import type {
  TransactionWithCategory,
} from '../../enterprise/value-objects/transaction-with-category'

export interface FetchTransactionsFilters {
  /** Trecho da descrição. Ignora maiúsculas e acentos. */
  search?: string
  type?: TransactionType
  categoryId?: string
  period?: Period
}

export abstract class TransactionsRepository {
  abstract findById(id: string): Promise<Transaction | null>
  /** Ordenadas por data, da mais recente para a mais antiga. */
  abstract findManyWithCategoryByUserId(
    userId: string,
    filters: FetchTransactionsFilters,
    params: PaginationParams,
  ): Promise<PaginatedResult<TransactionWithCategory>>

  abstract countByCategoryId(categoryId: string): Promise<number>
  abstract getSummary(userId: string, period: Period): Promise<FinancialSummary>
  abstract create(transaction: Transaction): Promise<void>
  abstract save(transaction: Transaction): Promise<void>
  abstract delete(transaction: Transaction): Promise<void>
}
