import { hash } from 'bcrypt'
import { describe, expect, it } from 'vitest'

import { ENV } from '@/env'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate User Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    const createdUser = await usersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password_hash: await hash('123456', ENV.HASH_ROUNDS),
    })

    const { user: authenticatedUser } = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(authenticatedUser).toStrictEqual(createdUser)
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await expect(() =>
      sut.execute({
        email: 'johndoe@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password_hash: await hash('123456', ENV.HASH_ROUNDS),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
