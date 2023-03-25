import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await supertest(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: faker.lorem.sentence(),
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.longitude()),
        phone: faker.phone.number(),
        title: 'JavaScript Gym',
      })

    await supertest(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: faker.lorem.sentence(),
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.longitude()),
        phone: faker.phone.number(),
        title: 'TypeScript Gym',
      })

    const response = await supertest(app.server)
      .get('/gyms/search')
      .set('Authorization', `Bearer ${token}`)
      .query({
        q: 'JavaScript',
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
