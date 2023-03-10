import { hash } from 'bcrypt'

import { ENV } from '@/env'
import { UsersRepository } from '@/repositories/users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

type RegisterUserUseCaseRequest = {
  name: string
  email: string
  password: string
}

export class RegisterUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute({ email, name, password }: RegisterUserUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, ENV.HASH_ROUNDS)

    await this.usersRepository.create({
      email,
      name,
      password_hash,
    })
  }
}
