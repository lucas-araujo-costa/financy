import { Arg, Authorized, Mutation, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeEditUserProfileUseCase,
} from '@/infra/factories/make-edit-user-profile-use-case'
import { toGraphQLError } from '@/infra/graphql/errors/to-graphql-error'
import { EditProfileInput } from '@/infra/graphql/inputs/edit-profile-input'
import { UserType } from '@/infra/graphql/object-types/user-type'
import { UserPresenter } from '@/infra/graphql/presenters/user-presenter'

@Resolver()
export class EditProfileResolver {
  @Authorized()
  @Mutation(() => UserType, {
    description: 'Só o nome é editável: o e-mail não pode ser alterado.',
  })
  async editProfile(
    @Arg('input', () => EditProfileInput) input: EditProfileInput,
    @CurrentUserId() userId: string,
  ): Promise<UserType> {
    const editUserProfile = makeEditUserProfileUseCase()

    const result = await editUserProfile.execute({ userId, name: input.name })

    if (result.isLeft()) {
      throw toGraphQLError(result.value)
    }

    return UserPresenter.toGraphQL(result.value.user)
  }
}
