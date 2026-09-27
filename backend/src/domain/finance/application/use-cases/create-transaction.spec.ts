import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'
import { makeCategory } from 'test/factories/make-category'
import {
  InMemoryCategoriesRepository,
} from 'test/repositories/in-memory-categories-repository'
import {
  InMemoryTransactionsRepository,
} from 'test/repositories/in-memory-transactions-repository'

import type { Category } from '../../enterprise/entities/category'
import { CreateTransactionUseCase } from './create-transaction'
import {
  InvalidTransactionAmountError,
} from './errors/invalid-transaction-amount-error'

let categoriesRepository: InMemoryCategoriesRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: CreateTransactionUseCase
let category: Category

describe('Create transaction', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    transactionsRepository = new InMemoryTransactionsRepository(
      categoriesRepository,
    )
    sut = new CreateTransactionUseCase(
      transactionsRepository,
      categoriesRepository,
    )

    category = makeCategory({ userId: new UniqueEntityID('user-1') })
    categoriesRepository.items.push(category)
  })

  it('should create a transaction', async () => {
    const date = new Date(Date.UTC(2025, 10, 30))

    const result = await sut.execute({
      userId: 'user-1',
      categoryId: category.id.toString(),
      description: '  Jantar no Restaurante ',
      amountInCents: 8900,
      type: 'EXPENSE',
      date,
    })

    expect(result.isRight()).toBe(true)
    expect(transactionsRepository.items).toHaveLength(1)
    expect(transactionsRepository.items[0]).toMatchObject({
      description: 'Jantar no Restaurante',
      amountInCents: 8900,
      type: 'EXPENSE',
      date,
    })
    expect(transactionsRepository.items[0].categoryId.equals(category.id)).toBe(
      true,
    )
    expect(result.value).toMatchObject({
      transaction: {
        description: 'Jantar no Restaurante',
        category: { id: category.id, title: category.title },
      },
    })
  })

  it.each([0, -100, 10.5, Number.NaN])(
    'should not create a transaction with amount %s',
    async (amountInCents) => {
      const result = await sut.execute({
        userId: 'user-1',
        categoryId: category.id.toString(),
        description: 'Inválida',
        amountInCents,
        type: 'INCOME',
        date: new Date(),
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(InvalidTransactionAmountError)
      expect(transactionsRepository.items).toHaveLength(0)
    },
  )

  it('should not use a category from another user', async () => {
    const otherUserCategory = makeCategory({
      userId: new UniqueEntityID('user-2'),
    })
    categoriesRepository.items.push(otherUserCategory)

    const result = await sut.execute({
      userId: 'user-1',
      categoryId: otherUserCategory.id.toString(),
      description: 'Jantar',
      amountInCents: 8900,
      type: 'EXPENSE',
      date: new Date(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(transactionsRepository.items).toHaveLength(0)
  })

  it('should not create a transaction in an unknown category', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      categoryId: 'unknown-id',
      description: 'Jantar',
      amountInCents: 8900,
      type: 'EXPENSE',
      date: new Date(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
