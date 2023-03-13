import { Gym, GymsRepository } from '@/repositories/gyms-repository'

type CreateGymUseCaseRequest = {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

type CreateGymUseCaseResponse = {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  public async execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      description,
      latitude,
      longitude,
      phone,
      title,
    })

    return { gym }
  }
}
