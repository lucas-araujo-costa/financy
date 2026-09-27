import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'
import { makeCategory } from 'test/factories/make-category'
import { makeTransaction } from 'test/factories/make-transaction'
import {
  InMemoryCategoriesRepository,
} from 'test/repositories/in-memory-categories-repository'
import {
  InMemoryTransactionsRepository,
} from 'test/repositories/in-memory-transactions-repository'

import type { Category } from '../../enterprise/entities/category'
import type { Transaction } from '../../enterprise/entities/transaction'
import { EditTransactionUseCase } from './edit-transaction'
import {
  InvalidTransactionAmountError,
} from './errors/invalid-transaction-amount-error'

let categoriesRepository: InMemoryCategoriesRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: EditTransactionUseCase
let category: Category
let transaction: Transaction

const userId = new UniqueEntityID('user-1')

describe('Edit transaction', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    transactionsRepository = new InMemoryTransactionsRepository(
      categoriesRepository,
    )
    sut = new EditTransactionUseCase(
      transactionsRepository,
      categoriesRepository,
    )

    category = makeCategory({ userId })
    transaction = makeTransaction({
      userId,
      categoryId: category.id,
      createdAt: new Date(2025, 0, 1),
    })
    categoriesRepository.items.push(category)
    transactionsRepository.items.push(transaction)
  })

  it('should edit a transaction, including its category', async () => {
    const newCategory = makeCategory({ userId })
    categoriesRepository.items.push(newCategory)
    const date = new Date(Date.UTC(2025, 10, 28))

    const result = await sut.execute({
      userId: 'user-1',
      transactionId: transaction.id.toString(),
      categoryId: newCategory.id.toString(),
      description: 'Salário',
      amountInCents: 1_000_000,
      type: 'INCOME',
      date,
    })

    expect(result.isRight()).toBe(true)
    expect(transactionsRepository.items[0]).toMatchObject({
      description: 'Salário',
      amountInCents: 1_000_000,
      type: 'INCOME',
      date,
    })
    const [editedTransaction] = transactionsRepository.items

    expect(editedTransaction.categoryId.equals(newCategory.id)).toBe(true)
    expect(result.value).toMatchObject({
      transaction: {
        category: { id: newCategory.id, title: newCategory.title },
      },
    })
    expect(transactionsRepository.items[0].updatedAt.getTime()).toBeGreaterThan(
      transaction.createdAt.getTime(),
    )
  })

  it('should not edit a transaction from another user', async () => {
    const otherTransaction = makeTransaction({
      userId: new UniqueEntityID('user-2'),
      description: 'Original',
    })
    transactionsRepository.items.push(otherTransaction)

    const result = await sut.execute({
      userId: 'user-1',
      transactionId: otherTransaction.id.toString(),
      categoryId: category.id.toString(),
      description: 'Hackeada',
      amountInCents: 100,
      type: 'INCOME',
      date: new Date(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(otherTransaction.description).toBe('Original')
  })

  it('should not move it to a category from another user', async () => {
    const otherUserCategory = makeCategory({
      userId: new UniqueEntityID('user-2'),
    })
    categoriesRepository.items.push(otherUserCategory)

    const result = await sut.execute({
      userId: 'user-1',
      transactionId: transaction.id.toString(),
      categoryId: otherUserCategory.id.toString(),
      description: transaction.description,
      amountInCents: transaction.amountInCents,
      type: transaction.type,
      date: transaction.date,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(transaction.categoryId.equals(category.id)).toBe(true)
  })

  it('should not edit with an invalid amount', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      transactionId: transaction.id.toString(),
      categoryId: category.id.toString(),
      description: transaction.description,
      amountInCents: 0,
      type: transaction.type,
      date: transaction.date,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTransactionAmountError)
  })

  it('should return not found for unknown ids', async () => {
    const unknownTransaction = await sut.execute({
      userId: 'user-1',
      transactionId: 'unknown-id',
      categoryId: category.id.toString(),
      description: 'Jantar',
      amountInCents: 100,
      type: 'EXPENSE',
      date: new Date(),
    })
    const unknownCategory = await sut.execute({
      userId: 'user-1',
      transactionId: transaction.id.toString(),
      categoryId: 'unknown-id',
      description: 'Jantar',
      amountInCents: 100,
      type: 'EXPENSE',
      date: new Date(),
    })

    expect(unknownTransaction.value).toBeInstanceOf(ResourceNotFoundError)
    expect(unknownCategory.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
