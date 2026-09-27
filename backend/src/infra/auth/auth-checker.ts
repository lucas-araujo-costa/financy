import type { AuthChecker } from 'type-graphql'

import type { GraphQLContext } from '@/infra/graphql/context'

/** Sem roles: @Authorized() só exige um usuário logado. */
export const authChecker: AuthChecker<GraphQLContext> = ({ context }) =>
  Boolean(context.userId)
