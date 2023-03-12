import { randomUUID } from 'node:crypto'

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
