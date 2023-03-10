import { randomUUID } from 'node:crypto'

import { hash } from 'bcrypt'

import { ENV } from '@/env'
import { prisma } from '@/lib/prisma'

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
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.')
  }

  const password_hash = await hash(password, ENV.HASH_ROUNDS)

  await prisma.user.create({
    data: {
      id: randomUUID(),
      name,
      email,
      password_hash,
    },
  })
}
