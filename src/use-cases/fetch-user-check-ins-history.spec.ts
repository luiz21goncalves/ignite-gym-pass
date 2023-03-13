import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch check-in history', async () => {
    const userId = faker.datatype.uuid()

    await Promise.all([
      checkInsRepository.create({
        user_id: userId,
        gym_id: 'gym-id-1',
      }),
      checkInsRepository.create({
        user_id: userId,
        gym_id: 'gym-id-2',
      }),
      checkInsRepository.create({
        user_id: userId,
        gym_id: 'gym-id-3',
      }),
    ])

    const { checkIns } = await sut.execute({
      userId,
      page: 1,
    })

    expect(checkIns).toHaveLength(3)
    expect(checkIns).toStrictEqual([
      expect.objectContaining({
        user_id: userId,
        gym_id: 'gym-id-1',
      }),
      expect.objectContaining({
        user_id: userId,
        gym_id: 'gym-id-2',
      }),
      expect.objectContaining({
        user_id: userId,
        gym_id: 'gym-id-3',
      }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    const userId = faker.datatype.uuid()

    const array = Array.from({ length: 22 }).map((_, index) => index + 1)

    for await (const id of array) {
      await checkInsRepository.create({
        user_id: userId,
        gym_id: `gym-id-${id}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId,
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toStrictEqual([
      expect.objectContaining({
        user_id: userId,
        gym_id: 'gym-id-21',
      }),
      expect.objectContaining({
        user_id: userId,
        gym_id: 'gym-id-22',
      }),
    ])
  })
})
