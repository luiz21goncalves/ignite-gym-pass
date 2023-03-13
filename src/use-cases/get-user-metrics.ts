import { CheckInsRepository } from '@/repositories/check-ins-repository'

type GetUserMetricsUseCaseRequest = {
  userId: string
}

type GetUserMetricsUseCaseResponse = {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  public async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countUserId(userId)

    return { checkInsCount }
  }
}
