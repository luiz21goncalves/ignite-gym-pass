import { randomUUID } from 'node:crypto'

import { CreateGymData, Gym, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  private gyms: Gym[]

  constructor() {
    this.gyms = []
  }

  public async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  public async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id)

    return gym ?? null
  }

  public async create({
    description,
    latitude,
    longitude,
    phone,
    title,
  }: CreateGymData): Promise<Gym> {
    const gym: Gym = {
      id: randomUUID(),
      description,
      latitude,
      longitude,
      phone,
      title,
    }

    this.gyms.push(gym)

    return gym
  }
}
