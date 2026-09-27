import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import {
  InMemoryCategoriesRepository,
} from 'test/repositories/in-memory-categories-repository'

import { CreateCategoryUseCase } from './create-category'
import {
  CategoryAlreadyExistsError,
} from './errors/category-already-exists-error'

let categoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase

describe('Create category', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateCategoryUseCase(categoriesRepository)
  })

  it('should create a category', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      title: 'Alimentação',
      description: 'Restaurantes, delivery e refeições',
      icon: 'utensils',
      color: 'blue',
    })

    expect(result.isRight()).toBe(true)
    expect(categoriesRepository.items).toHaveLength(1)
    expect(categoriesRepository.items[0]).toMatchObject({
      title: 'Alimentação',
      description: 'Restaurantes, delivery e refeições',
      icon: 'utensils',
      color: 'blue',
    })
    expect(categoriesRepository.items[0].userId.toString()).toBe('user-1')
    expect(result.value).toMatchObject({
      category: { title: 'Alimentação', transactionsCount: 0, totalInCents: 0 },
    })
    expect(result.value).toMatchObject({
      category: { title: 'Alimentação', transactionsCount: 0, totalInCents: 0 },
    })
  })

  it('should store a blank description as null', async () => {
    await sut.execute({
      userId: 'user-1',
      title: '  Mercado ',
      description: '   ',
      icon: 'shopping-cart',
      color: 'orange',
    })

    expect(categoriesRepository.items[0].title).toBe('Mercado')
    expect(categoriesRepository.items[0].description).toBeNull()
  })

  it('should not repeat a title for the same user', async () => {
    categoriesRepository.items.push(
      makeCategory({ userId: new UniqueEntityID('user-1'), title: 'Mercado' }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      title: 'Mercado ',
      icon: 'shopping-cart',
      color: 'orange',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError)
    expect(categoriesRepository.items).toHaveLength(1)
  })

  it('should treat titles with other case or accents as equal', async () => {
    categoriesRepository.items.push(
      makeCategory({ userId: new UniqueEntityID('user-1'), title: 'Saúde' }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      title: '  SAUDE ',
      icon: 'heart-pulse',
      color: 'red',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it('should allow the same title for different users', async () => {
    categoriesRepository.items.push(
      makeCategory({ userId: new UniqueEntityID('user-2'), title: 'Mercado' }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      title: 'Mercado',
      icon: 'shopping-cart',
      color: 'orange',
    })

    expect(result.isRight()).toBe(true)
    expect(categoriesRepository.items).toHaveLength(2)
  })
})
