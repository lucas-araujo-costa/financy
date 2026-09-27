import { createParameterDecorator } from 'type-graphql'

import type { GraphQLContext } from '@/infra/graphql/context'

/** Id do usuário logado. Use junto com @Authorized(). */
export function CurrentUserId() {
  return createParameterDecorator<GraphQLContext>(({ context }) => {
    if (!context.userId) {
      throw new Error('@CurrentUserId() precisa de @Authorized().')
    }

    return context.userId
  })
}
