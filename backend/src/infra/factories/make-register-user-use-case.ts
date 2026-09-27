import type { JWT } from '@fastify/jwt'

import {
  RegisterUserUseCase,
} from '@/domain/identity/application/use-cases/register-user'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaUsersRepository,
} from '@/infra/database/prisma/repositories/prisma-users-repository'

export function makeRegisterUserUseCase(jwt: JWT) {
  return new RegisterUserUseCase(
    new PrismaUsersRepository(prisma),
    new BcryptHasher(),
    new JwtEncrypter(jwt),
  )
}
