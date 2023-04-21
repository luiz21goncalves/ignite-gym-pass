import { faker } from '@faker-js/faker'
import { hash } from 'bcrypt'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'

import { ENV } from '@/env'
import { prisma } from '@/lib/prisma'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  const name = faker.name.fullName()
  const email = faker.internet.email()
  const password = faker.internet.password()
  const password_hash = await hash(password, ENV.HASH_ROUNDS)

  await prisma.user.create({
    data: {
      id: randomUUID(),
      name,
      email,
      password_hash,
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await supertest(app.server).post('/sessions').send({
    email,
    password,
  })

  const { token } = authResponse.body

  return { token, name, email, password }
}
