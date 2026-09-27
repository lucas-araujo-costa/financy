import type { User } from '@/domain/identity/enterprise/entities/user'
import type { UserType } from '@/infra/graphql/object-types/user-type'

export class UserPresenter {
  static toGraphQL(user: User): UserType {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
