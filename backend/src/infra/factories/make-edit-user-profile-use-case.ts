import {
  EditUserProfileUseCase,
} from '@/domain/identity/application/use-cases/edit-user-profile'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaUsersRepository,
} from '@/infra/database/prisma/repositories/prisma-users-repository'

export function makeEditUserProfileUseCase() {
  return new EditUserProfileUseCase(new PrismaUsersRepository(prisma))
}
