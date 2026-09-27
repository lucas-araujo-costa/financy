import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeDeleteCategoryUseCase,
} from '@/infra/factories/make-delete-category-use-case'
import { toGraphQLError } from '@/infra/graphql/errors/to-graphql-error'

@Resolver()
export class DeleteCategoryResolver {
  @Authorized()
  @Mutation(() => Boolean, {
    description: 'Falha com CONFLICT se a categoria tiver transações.',
  })
  async deleteCategory(
    @Arg('id', () => ID) categoryId: string,
    @CurrentUserId() userId: string,
  ): Promise<boolean> {
    const deleteCategory = makeDeleteCategoryUseCase()

    const result = await deleteCategory.execute({ userId, categoryId })

    if (result.isLeft()) {
      throw toGraphQLError(result.value)
    }

    return true
  }
}
