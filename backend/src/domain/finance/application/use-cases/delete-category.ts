import { type Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'

import type {
  CategoriesRepository,
} from '../repositories/categories-repository'
import type {
  TransactionsRepository,
} from '../repositories/transactions-repository'
import {
  CategoryHasTransactionsError,
} from './errors/category-has-transactions-error'

interface DeleteCategoryUseCaseRequest {
  userId: string
  categoryId: string
}

type DeleteCategoryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | CategoryHasTransactionsError,
  null
>

export class DeleteCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  async execute(
    request: DeleteCategoryUseCaseRequest,
  ): Promise<DeleteCategoryUseCaseResponse> {
    const { userId, categoryId } = request

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    if (category.userId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    // Categoria com transações não pode ser excluída (docs/decisions/0007).
    const transactionsCount =
      await this.transactionsRepository.countByCategoryId(categoryId)

    if (transactionsCount > 0) {
      return left(new CategoryHasTransactionsError())
    }

    await this.categoriesRepository.delete(category)

    return right(null)
  }
}
