import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import type { Category } from '../entities/category'
import type { Transaction } from '../entities/transaction'
import type { CategoryColor } from '../types/category-color'
import type { CategoryIcon } from '../types/category-icon'
import type { TransactionType } from '../types/transaction-type'

export interface TransactionWithCategoryProps {
  transactionId: UniqueEntityID
  userId: UniqueEntityID
  description: string
  amountInCents: number
  type: TransactionType
  date: Date
  category: {
    id: UniqueEntityID
    title: string
    icon: CategoryIcon
    color: CategoryColor
  }
  createdAt: Date
  updatedAt: Date
}

/** Read model: a transação com a tag e o ícone da categoria, como na tabela. */
export class TransactionWithCategory
  extends ValueObject<TransactionWithCategoryProps> {
  get transactionId() {
    return this.props.transactionId
  }

  get userId() {
    return this.props.userId
  }

  get description() {
    return this.props.description
  }

  get amountInCents() {
    return this.props.amountInCents
  }

  get type() {
    return this.props.type
  }

  get date() {
    return this.props.date
  }

  get category() {
    return this.props.category
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: TransactionWithCategoryProps) {
    return new TransactionWithCategory(props)
  }

  static fromTransaction(transaction: Transaction, category: Category) {
    return new TransactionWithCategory({
      transactionId: transaction.id,
      userId: transaction.userId,
      description: transaction.description,
      amountInCents: transaction.amountInCents,
      type: transaction.type,
      date: transaction.date,
      category: {
        id: category.id,
        title: category.title,
        icon: category.icon,
        color: category.color,
      },
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    })
  }
}
