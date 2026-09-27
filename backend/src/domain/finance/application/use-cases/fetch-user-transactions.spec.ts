import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { makeTransaction } from 'test/factories/make-transaction'
import {
  InMemoryCategoriesRepository,
} from 'test/repositories/in-memory-categories-repository'
import {
  InMemoryTransactionsRepository,
} from 'test/repositories/in-memory-transactions-repository'

import type { Category } from '../../enterprise/entities/category'
import { FetchUserTransactionsUseCase } from './fetch-user-transactions'

let categoriesRepository: InMemoryCategoriesRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: FetchUserTransactionsUseCase
let food: Category
let salary: Category

const userId = new UniqueEntityID('user-1')
const day = (month: number, date: number) =>
  new Date(Date.UTC(2025, month - 1, date))

describe('Fetch user transactions', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    transactionsRepository = new InMemoryTransactionsRepository(
      categoriesRepository,
    )
    sut = new FetchUserTransactionsUseCase(transactionsRepository)

    food = makeCategory({
      userId,
      title: 'Alimentação',
      icon: 'utensils',
      color: 'blue',
    })
    salary = makeCategory({
      userId,
      title: 'Salário',
      icon: 'briefcase-business',
      color: 'green',
    })
    categoriesRepository.items.push(food, salary)
  })

  it('should list only the user transactions, newest first', async () => {
    const otherUserCategory = makeCategory({
      userId: new UniqueEntityID('user-2'),
    })
    categoriesRepository.items.push(otherUserCategory)
    transactionsRepository.items.push(
      makeTransaction({
        userId,
        categoryId: food.id,
        description: 'Antiga',
        date: day(11, 1),
      }),
      makeTransaction({
        userId,
        categoryId: salary.id,
        description: 'Nova',
        date: day(11, 30),
      }),
      makeTransaction({
        userId: new UniqueEntityID('user-2'),
        categoryId: otherUserCategory.id,
        date: day(11, 15),
      }),
    )

    const result = await sut.execute({ userId: 'user-1', page: 1, perPage: 10 })

    expect(result.value.total).toBe(2)
    expect(result.value.transactions.map((item) => item.description)).toEqual([
      'Nova',
      'Antiga',
    ])
    expect(result.value.transactions[0].category).toEqual({
      id: salary.id,
      title: 'Salário',
      icon: 'briefcase-business',
      color: 'green',
    })
  })

  it('should paginate and keep the total of all matches', async () => {
    for (let date = 1; date <= 27; date++) {
      transactionsRepository.items.push(
        makeTransaction({ userId, categoryId: food.id, date: day(11, date) }),
      )
    }

    const result = await sut.execute({ userId: 'user-1', page: 3, perPage: 10 })

    expect(result.value.total).toBe(27)
    expect(result.value.transactions).toHaveLength(7)
    expect(result.value.transactions[0].date).toEqual(day(11, 7))
  })

  it('should search ignoring case and accents', async () => {
    transactionsRepository.items.push(
      makeTransaction({
        userId,
        categoryId: food.id,
        description: 'Conta de Água',
      }),
      makeTransaction({ userId, categoryId: food.id, description: 'Mercado' }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      filters: { search: 'AGUA' },
      page: 1,
      perPage: 10,
    })

    expect(result.value.total).toBe(1)
    expect(result.value.transactions[0].description).toBe('Conta de Água')
  })

  it('should filter by a piece of the description', async () => {
    transactionsRepository.items.push(
      makeTransaction({
        userId,
        categoryId: food.id,
        description: 'Jantar no Restaurante',
      }),
      makeTransaction({ userId, categoryId: food.id, description: 'Mercado' }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      filters: { search: '  restaurante ' },
      page: 1,
      perPage: 10,
    })

    expect(result.value.total).toBe(1)
    expect(result.value.transactions[0].description).toBe(
      'Jantar no Restaurante',
    )
  })

  it('should ignore a blank search', async () => {
    transactionsRepository.items.push(
      makeTransaction({ userId, categoryId: food.id }),
      makeTransaction({ userId, categoryId: food.id }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      filters: { search: '   ' },
      page: 1,
      perPage: 10,
    })

    expect(result.value.total).toBe(2)
  })

  it('should filter by type, category and period together', async () => {
    const matching = {
      userId,
      categoryId: food.id,
      type: 'EXPENSE' as const,
      date: day(11, 10),
    }
    transactionsRepository.items.push(
      makeTransaction({ ...matching, description: 'Esperada' }),
      // Cada uma abaixo falha em um só filtro
      makeTransaction({ ...matching, type: 'INCOME' }),
      makeTransaction({ ...matching, categoryId: salary.id }),
      makeTransaction({ ...matching, date: day(10, 31) }),
      makeTransaction({ ...matching, date: day(12, 1) }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      filters: {
        type: 'EXPENSE',
        categoryId: food.id.toString(),
        period: { month: 11, year: 2025 },
      },
      page: 1,
      perPage: 10,
    })

    expect(result.value.total).toBe(1)
    expect(result.value.transactions[0].description).toBe('Esperada')
  })
})
