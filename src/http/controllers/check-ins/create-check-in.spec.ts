import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const latitude = Number(faker.address.latitude())
    const longitude = Number(faker.address.longitude())

    const gym = await prisma.gym.create({
      data: {
        id: randomUUID(),
        description: faker.lorem.sentence(),
        latitude,
        longitude,
        phone: faker.phone.number(),
        title: faker.company.name(),
      },
    })

    const response = await supertest(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude,
        longitude,
      })

    expect(response.status).toEqual(201)
  })
})
