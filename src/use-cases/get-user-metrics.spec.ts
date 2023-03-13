import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Ge tUser Metrics  Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
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

    const { checkInsCount } = await sut.execute({
      userId,
    })

    expect(checkInsCount).toEqual(3)
  })
})
