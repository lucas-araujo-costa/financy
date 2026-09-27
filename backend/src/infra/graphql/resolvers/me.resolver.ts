import { Authorized, Query, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeGetUserProfileUseCase,
} from '@/infra/factories/make-get-user-profile-use-case'
import { toGraphQLError } from '@/infra/graphql/errors/to-graphql-error'
import { UserType } from '@/infra/graphql/object-types/user-type'
import { UserPresenter } from '@/infra/graphql/presenters/user-presenter'

@Resolver()
export class MeResolver {
  @Authorized()
  @Query(() => UserType, { description: 'Usuário logado.' })
  async me(@CurrentUserId() userId: string): Promise<UserType> {
    const getUserProfile = makeGetUserProfileUseCase()

    const result = await getUserProfile.execute({ userId })

    if (result.isLeft()) {
      throw toGraphQLError(result.value)
    }

    return UserPresenter.toGraphQL(result.value.user)
  }
}
