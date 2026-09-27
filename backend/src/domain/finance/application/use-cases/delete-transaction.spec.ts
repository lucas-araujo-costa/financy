import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'
import { makeTransaction } from 'test/factories/make-transaction'
import {
  InMemoryCategoriesRepository,
} from 'test/repositories/in-memory-categories-repository'
import {
  InMemoryTransactionsRepository,
} from 'test/repositories/in-memory-transactions-repository'

import { DeleteTransactionUseCase } from './delete-transaction'

let transactionsRepository: InMemoryTransactionsRepository
let sut: DeleteTransactionUseCase

describe('Delete transaction', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository(
      new InMemoryCategoriesRepository(),
    )
    sut = new DeleteTransactionUseCase(transactionsRepository)
  })

  it('should delete a transaction', async () => {
    const transaction = makeTransaction({
      userId: new UniqueEntityID('user-1'),
    })
    transactionsRepository.items.push(transaction)

    const result = await sut.execute({
      userId: 'user-1',
      transactionId: transaction.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(transactionsRepository.items).toHaveLength(0)
  })

  it('should not delete a transaction from another user', async () => {
    const transaction = makeTransaction({
      userId: new UniqueEntityID('user-2'),
    })
    transactionsRepository.items.push(transaction)

    const result = await sut.execute({
      userId: 'user-1',
      transactionId: transaction.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(transactionsRepository.items).toHaveLength(1)
  })

  it('should return not found for an unknown transaction', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      transactionId: 'unknown-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
