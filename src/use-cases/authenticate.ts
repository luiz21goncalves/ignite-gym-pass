import { compare } from 'bcrypt'

import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'

import { InvalidCredentialsError } from './errors/invalid-credentials-error'

type AuthenticateUseCaseRequest = {
  email: string
  password: string
}

type AuthenticateUseCaseRespose = {
  user: User
}

export class AuthenticateUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseRespose> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
