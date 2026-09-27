import { beforeEach, describe, expect, it } from 'vitest'

import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import {
  InMemoryUsersRepository,
} from 'test/repositories/in-memory-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUserUseCase } from './register-user'

let usersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: RegisterUserUseCase

describe('Register user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new RegisterUserUseCase(usersRepository, fakeHasher, fakeEncrypter)
  })

  it('should register a new user and return an access token', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items).toHaveLength(1)
    const [user] = usersRepository.items

    expect(result.value).toEqual({
      user,
      accessToken: JSON.stringify({ sub: user.id.toString() }),
    })
  })

  it('should hash the password before saving', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    })

    expect(usersRepository.items[0].passwordHash).toBe('12345678-hashed')
  })

  it('should store the email trimmed and in lowercase', async () => {
    await sut.execute({
      name: '  John Doe ',
      email: '  JohnDoe@Example.com ',
      password: '12345678',
    })

    expect(usersRepository.items[0].email).toBe('johndoe@example.com')
    expect(usersRepository.items[0].name).toBe('John Doe')
  })

  it('should not register two users with the same email', async () => {
    usersRepository.items.push(makeUser({ email: 'johndoe@example.com' }))

    const result = await sut.execute({
      name: 'John Doe',
      email: 'JOHNDOE@example.com',
      password: '12345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
    expect(usersRepository.items).toHaveLength(1)
  })
})
