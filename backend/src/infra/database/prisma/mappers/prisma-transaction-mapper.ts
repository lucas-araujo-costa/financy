import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction } from '@/domain/finance/enterprise/entities/transaction'

import type { Transaction as PrismaTransaction } from '../generated/client'

export class PrismaTransactionMapper {
  static toDomain(raw: PrismaTransaction) {
    return Transaction.create(
      {
        userId: new UniqueEntityID(raw.userId),
        categoryId: new UniqueEntityID(raw.categoryId),
        description: raw.description,
        amountInCents: raw.amountInCents,
        type: raw.type,
        date: raw.date,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(transaction: Transaction): PrismaTransaction {
    return {
      id: transaction.id.toString(),
      userId: transaction.userId.toString(),
      categoryId: transaction.categoryId.toString(),
      description: transaction.description,
      normalizedDescription: transaction.normalizedDescription,
      amountInCents: transaction.amountInCents,
      type: transaction.type,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }
  }
}
