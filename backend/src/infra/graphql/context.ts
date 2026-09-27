import type { ApolloFastifyContextFunction } from '@as-integrations/fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'

export interface GraphQLContext {
  request: FastifyRequest
  reply: FastifyReply
  /** Preenchido só quando o `Authorization: Bearer <jwt>` é válido. */
  userId?: string
}

export const buildContext: ApolloFastifyContextFunction<
  GraphQLContext
> = async (request, reply) => {
  try {
    const { sub } = await request.jwtVerify<{ sub: string }>()

    return { request, reply, userId: sub }
  } catch {
    // Sem token, ou token inválido/expirado: segue como visitante e o
    // @Authorized() barra o que exige login.
    return { request, reply }
  }
}
