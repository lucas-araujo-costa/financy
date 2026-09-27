import { beforeEach, describe, expect, it } from 'vitest'

import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'
import { makeUser } from 'test/factories/make-user'
import {
  InMemoryUsersRepository,
} from 'test/repositories/in-memory-users-repository'

import { EditUserProfileUseCase } from './edit-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: EditUserProfileUseCase

describe('Edit user profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new EditUserProfileUseCase(usersRepository)
  })

  it('should edit the user name and keep the email', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'johndoe@example.com',
      createdAt: new Date(2025, 0, 1),
    })
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: '  John Smith ',
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[0].name).toBe('John Smith')
    expect(usersRepository.items[0].email).toBe('johndoe@example.com')
    expect(usersRepository.items[0].updatedAt.getTime()).toBeGreaterThan(
      usersRepository.items[0].createdAt.getTime(),
    )
  })

  it('should return not found for an unknown user', async () => {
    const result = await sut.execute({ userId: 'unknown-id', name: 'John' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
