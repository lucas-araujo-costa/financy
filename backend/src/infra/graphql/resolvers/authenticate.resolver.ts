import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'

import {
  makeAuthenticateUserUseCase,
} from '@/infra/factories/make-authenticate-user-use-case'
import type { GraphQLContext } from '@/infra/graphql/context'
import { toGraphQLError } from '@/infra/graphql/errors/to-graphql-error'
import { AuthenticateInput } from '@/infra/graphql/inputs/authenticate-input'
import { AuthPayloadType } from '@/infra/graphql/object-types/auth-payload-type'
import { UserPresenter } from '@/infra/graphql/presenters/user-presenter'

@Resolver()
export class AuthenticateResolver {
  @Mutation(() => AuthPayloadType)
  async authenticate(
    @Arg('input', () => AuthenticateInput) input: AuthenticateInput,
    @Ctx() { request }: GraphQLContext,
  ): Promise<AuthPayloadType> {
    const authenticateUser = makeAuthenticateUserUseCase(request.server.jwt)

    const result = await authenticateUser.execute(input)

    if (result.isLeft()) {
      throw toGraphQLError(result.value)
    }

    const { user, accessToken } = result.value

    return { accessToken, user: UserPresenter.toGraphQL(user) }
  }
}
