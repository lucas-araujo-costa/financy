import { beforeEach, describe, expect, it } from 'vitest'

import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import {
  InMemoryUsersRepository,
} from 'test/repositories/in-memory-users-repository'

import { AuthenticateUserUseCase } from './authenticate-user'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let usersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate user', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(
      usersRepository,
      fakeHasher,
      fakeEncrypter,
    )

    usersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
        passwordHash: await fakeHasher.hash('12345678'),
      }),
    )
  })

  it('should authenticate with the right credentials', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    })

    const user = usersRepository.items[0]

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user,
      accessToken: JSON.stringify({ sub: user.id.toString() }),
    })
  })

  it('should ignore case and spaces around the email', async () => {
    const result = await sut.execute({
      email: ' JohnDoe@Example.com ',
      password: '12345678',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not authenticate with a wrong password', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should give the same error for an unknown email', async () => {
    const wrongPassword = await sut.execute({
      email: 'johndoe@example.com',
      password: 'wrong-password',
    })
    const unknownEmail = await sut.execute({
      email: 'unknown@example.com',
      password: '12345678',
    })

    expect(unknownEmail.isLeft()).toBe(true)
    expect(unknownEmail.value).toBeInstanceOf(WrongCredentialsError)
    expect(unknownEmail.value).toEqual(wrongPassword.value)
  })
})
