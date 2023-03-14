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

  public async save({
    created_at,
    gym_id,
    id,
    user_id,
    validated_at,
  }: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.checkIns.findIndex((checkIn) => checkIn.id === id)

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = {
        created_at,
        gym_id,
        id,
        user_id,
        validated_at,
      }
    }

    return {
      created_at,
      gym_id,
      id,
      user_id,
      validated_at,
    }
  }

  public async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === id)

    return checkIn ?? null
  }

  public async countUserId(userId: string): Promise<number> {
    const checkIns = this.checkIns.filter(
      (checkIn) => checkIn.user_id === userId,
    )

    return checkIns.length
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
