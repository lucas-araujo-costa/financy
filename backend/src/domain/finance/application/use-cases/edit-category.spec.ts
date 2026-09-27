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

import { EditCategoryUseCase } from './edit-category'
import {
  CategoryAlreadyExistsError,
} from './errors/category-already-exists-error'

let categoriesRepository: InMemoryCategoriesRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: EditCategoryUseCase

describe('Edit category', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    transactionsRepository = new InMemoryTransactionsRepository(
      categoriesRepository,
    )
    sut = new EditCategoryUseCase(categoriesRepository)
  })

  it('should edit a category', async () => {
    const userId = new UniqueEntityID('user-1')
    const category = makeCategory({ userId, createdAt: new Date(2025, 0, 1) })
    categoriesRepository.items.push(category)
    transactionsRepository.items.push(
      makeTransaction({ userId, categoryId: category.id, amountInCents: 700 }),
      makeTransaction({ userId, categoryId: category.id, amountInCents: 300 }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      categoryId: category.id.toString(),
      title: 'Transporte',
      description: 'Gasolina, transporte público e viagens',
      icon: 'car-front',
      color: 'purple',
    })

    expect(result.isRight()).toBe(true)
    expect(categoriesRepository.items[0]).toMatchObject({
      title: 'Transporte',
      description: 'Gasolina, transporte público e viagens',
      icon: 'car-front',
      color: 'purple',
    })
    expect(categoriesRepository.items[0].updatedAt.getTime()).toBeGreaterThan(
      category.createdAt.getTime(),
    )
    expect(result.value).toMatchObject({
      category: {
        title: 'Transporte',
        transactionsCount: 2,
        totalInCents: 1000,
      },
    })
  })

  it('should keep the same title without a conflict', async () => {
    const category = makeCategory({
      userId: new UniqueEntityID('user-1'),
      title: 'Mercado',
    })
    categoriesRepository.items.push(category)

    const result = await sut.execute({
      userId: 'user-1',
      categoryId: category.id.toString(),
      title: 'Mercado',
      icon: 'shopping-cart',
      color: 'green',
    })

    expect(result.isRight()).toBe(true)
    expect(categoriesRepository.items[0].description).toBeNull()
  })

  it('should allow changing only the case of its own title', async () => {
    const category = makeCategory({
      userId: new UniqueEntityID('user-1'),
      title: 'mercado',
    })
    categoriesRepository.items.push(category)

    const result = await sut.execute({
      userId: 'user-1',
      categoryId: category.id.toString(),
      title: 'Mercado',
      icon: 'shopping-cart',
      color: 'green',
    })

    expect(result.isRight()).toBe(true)
    expect(categoriesRepository.items[0].title).toBe('Mercado')
  })

  it('should not use the title of another category', async () => {
    const userId = new UniqueEntityID('user-1')
    const category = makeCategory({ userId, title: 'Mercado' })
    categoriesRepository.items.push(
      category,
      makeCategory({ userId, title: 'Saúde' }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      categoryId: category.id.toString(),
      title: 'saude',
      icon: 'heart-pulse',
      color: 'red',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError)
    expect(categoriesRepository.items[0].title).toBe('Mercado')
  })

  it('should not edit a category from another user', async () => {
    const category = makeCategory({
      userId: new UniqueEntityID('user-2'),
      title: 'Mercado',
    })
    categoriesRepository.items.push(category)

    const result = await sut.execute({
      userId: 'user-1',
      categoryId: category.id.toString(),
      title: 'Hackeado',
      icon: 'gift',
      color: 'pink',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(categoriesRepository.items[0].title).toBe('Mercado')
  })

  it('should return not found for an unknown category', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      categoryId: 'unknown-id',
      title: 'Mercado',
      icon: 'shopping-cart',
      color: 'green',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
