// O TypeGraphQL lê `Reflect.getMetadata` já ao carregar os decorators, então
// o polyfill precisa vir antes de qualquer import do schema.
import 'reflect-metadata'

import { ApolloServer } from '@apollo/server'
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'

import { prisma } from './database/prisma/client'
import { env } from './env'
import { buildContext, type GraphQLContext } from './graphql/context'
import { formatError } from './graphql/errors/format-error'
import { buildGraphQLSchema } from './graphql/schema'

interface BuildAppOptions {
  logger?: boolean
}

export async function buildApp({ logger = false }: BuildAppOptions = {}) {
  const app = fastify({ logger })

  await app.register(fastifyCors, { origin: env.CORS_ORIGIN })
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: '7d' },
  })

  const apollo = new ApolloServer<GraphQLContext>({
    schema: await buildGraphQLSchema(),
    plugins: [fastifyApolloDrainPlugin(app)],
    formatError,
  })

  await apollo.start()
  await app.register(fastifyApollo(apollo), { context: buildContext })

  app.addHook('onClose', async () => {
    await prisma.$disconnect()
  })

  return app
}
