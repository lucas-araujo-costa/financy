import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/identity/enterprise/entities/user'

import type { User as PrismaUser } from '../generated/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser) {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        passwordHash: raw.passwordHash,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
