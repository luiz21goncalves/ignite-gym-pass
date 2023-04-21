import supertest from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('User Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const { token, email, name } = await createAndAuthenticateUser(app)

    const profileResponse = await supertest(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body).toStrictEqual({
      user: {
        id: expect.any(String),
        name,
        email,
        created_at: expect.any(String),
        role: 'MEMBER',
      },
    })
  })
})
