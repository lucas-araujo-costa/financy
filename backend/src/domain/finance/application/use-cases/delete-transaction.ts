import { type Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'

import type {
  TransactionsRepository,
} from '../repositories/transactions-repository'

interface DeleteTransactionUseCaseRequest {
  userId: string
  transactionId: string
}

type DeleteTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(
    request: DeleteTransactionUseCaseRequest,
  ): Promise<DeleteTransactionUseCaseResponse> {
    const { userId, transactionId } = request

    const transaction =
      await this.transactionsRepository.findById(transactionId)

    if (!transaction) {
      return left(new ResourceNotFoundError())
    }

    if (transaction.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    await this.transactionsRepository.delete(transaction)

    return right(null)
  }
}
