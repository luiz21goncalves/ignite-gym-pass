import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { app } from '@/app'

describe('User Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
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

    const profileResponse = await supertest(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${authResponse.body.token}`)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body).toStrictEqual({
      user: {
        id: expect.any(String),
        name,
        email,
        created_at: expect.any(String),
      },
    })
  })
})
