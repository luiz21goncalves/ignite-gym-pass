import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Check-in Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get the count of check-ins', async () => {
    const { token, email } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    })

    const gym = await prisma.gym.create({
      data: {
        id: randomUUID(),
        description: faker.lorem.sentence(),
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.longitude()),
        phone: faker.phone.number(),
        title: faker.company.name(),
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
          id: randomUUID(),
        },
        {
          gym_id: gym.id,
          user_id: user.id,
          id: randomUUID(),
        },
      ],
    })

    const response = await supertest(app.server)
      .get(`/check-ins/metrics`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})
