import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'

import {
  makeRegisterUserUseCase,
} from '@/infra/factories/make-register-user-use-case'
import type { GraphQLContext } from '@/infra/graphql/context'
import { toGraphQLError } from '@/infra/graphql/errors/to-graphql-error'
import { RegisterInput } from '@/infra/graphql/inputs/register-input'
import { AuthPayloadType } from '@/infra/graphql/object-types/auth-payload-type'
import { UserPresenter } from '@/infra/graphql/presenters/user-presenter'

@Resolver()
export class RegisterResolver {
  @Mutation(() => AuthPayloadType, {
    description: 'Cria a conta e já devolve o token de acesso.',
  })
  async register(
    @Arg('input', () => RegisterInput) input: RegisterInput,
    @Ctx() { request }: GraphQLContext,
  ): Promise<AuthPayloadType> {
    const registerUser = makeRegisterUserUseCase(request.server.jwt)

    const result = await registerUser.execute(input)

    if (result.isLeft()) {
      throw toGraphQLError(result.value)
    }

    const { user, accessToken } = result.value

    return { accessToken, user: UserPresenter.toGraphQL(user) }
  }
}
