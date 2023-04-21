import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { app } from '@/app'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    await supertest(app.server).post('/users').send({
      name: faker.name.fullName(),
      email,
      password,
    })

    const authResponse = await supertest(app.server).post('/sessions').send({
      email,
      password,
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await supertest(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toStrictEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toStrictEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
