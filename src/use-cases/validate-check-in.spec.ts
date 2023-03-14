import { faker } from '@faker-js/faker'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { ValidateCheckInUseCase } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdcheckIn = await checkInsRepository.create({
      gym_id: faker.datatype.uuid(),
      user_id: faker.datatype.uuid(),
    })

    const { checkIn } = await sut.execute({ checkInId: createdcheckIn.id })

    expect(checkIn).toStrictEqual({
      ...createdcheckIn,
      validated_at: expect.any(Date),
    })
  })

  it('should not be able to validate an inexistent the check-in', async () => {
    await expect(() =>
      sut.execute({ checkInId: 'inexistent-check-in-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 3, 17, 14, 20))

    const createdcheckIn = await checkInsRepository.create({
      gym_id: faker.datatype.uuid(),
      user_id: faker.datatype.uuid(),
    })

    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21

    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)

    await expect(
      sut.execute({ checkInId: createdcheckIn.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
