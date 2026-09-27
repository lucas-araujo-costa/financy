import { type Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'

import type { CategoryColor } from '../../enterprise/types/category-color'
import type { CategoryIcon } from '../../enterprise/types/category-icon'
import type {
  CategoryWithStats,
} from '../../enterprise/value-objects/category-with-stats'
import type {
  CategoriesRepository,
} from '../repositories/categories-repository'
import {
  CategoryAlreadyExistsError,
} from './errors/category-already-exists-error'
import { normalizeDescription } from './normalize-description'

interface EditCategoryUseCaseRequest {
  userId: string
  categoryId: string
  title: string
  description?: string | null
  icon: CategoryIcon
  color: CategoryColor
}

type EditCategoryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | CategoryAlreadyExistsError,
  { category: CategoryWithStats }
>

export class EditCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(
    request: EditCategoryUseCaseRequest,
  ): Promise<EditCategoryUseCaseResponse> {
    const { userId, categoryId, title, description, icon, color } = request

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    if (category.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    const trimmedTitle = title.trim()

    const categoryWithSameTitle = await this.categoriesRepository.findByTitle(
      userId,
      trimmedTitle,
    )

    // Achar a própria categoria não é conflito: permite trocar "mercado" por
    // "Mercado".
    if (categoryWithSameTitle && !categoryWithSameTitle.equals(category)) {
      return left(new CategoryAlreadyExistsError(trimmedTitle))
    }

    category.title = trimmedTitle
    category.description = normalizeDescription(description)
    category.icon = icon
    category.color = color

    await this.categoriesRepository.save(category)

    const categoryWithStats =
      await this.categoriesRepository.findWithStatsById(categoryId)

    if (!categoryWithStats) {
      return left(new ResourceNotFoundError())
    }

    return right({ category: categoryWithStats })
  }
}
