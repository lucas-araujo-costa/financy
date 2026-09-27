import {
  GetUserProfileUseCase,
} from '@/domain/identity/application/use-cases/get-user-profile'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaUsersRepository,
} from '@/infra/database/prisma/repositories/prisma-users-repository'

export function makeGetUserProfileUseCase() {
  return new GetUserProfileUseCase(new PrismaUsersRepository(prisma))
}
