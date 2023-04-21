import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get the count of check-ins', async () => {
    const { token, email } = await createAndAuthenticateUser(app, true)

    const latitude = Number(faker.address.latitude())
    const longitude = Number(faker.address.longitude())

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    })

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

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
        id: randomUUID(),
      },
    })

    const response = await supertest(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(204)

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
