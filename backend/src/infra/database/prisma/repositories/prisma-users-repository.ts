import type {
  UsersRepository,
} from '@/domain/identity/application/repositories/users-repository'
import type { User } from '@/domain/identity/enterprise/entities/user'

import type { PrismaClient } from '../generated/client'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'

export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    return user
      ? PrismaUserMapper.toDomain(user)
      : null
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    return user
      ? PrismaUserMapper.toDomain(user)
      : null
  }

  async create(user: User) {
    await this.prisma.user.create({ data: PrismaUserMapper.toPrisma(user) })
  }

  async save(user: User) {
    const { id, ...data } = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({ where: { id }, data })
  }
}
