import type { JWT } from '@fastify/jwt'

import {
  AuthenticateUserUseCase,
} from '@/domain/identity/application/use-cases/authenticate-user'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaUsersRepository,
} from '@/infra/database/prisma/repositories/prisma-users-repository'

export function makeAuthenticateUserUseCase(jwt: JWT) {
  return new AuthenticateUserUseCase(
    new PrismaUsersRepository(prisma),
    new BcryptHasher(),
    new JwtEncrypter(jwt),
  )
}
