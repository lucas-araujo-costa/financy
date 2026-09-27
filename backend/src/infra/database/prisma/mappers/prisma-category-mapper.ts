import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/finance/enterprise/entities/category'
import type {
  CategoryColor,
} from '@/domain/finance/enterprise/types/category-color'
import type {
  CategoryIcon,
} from '@/domain/finance/enterprise/types/category-icon'

import type { Category as PrismaCategory } from '../generated/client'

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory) {
    return Category.create(
      {
        userId: new UniqueEntityID(raw.userId),
        title: raw.title,
        description: raw.description,
        // O banco só recebe valores validados pela lista fixa do domínio.
        icon: raw.icon as CategoryIcon,
        color: raw.color as CategoryColor,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(category: Category): PrismaCategory {
    return {
      id: category.id.toString(),
      userId: category.userId.toString(),
      title: category.title,
      normalizedTitle: category.normalizedTitle,
      description: category.description,
      icon: category.icon,
      color: category.color,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }
}
