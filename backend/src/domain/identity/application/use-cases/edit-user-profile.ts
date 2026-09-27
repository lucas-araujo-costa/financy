import { type Either, left, right } from '@/core/either'
import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'

import type { User } from '../../enterprise/entities/user'
import type { UsersRepository } from '../repositories/users-repository'

// No Figma só o nome é editável: "o e-mail não pode ser alterado".
interface EditUserProfileUseCaseRequest {
  userId: string
  name: string
}

type EditUserProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  { user: User }
>

export class EditUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    request: EditUserProfileUseCaseRequest,
  ): Promise<EditUserProfileUseCaseResponse> {
    const { userId, name } = request

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    user.name = name.trim()

    await this.usersRepository.save(user)

    return right({ user })
  }
}
