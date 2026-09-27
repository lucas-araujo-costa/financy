import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { normalizeText } from '@/core/utils/normalize-text'

import type { CategoryColor } from '../types/category-color'
import type { CategoryIcon } from '../types/category-icon'

export interface CategoryProps {
  userId: UniqueEntityID
  title: string
  description: string | null
  icon: CategoryIcon
  color: CategoryColor
  createdAt: Date
  updatedAt: Date
}

export class Category extends Entity<CategoryProps> {
  get userId() {
    return this.props.userId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  /** O título é único por usuário sem diferenciar maiúsculas e acentos. */
  get normalizedTitle() {
    return normalizeText(this.props.title)
  }

  get description() {
    return this.props.description
  }

  set description(description: string | null) {
    this.props.description = description
    this.touch()
  }

  get icon() {
    return this.props.icon
  }

  set icon(icon: CategoryIcon) {
    this.props.icon = icon
    this.touch()
  }

  get color() {
    return this.props.color
  }

  set color(color: CategoryColor) {
    this.props.color = color
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

  static create(
    props: Optional<CategoryProps, 'description' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const createdAt = props.createdAt ?? new Date()

    return new Category(
      {
        ...props,
        description: props.description ?? null,
        createdAt,
        updatedAt: props.updatedAt ?? createdAt,
      },
      id,
    )
  }
}
