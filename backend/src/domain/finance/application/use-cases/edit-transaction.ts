import { type Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'

import { Transaction } from '../../enterprise/entities/transaction'
import type { TransactionType } from '../../enterprise/types/transaction-type'
import {
  TransactionWithCategory,
} from '../../enterprise/value-objects/transaction-with-category'
import type {
  CategoriesRepository,
} from '../repositories/categories-repository'
import type {
  TransactionsRepository,
} from '../repositories/transactions-repository'
import {
  InvalidTransactionAmountError,
} from './errors/invalid-transaction-amount-error'

interface EditTransactionUseCaseRequest {
  userId: string
  transactionId: string
  categoryId: string
  description: string
  amountInCents: number
  type: TransactionType
  date: Date
}

type EditTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | InvalidTransactionAmountError,
  { transaction: TransactionWithCategory }
>

export class EditTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute(
    request: EditTransactionUseCaseRequest,
  ): Promise<EditTransactionUseCaseResponse> {
    const {
      userId,
      transactionId,
      categoryId,
      description,
      amountInCents,
      type,
      date,
    } = request

    const transaction =
      await this.transactionsRepository.findById(transactionId)

    if (!transaction) {
      return left(new ResourceNotFoundError())
    }

    if (transaction.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    if (!Transaction.isValidAmount(amountInCents)) {
      return left(new InvalidTransactionAmountError())
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    if (category.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    transaction.categoryId = category.id
    transaction.description = description.trim()
    transaction.amountInCents = amountInCents
    transaction.type = type
    transaction.date = date

    await this.transactionsRepository.save(transaction)

    return right({
      transaction: TransactionWithCategory.fromTransaction(
        transaction,
        category,
      ),
    })
  }
}
