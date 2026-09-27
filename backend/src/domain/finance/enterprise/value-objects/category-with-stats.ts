import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import type { Category } from '../entities/category'
import type { CategoryColor } from '../types/category-color'
import type { CategoryIcon } from '../types/category-icon'

export interface CategoryWithStatsProps {
  categoryId: UniqueEntityID
  userId: UniqueEntityID
  title: string
  description: string | null
  icon: CategoryIcon
  color: CategoryColor
  /** Quantidade de transações da categoria, de todo o período. */
  transactionsCount: number
  /** Soma dos valores (entradas e saídas) de todo o período. */
  totalInCents: number
  createdAt: Date
  updatedAt: Date
}

/** Read model: a categoria com os números que a listagem mostra. */
export class CategoryWithStats extends ValueObject<CategoryWithStatsProps> {
  get categoryId() {
    return this.props.categoryId
  }

  get userId() {
    return this.props.userId
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get icon() {
    return this.props.icon
  }

  get color() {
    return this.props.color
  }

  get transactionsCount() {
    return this.props.transactionsCount
  }

  get totalInCents() {
    return this.props.totalInCents
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: CategoryWithStatsProps) {
    return new CategoryWithStats(props)
  }

  static fromCategory(
    category: Category,
    stats: { transactionsCount: number; totalInCents: number },
  ) {
    return new CategoryWithStats({
      categoryId: category.id,
      userId: category.userId,
      title: category.title,
      description: category.description,
      icon: category.icon,
      color: category.color,
      transactionsCount: stats.transactionsCount,
      totalInCents: stats.totalInCents,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    })
  }
}
