import { hash } from 'bcrypt'

import { ENV } from '@/env'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

type RegisterUserUseCaseRequest = {
  name: string
  email: string
  password: string
}

export async function registerUserUseCase({
  email,
  name,
  password,
}: RegisterUserUseCaseRequest) {
  const prismaUsersRepository = new PrismaUsersRepository()

  const userWithSameEmail = await prismaUsersRepository.findByEmail(email)

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.')
  }

  const password_hash = await hash(password, ENV.HASH_ROUNDS)

  await prismaUsersRepository.create({
    email,
    name,
    password_hash,
  })
}
