import type { ApolloServerOptions } from '@apollo/server'
import { unwrapResolverError } from '@apollo/server/errors'

import type { GraphQLContext } from '../context'

type FormatError = NonNullable<
  ApolloServerOptions<GraphQLContext>['formatError']
>

/**
 * Erros esperados (com `extensions.code` do mapa 5.7, validação, auth) passam
 * como estão. Erro inesperado (bug, banco fora do ar) é logado e chega ao
 * cliente só como INTERNAL_SERVER_ERROR, sem vazar detalhes internos.
 */
export const formatError: FormatError = (formattedError, error) => {
  if (formattedError.extensions?.code !== 'INTERNAL_SERVER_ERROR') {
    return formattedError
  }

  console.error(unwrapResolverError(error))

  return {
    message: 'Erro interno. Tente novamente em instantes.',
    locations: formattedError.locations,
    path: formattedError.path,
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  }
}
