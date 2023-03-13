import { faker } from '@faker-js/faker'
import { hash } from 'bcrypt'
import { beforeEach, describe, expect, it } from 'vitest'

import { ENV } from '@/env'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ResourceNotFoundError } from './errors/resource-not-found'
import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    const createdUser = await usersRepository.create({
      email,
      name: faker.name.fullName(),
      password_hash: await hash(password, ENV.HASH_ROUNDS),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user).toStrictEqual(createdUser)
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
