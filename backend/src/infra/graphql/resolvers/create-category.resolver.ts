import { Arg, Authorized, Mutation, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeCreateCategoryUseCase,
} from '@/infra/factories/make-create-category-use-case'
import { toGraphQLError } from '@/infra/graphql/errors/to-graphql-error'
import { CategoryInput } from '@/infra/graphql/inputs/category-input'
import { CategoryType } from '@/infra/graphql/object-types/category-type'
import {
  CategoryPresenter,
} from '@/infra/graphql/presenters/category-presenter'

@Resolver()
export class CreateCategoryResolver {
  @Authorized()
  @Mutation(() => CategoryType)
  async createCategory(
    @Arg('input', () => CategoryInput) input: CategoryInput,
    @CurrentUserId() userId: string,
  ): Promise<CategoryType> {
    const createCategory = makeCreateCategoryUseCase()

    const result = await createCategory.execute({ userId, ...input })

    if (result.isLeft()) {
      throw toGraphQLError(result.value)
    }

    return CategoryPresenter.toGraphQL(result.value.category)
  }
}
