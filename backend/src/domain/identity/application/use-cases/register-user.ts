import { type Either, left, right } from '@/core/either'

import { User } from '../../enterprise/entities/user'
import type { Encrypter } from '../cryptography/encrypter'
import type { HashGenerator } from '../cryptography/hash-generator'
import type { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { normalizeEmail } from './normalize-email'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
}

// O cadastro já devolve o token: quem cria a conta entra direto no app.
type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  { user: User; accessToken: string }
>

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: RegisterUserUseCaseRequest,
  ): Promise<RegisterUserUseCaseResponse> {
    const { name, email, password } = request

    const normalizedEmail = normalizeEmail(email)

    const userWithSameEmail =
      await this.usersRepository.findByEmail(normalizedEmail)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError())
    }

    const user = User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await this.hashGenerator.hash(password),
    })

    await this.usersRepository.create(user)

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    return right({ user, accessToken })
  }
}
