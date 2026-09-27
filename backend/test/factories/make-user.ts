import { faker } from '@faker-js/faker'

import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  User,
  type UserProps,
} from '@/domain/identity/enterprise/entities/user'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  return User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      passwordHash: faker.internet.password(),
      ...override,
    },
    id,
  )
}
