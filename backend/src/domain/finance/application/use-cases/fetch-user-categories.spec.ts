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

import { FetchUserCategoriesUseCase } from './fetch-user-categories'

let categoriesRepository: InMemoryCategoriesRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: FetchUserCategoriesUseCase

describe('Fetch user categories', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    transactionsRepository = new InMemoryTransactionsRepository(
      categoriesRepository,
    )
    sut = new FetchUserCategoriesUseCase(categoriesRepository)
  })

  it('should list only the user categories, by title', async () => {
    const userId = new UniqueEntityID('user-1')
    categoriesRepository.items.push(
      makeCategory({ userId, title: 'Transporte' }),
      makeCategory({ userId: new UniqueEntityID('user-2'), title: 'Outro' }),
      makeCategory({ userId, title: 'Alimentação' }),
    )

    const result = await sut.execute({ userId: 'user-1' })

    expect(result.isRight()).toBe(true)
    expect(result.value.categories.map((item) => item.title)).toEqual([
      'Alimentação',
      'Transporte',
    ])
  })

  it('should count the transactions and sum their amounts', async () => {
    const userId = new UniqueEntityID('user-1')
    const food = makeCategory({ userId, title: 'Alimentação' })
    const salary = makeCategory({ userId, title: 'Salário' })
    categoriesRepository.items.push(food, salary)
    transactionsRepository.items.push(
      makeTransaction({
        userId,
        categoryId: food.id,
        amountInCents: 1000,
        type: 'EXPENSE',
      }),
      makeTransaction({
        userId,
        categoryId: food.id,
        amountInCents: 2550,
        type: 'EXPENSE',
      }),
      makeTransaction({
        userId,
        categoryId: food.id,
        amountInCents: 500,
        type: 'INCOME',
      }),
    )

    const result = await sut.execute({ userId: 'user-1' })
    const [foodStats, salaryStats] = result.value.categories

    expect(foodStats).toMatchObject({
      transactionsCount: 3,
      totalInCents: 4050,
    })
    expect(salaryStats).toMatchObject({ transactionsCount: 0, totalInCents: 0 })
  })
})
