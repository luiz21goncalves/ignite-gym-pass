import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await Promise.all([
      supertest(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: faker.lorem.sentence(),
          latitude: -27.2092052,
          longitude: -49.6401091,
          phone: faker.phone.number(),
          title: 'JavaScript Gym',
        }),
      supertest(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: faker.lorem.sentence(),
          latitude: -27.0610928,
          longitude: -49.5229501,
          phone: faker.phone.number(),
          title: 'TypeScript Gym',
        }),
    ])

    const response = await supertest(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
