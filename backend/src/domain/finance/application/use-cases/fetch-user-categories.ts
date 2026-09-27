import { type Either, right } from '@/core/either'

import type {
  CategoryWithStats,
} from '../../enterprise/value-objects/category-with-stats'
import type {
  CategoriesRepository,
} from '../repositories/categories-repository'

interface FetchUserCategoriesUseCaseRequest {
  userId: string
}

type FetchUserCategoriesUseCaseResponse = Either<
  never,
  { categories: CategoryWithStats[] }
>

export class FetchUserCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(
    request: FetchUserCategoriesUseCaseRequest,
  ): Promise<FetchUserCategoriesUseCaseResponse> {
    const { userId } = request

    const categories =
      await this.categoriesRepository.findManyWithStatsByUserId(userId)

    return right({ categories })
  }
}
