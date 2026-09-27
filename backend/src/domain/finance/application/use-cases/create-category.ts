import { type Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Category } from '../../enterprise/entities/category'
import type { CategoryColor } from '../../enterprise/types/category-color'
import type { CategoryIcon } from '../../enterprise/types/category-icon'
import {
  CategoryWithStats,
} from '../../enterprise/value-objects/category-with-stats'
import type {
  CategoriesRepository,
} from '../repositories/categories-repository'
import {
  CategoryAlreadyExistsError,
} from './errors/category-already-exists-error'
import { normalizeDescription } from './normalize-description'

interface CreateCategoryUseCaseRequest {
  userId: string
  title: string
  description?: string | null
  icon: CategoryIcon
  color: CategoryColor
}

type CreateCategoryUseCaseResponse = Either<
  CategoryAlreadyExistsError,
  { category: CategoryWithStats }
>

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(
    request: CreateCategoryUseCaseRequest,
  ): Promise<CreateCategoryUseCaseResponse> {
    const { userId, title, description, icon, color } = request

    const trimmedTitle = title.trim()

    const categoryWithSameTitle = await this.categoriesRepository.findByTitle(
      userId,
      trimmedTitle,
    )

    if (categoryWithSameTitle) {
      return left(new CategoryAlreadyExistsError(trimmedTitle))
    }

    const category = Category.create({
      userId: new UniqueEntityID(userId),
      title: trimmedTitle,
      description: normalizeDescription(description),
      icon,
      color,
    })

    await this.categoriesRepository.create(category)

    // Uma categoria nova ainda não tem transações.
    return right({
      category: CategoryWithStats.fromCategory(category, {
        transactionsCount: 0,
        totalInCents: 0,
      }),
    })
  }
}
