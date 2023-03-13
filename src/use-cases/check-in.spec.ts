import { faker } from '@faker-js/faker'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const latitude = Number(faker.address.latitude())
    const longitude = Number(faker.address.longitude())

    const gym = await gymsRepository.create({
      description: faker.lorem.lines(),
      title: faker.company.name(),
      phone: faker.phone.number(),
      latitude,
      longitude,
    })

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: 'user-id',
      userCoordinates: {
        latitude,
        longitude,
      },
    })

    expect(checkIn).toStrictEqual({
      id: expect.any(String),
      gym_id: gym.id,
      user_id: 'user-id',
      created_at: expect.any(Date),
      validated_at: null,
    })
  })

  it('should not be able to check in twice in the same day', async () => {
    const latitude = Number(faker.address.latitude())
    const longitude = Number(faker.address.longitude())

    const gym = await gymsRepository.create({
      description: faker.lorem.lines(),
      title: faker.company.name(),
      phone: faker.phone.number(),
      latitude,
      longitude,
    })

    vi.setSystemTime(new Date(2023, 2, 13))

    await sut.execute({
      gymId: gym.id,
      userId: 'user-id',
      userCoordinates: {
        latitude,
        longitude,
      },
    })

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: 'user-id',
        userCoordinates: {
          latitude: Number(faker.address.latitude()),
          longitude: Number(faker.address.longitude()),
        },
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in on different days', async () => {
    const latitude = Number(faker.address.latitude())
    const longitude = Number(faker.address.longitude())

    const gym = await gymsRepository.create({
      description: faker.lorem.lines(),
      title: faker.company.name(),
      phone: faker.phone.number(),
      latitude,
      longitude,
    })

    vi.setSystemTime(new Date(2023, 2, 13))

    await sut.execute({
      gymId: gym.id,
      userId: 'user-id',
      userCoordinates: {
        latitude,
        longitude,
      },
    })

    vi.setSystemTime(new Date(2023, 2, 14))

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: 'user-id',
      userCoordinates: {
        latitude,
        longitude,
      },
    })

    expect(checkIn).toStrictEqual({
      id: expect.any(String),
      gym_id: gym.id,
      user_id: 'user-id',
      created_at: expect.any(Date),
      validated_at: null,
    })
  })

  it('should be able to check in on distant gym', async () => {
    const gym = await gymsRepository.create({
      description: faker.lorem.lines(),
      title: faker.company.name(),
      phone: faker.phone.number(),
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: 'user-id',
        userCoordinates: {
          latitude: -27.2092952,
          longitude: -49.6401091,
        },
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
