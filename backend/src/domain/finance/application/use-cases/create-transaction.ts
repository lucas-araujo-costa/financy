import { type Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
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

interface CreateTransactionUseCaseRequest {
  userId: string
  categoryId: string
  description: string
  amountInCents: number
  type: TransactionType
  date: Date
}

type CreateTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | InvalidTransactionAmountError,
  { transaction: TransactionWithCategory }
>

export class CreateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute(
    request: CreateTransactionUseCaseRequest,
  ): Promise<CreateTransactionUseCaseResponse> {
    const {
      userId,
      categoryId,
      description,
      amountInCents,
      type,
      date,
    } = request

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

    const transaction = Transaction.create({
      userId: new UniqueEntityID(userId),
      categoryId: category.id,
      description: description.trim(),
      amountInCents,
      type,
      date,
    })

    await this.transactionsRepository.create(transaction)

    return right({
      transaction: TransactionWithCategory.fromTransaction(
        transaction,
        category,
      ),
    })
  }
}
