import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await Promise.all([
      gymsRepository.create({
        title: 'JavaScript Gym',
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.latitude()),
        description: null,
        phone: null,
      }),
      gymsRepository.create({
        title: 'TypeScript Gym',
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.latitude()),
        description: null,
        phone: null,
      }),
      gymsRepository.create({
        title: 'Bolotinha Gym',
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.latitude()),
        description: null,
        phone: null,
      }),
    ])

    const { gyms } = await sut.execute({ page: 1, query: 'Bolotinha' })

    expect(gyms).toHaveLength(1)
    expect(gyms).toStrictEqual([
      expect.objectContaining({
        title: 'Bolotinha Gym',
      }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    const array = Array.from({ length: 22 }).map((_, index) => index + 1)

    for await (const id of array) {
      await gymsRepository.create({
        title: `Bolotinha Gym ${id}`,
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.latitude()),
        description: null,
        phone: null,
      })
    }

    const { gyms } = await sut.execute({
      page: 2,
      query: 'Bolotinha',
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toStrictEqual([
      expect.objectContaining({
        title: `Bolotinha Gym 21`,
      }),
      expect.objectContaining({
        title: `Bolotinha Gym 22`,
      }),
    ])
  })
})
