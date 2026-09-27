import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTransaction } from 'test/factories/make-transaction'
import {
  InMemoryCategoriesRepository,
} from 'test/repositories/in-memory-categories-repository'
import {
  InMemoryTransactionsRepository,
} from 'test/repositories/in-memory-transactions-repository'

import { GetFinancialSummaryUseCase } from './get-financial-summary'

let transactionsRepository: InMemoryTransactionsRepository
let sut: GetFinancialSummaryUseCase

const userId = new UniqueEntityID('user-1')
const day = (month: number, date: number) =>
  new Date(Date.UTC(2025, month - 1, date))
const income = (amountInCents: number, date: Date) =>
  makeTransaction({ userId, type: 'INCOME', amountInCents, date })
const expense = (amountInCents: number, date: Date) =>
  makeTransaction({ userId, type: 'EXPENSE', amountInCents, date })
const november2025 = { userId: 'user-1', month: 11, year: 2025 }

describe('Get financial summary', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository(
      new InMemoryCategoriesRepository(),
    )
    sut = new GetFinancialSummaryUseCase(transactionsRepository)
  })

  it('should sum the all-time balance and the month totals', async () => {
    transactionsRepository.items.push(
      // Novembro/2025
      income(480_000, day(11, 1)),
      expense(8_900, day(11, 30)),
      expense(1_100, day(11, 15)),
      // Fora do mês: entra só no saldo
      income(20_000, day(10, 31)),
      expense(50_000, day(12, 1)),
      // Outro usuário: não entra em nada
      makeTransaction({
        userId: new UniqueEntityID('user-2'),
        type: 'INCOME',
        amountInCents: 999_999,
        date: day(11, 10),
      }),
    )

    const result = await sut.execute(november2025)

    expect(result.isRight()).toBe(true)
    expect(result.value.summary).toMatchObject({
      balanceInCents: 480_000 + 20_000 - 8_900 - 1_100 - 50_000,
      monthIncomeInCents: 480_000,
      monthExpenseInCents: 10_000,
    })
  })

  it('should allow a negative balance', async () => {
    transactionsRepository.items.push(
      expense(5_000, day(11, 1)),
    )

    const result = await sut.execute(november2025)

    expect(result.value.summary.balanceInCents).toBe(-5_000)
  })

  it('should return zeros when the user has no transactions', async () => {
    const result = await sut.execute(november2025)

    expect(result.value.summary).toMatchObject({
      balanceInCents: 0,
      monthIncomeInCents: 0,
      monthExpenseInCents: 0,
    })
  })
})
