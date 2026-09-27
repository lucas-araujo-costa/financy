import type { FastifyJWT, JWT } from '@fastify/jwt'

import type {
  Encrypter,
} from '@/domain/identity/application/cryptography/encrypter'

/** Assina com o `app.jwt` do @fastify/jwt (segredo e expiração do app.ts). */
export class JwtEncrypter implements Encrypter {
  constructor(private jwt: JWT) {}

  async encrypt(payload: Record<string, unknown>) {
    return this.jwt.sign(payload as FastifyJWT['payload'])
  }
}
