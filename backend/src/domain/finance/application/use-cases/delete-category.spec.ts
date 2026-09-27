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

import { DeleteCategoryUseCase } from './delete-category'
import {
  CategoryHasTransactionsError,
} from './errors/category-has-transactions-error'

let categoriesRepository: InMemoryCategoriesRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: DeleteCategoryUseCase

describe('Delete category', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    transactionsRepository = new InMemoryTransactionsRepository(
      categoriesRepository,
    )
    sut = new DeleteCategoryUseCase(
      categoriesRepository,
      transactionsRepository,
    )
  })

  it('should delete a category', async () => {
    const category = makeCategory({ userId: new UniqueEntityID('user-1') })
    categoriesRepository.items.push(category)

    const result = await sut.execute({
      userId: 'user-1',
      categoryId: category.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(categoriesRepository.items).toHaveLength(0)
  })

  it('should not delete a category that has transactions', async () => {
    const userId = new UniqueEntityID('user-1')
    const category = makeCategory({ userId })
    categoriesRepository.items.push(category)
    transactionsRepository.items.push(
      makeTransaction({ userId, categoryId: category.id }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      categoryId: category.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CategoryHasTransactionsError)
    expect(categoriesRepository.items).toHaveLength(1)
  })

  it('should not delete a category from another user', async () => {
    const category = makeCategory({ userId: new UniqueEntityID('user-2') })
    categoriesRepository.items.push(category)

    const result = await sut.execute({
      userId: 'user-1',
      categoryId: category.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(categoriesRepository.items).toHaveLength(1)
  })

  it('should return not found for an unknown category', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      categoryId: 'unknown-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
