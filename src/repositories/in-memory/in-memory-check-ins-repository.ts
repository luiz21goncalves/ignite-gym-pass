import { randomUUID } from 'node:crypto'

import dayjs from 'dayjs'

import {
  CheckIn,
  CheckInData,
  CheckInsRepository,
} from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private checkIns: CheckIn[]

  constructor() {
    this.checkIns = []
  }

  public async findManyByUserId(
    userId: string,
    page: number,
  ): Promise<CheckIn[]> {
    const checkIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  public async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate = checkInDate.isSame(date, 'date')

      return checkIn.user_id === userId && isOnSameDate
    })

    return checkInOnSameDate ?? null
  }

  public async create({ gym_id, user_id }: CheckInData): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      gym_id,
      user_id,
      created_at: new Date(),
      validated_at: null,
    }

    this.checkIns.push(checkIn)

    return checkIn
  }
}
