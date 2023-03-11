import { faker } from '@faker-js/faker'
import { compare } from 'bcrypt'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUserUseCase } from './register-user'

let inMemoryUsersRepository: InMemoryUserRepository
let sut: RegisterUserUseCase

describe('Register User User Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUserRepository()
    sut = new RegisterUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to register', async () => {
    const name = faker.name.fullName()
    const email = faker.internet.email()

    const { user } = await sut.execute({
      name,
      email,
      password: faker.internet.password(),
    })

    expect(user).toStrictEqual({
      id: expect.any(String),
      name,
      email,
      password_hash: expect.any(String),
      created_at: expect.any(Date),
    })
  })

  it('should hash user password upon registration', async () => {
    const password = faker.internet.password()

    const { user } = await sut.execute({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password,
    })

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toEqual(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = faker.internet.email()

    await sut.execute({
      name: faker.name.fullName(),
      email,
      password: faker.internet.password(),
    })

    await expect(() =>
      sut.execute({
        name: faker.name.fullName(),
        email,
        password: faker.internet.password(),
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
