import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { app } from '@/app'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    await supertest(app.server).post('/users').send({
      name: faker.name.fullName(),
      email,
      password,
    })

    const response = await supertest(app.server).post('/sessions').send({
      email,
      password,
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toStrictEqual({
      token: expect.any(String),
    })
  })
})
