import {
  CheckIn,
  CheckInsRepository,
} from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import {
  Coordinates,
  getDistanteBetweenCoordinates,
} from '@/utils/get-distance-between-coordinates'

import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from './errors/resource-not-found'

type CheckInUseCaseRequest = {
  userId: string
  gymId: string
  userCoordinates: Coordinates
}

type CheckInUseCaseResponse = {
  checkIn: CheckIn
}

const MAX_DISTANCE_IN_KILOMETERS = 0.1

export class CheckInUseCase {
  constructor(
    private readonly checkInsRepository: CheckInsRepository,
    private readonly gymsRepository: GymsRepository,
  ) {}

  public async execute({
    gymId,
    userId,
    userCoordinates,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanteBetweenCoordinates({
      from: {
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
      },
      to: { latitude: gym.latitude, longitude: gym.longitude },
    })

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
