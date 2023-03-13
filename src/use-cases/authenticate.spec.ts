import { faker } from '@faker-js/faker'
import { hash } from 'bcrypt'
import { beforeEach, describe, expect, it } from 'vitest'

import { ENV } from '@/env'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    const createdUser = await usersRepository.create({
      email,
      name: faker.name.fullName(),
      password_hash: await hash(password, ENV.HASH_ROUNDS),
    })

    const { user: authenticatedUser } = await sut.execute({
      email,
      password,
    })

    expect(authenticatedUser).toStrictEqual(createdUser)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const email = faker.internet.email()

    await usersRepository.create({
      email,
      name: faker.name.fullName(),
      password_hash: await hash(faker.internet.password(), ENV.HASH_ROUNDS),
    })

    await expect(() =>
      sut.execute({
        email,
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
