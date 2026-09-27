import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Transaction,
  type TransactionProps,
} from '@/domain/finance/enterprise/entities/transaction'
import {
  TRANSACTION_TYPES,
} from '@/domain/finance/enterprise/types/transaction-type'

export function makeTransaction(
  override: Partial<TransactionProps> = {},
  id?: UniqueEntityID,
) {
  return Transaction.create(
    {
      userId: new UniqueEntityID(),
      categoryId: new UniqueEntityID(),
      description: faker.commerce.productName(),
      amountInCents: faker.number.int({ min: 1, max: 1_000_000 }),
      type: faker.helpers.arrayElement(TRANSACTION_TYPES),
      date: faker.date.recent({ days: 90 }),
      ...override,
    },
    id,
  )
}
