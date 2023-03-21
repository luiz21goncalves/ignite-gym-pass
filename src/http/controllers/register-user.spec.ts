import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { app } from '@/app'

describe('Register User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await supertest(app.server).post('/users').send({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })

    expect(response.statusCode).toEqual(201)
  })
})
