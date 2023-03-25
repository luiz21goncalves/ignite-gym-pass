import { faker } from '@faker-js/faker'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const name = faker.name.fullName()
  const email = faker.internet.email()
  const password = faker.internet.password()

  await supertest(app.server).post('/users').send({
    name,
    email,
    password,
  })

  const authResponse = await supertest(app.server).post('/sessions').send({
    email,
    password,
  })

  const { token } = authResponse.body

  return { token, name, email, password }
}
