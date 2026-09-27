import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { normalizeText } from '@/core/utils/normalize-text'

import type { TransactionType } from '../types/transaction-type'

export interface TransactionProps {
  userId: UniqueEntityID
  categoryId: UniqueEntityID
  description: string
  /** Sempre positivo. O sinal vem de `type`. */
  amountInCents: number
  type: TransactionType
  date: Date
  createdAt: Date
  updatedAt: Date
}

export class Transaction extends Entity<TransactionProps> {
  get userId() {
    return this.props.userId
  }

  get categoryId() {
    return this.props.categoryId
  }

  set categoryId(categoryId: UniqueEntityID) {
    this.props.categoryId = categoryId
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  /** A busca por descrição ignora maiúsculas e acentos. */
  get normalizedDescription() {
    return normalizeText(this.props.description)
  }

  get amountInCents() {
    return this.props.amountInCents
  }

  set amountInCents(amountInCents: number) {
    this.props.amountInCents = amountInCents
    this.touch()
  }

  get type() {
    return this.props.type
  }

  set type(type: TransactionType) {
    this.props.type = type
    this.touch()
  }

  get date() {
    return this.props.date
  }

  set date(date: Date) {
    this.props.date = date
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static isValidAmount(amountInCents: number) {
    return Number.isSafeInteger(amountInCents) && amountInCents > 0
  }

  static create(
    props: Optional<TransactionProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const createdAt = props.createdAt ?? new Date()

    return new Transaction(
      { ...props, createdAt, updatedAt: props.updatedAt ?? createdAt },
      id,
    )
  }
}
