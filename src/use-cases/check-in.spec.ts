import { faker } from '@faker-js/faker'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from './errors/resource-not-found'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let usersRepository: InMemoryUsersRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CheckInUseCase(
      checkInsRepository,
      gymsRepository,
      usersRepository,
    )

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

    const user = await usersRepository.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
    })

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: user.id,
      userCoordinates: {
        latitude,
        longitude,
      },
    })

    expect(checkIn).toStrictEqual({
      id: expect.any(String),
      gym_id: gym.id,
      user_id: user.id,
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

    const user = await usersRepository.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
    })

    vi.setSystemTime(new Date(2023, 2, 13))

    await sut.execute({
      gymId: gym.id,
      userId: user.id,
      userCoordinates: {
        latitude,
        longitude,
      },
    })

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: user.id,
        userCoordinates: {
          latitude,
          longitude,
        },
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
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

    const user = await usersRepository.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
    })

    vi.setSystemTime(new Date(2023, 2, 13))

    await sut.execute({
      gymId: gym.id,
      userId: user.id,
      userCoordinates: {
        latitude,
        longitude,
      },
    })

    vi.setSystemTime(new Date(2023, 2, 14))

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: user.id,
      userCoordinates: {
        latitude,
        longitude,
      },
    })

    expect(checkIn).toStrictEqual({
      id: expect.any(String),
      gym_id: gym.id,
      user_id: user.id,
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

    const user = await usersRepository.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
    })

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: user.id,
        userCoordinates: {
          latitude: -27.2092952,
          longitude: -49.6401091,
        },
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('should not be able to check in a non-existing gym', async () => {
    const latitude = Number(faker.address.latitude())
    const longitude = Number(faker.address.longitude())

    const user = await usersRepository.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
    })

    await expect(() =>
      sut.execute({
        gymId: 'non-existing-gym',
        userId: user.id,
        userCoordinates: {
          latitude,
          longitude,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to check in a non-existing user', async () => {
    const latitude = Number(faker.address.latitude())
    const longitude = Number(faker.address.longitude())

    const gym = await gymsRepository.create({
      description: faker.lorem.lines(),
      title: faker.company.name(),
      phone: faker.phone.number(),
      latitude,
      longitude,
    })

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: 'non-existing-gym',
        userCoordinates: {
          latitude,
          longitude,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
