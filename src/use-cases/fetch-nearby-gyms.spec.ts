import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await Promise.all([
      gymsRepository.create({
        title: 'Near Gym',
        latitude: -27.2092052,
        longitude: -49.6401091,
        description: null,
        phone: null,
      }),
      gymsRepository.create({
        title: 'Far Gym',
        latitude: -27.0610928,
        longitude: -49.5229501,
        description: null,
        phone: null,
      }),
    ])

    const { gyms } = await sut.execute({
      userCoordinates: {
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toStrictEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
