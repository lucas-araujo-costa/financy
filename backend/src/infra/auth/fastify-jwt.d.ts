import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    /** `sub` é o id do usuário. */
    payload: { sub: string }
    user: { sub: string }
  }
}
