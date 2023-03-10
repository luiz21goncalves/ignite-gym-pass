import { compare } from 'bcrypt'
import { describe, expect, it } from 'vitest'

import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUserUseCase } from './register-user'

describe('Register user User Case', () => {
  it('should be able to register', async () => {
    const inMemoryUsersRepository = new InMemoryUserRepository()
    const registerUserUserCase = new RegisterUserUseCase(
      inMemoryUsersRepository,
    )

    const { user } = await registerUserUserCase.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'strong_password',
    })

    expect(user).toStrictEqual({
      id: expect.any(String),
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: expect.any(String),
      created_at: expect.any(Date),
    })
  })

  it('should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUserRepository()
    const registerUserUserCase = new RegisterUserUseCase(
      inMemoryUsersRepository,
    )

    const { user } = await registerUserUserCase.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'strong_password',
    })

    const isPasswordCorrectlyHashed = await compare(
      'strong_password',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toEqual(true)
  })

  it('should not be able to register with same email twice', async () => {
    const inMemoryUsersRepository = new InMemoryUserRepository()
    const registerUserUserCase = new RegisterUserUseCase(
      inMemoryUsersRepository,
    )

    const email = 'johndoe@email.com'

    await registerUserUserCase.execute({
      name: 'John Doe',
      email,
      password: 'strong_password',
    })

    await expect(() =>
      registerUserUserCase.execute({
        name: 'John Wick',
        email,
        password: 'my_dog',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
