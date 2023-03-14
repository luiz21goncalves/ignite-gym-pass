import { Gym, GymsRepository } from '@/repositories/gyms-repository'
import { Coordinates } from '@/utils/get-distance-between-coordinates'

type FetchNearbyGymsUseCaseRequest = {
  userCoordinates: Coordinates
}

type FetchNearbyGymsUseCaseResponse = {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  public async execute({
    userCoordinates,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userCoordinates.latitude,
      longitude: userCoordinates.longitude,
    })

    return { gyms }
  }
}
