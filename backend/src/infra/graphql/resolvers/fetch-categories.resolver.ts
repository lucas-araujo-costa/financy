import { Authorized, Query, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeFetchUserCategoriesUseCase,
} from '@/infra/factories/make-fetch-user-categories-use-case'
import { CategoryType } from '@/infra/graphql/object-types/category-type'
import {
  CategoryPresenter,
} from '@/infra/graphql/presenters/category-presenter'

@Resolver()
export class FetchCategoriesResolver {
  @Authorized()
  @Query(() => [CategoryType], {
    description: 'Categorias do usuário, em ordem de título, com estatísticas.',
  })
  async categories(@CurrentUserId() userId: string): Promise<CategoryType[]> {
    const fetchUserCategories = makeFetchUserCategoriesUseCase()

    const result = await fetchUserCategories.execute({ userId })

    return result.value.categories.map(CategoryPresenter.toGraphQL)
  }
}
