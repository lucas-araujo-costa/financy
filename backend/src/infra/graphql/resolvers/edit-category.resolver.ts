import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeEditCategoryUseCase,
} from '@/infra/factories/make-edit-category-use-case'
import { toGraphQLError } from '@/infra/graphql/errors/to-graphql-error'
import { CategoryInput } from '@/infra/graphql/inputs/category-input'
import { CategoryType } from '@/infra/graphql/object-types/category-type'
import {
  CategoryPresenter,
} from '@/infra/graphql/presenters/category-presenter'

@Resolver()
export class EditCategoryResolver {
  @Authorized()
  @Mutation(() => CategoryType)
  async editCategory(
    @Arg('id', () => ID) categoryId: string,
    @Arg('input', () => CategoryInput) input: CategoryInput,
    @CurrentUserId() userId: string,
  ): Promise<CategoryType> {
    const editCategory = makeEditCategoryUseCase()

    const result = await editCategory.execute({ userId, categoryId, ...input })

    if (result.isLeft()) {
      throw toGraphQLError(result.value)
    }

    return CategoryPresenter.toGraphQL(result.value.category)
  }
}
