import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const title = faker.random.words()
    const latitude = Number(faker.address.latitude())
    const longitude = Number(faker.address.longitude())

    const { gym } = await sut.execute({
      description: null,
      phone: null,
      title,
      latitude,
      longitude,
    })

    expect(gym).toStrictEqual({
      id: expect.any(String),
      title,
      latitude,
      longitude,
      description: null,
      phone: null,
    })
  })
})
