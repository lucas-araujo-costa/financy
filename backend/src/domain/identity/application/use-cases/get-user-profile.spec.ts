import { beforeEach, describe, expect, it } from 'vitest'

import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'
import { makeUser } from 'test/factories/make-user'
import {
  InMemoryUsersRepository,
} from 'test/repositories/in-memory-users-repository'

import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get user profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should get the user profile', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({ userId: user.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ user })
  })

  it('should return not found for an unknown user', async () => {
    const result = await sut.execute({ userId: 'unknown-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
