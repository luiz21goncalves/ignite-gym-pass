import { randomUUID } from 'node:crypto'

import { Gym as PrismaGym } from '@prisma/client'

import { PAGINATION } from '@/constants'
import { prisma } from '@/lib/prisma'
import { Coordinates } from '@/utils/get-distance-between-coordinates'

import { CreateGymData, Gym, GymsRepository } from '../gyms-repository'

export class PrismaGymsRepository implements GymsRepository {
  public async create({
    description,
    latitude,
    longitude,
    phone,
    title,
  }: CreateGymData): Promise<Gym> {
    const gym = await prisma.gym.create({
      data: {
        id: randomUUID(),
        description,
        latitude,
        longitude,
        phone,
        title,
      },
    })

    return {
      ...gym,
      latitude: gym.latitude.toNumber(),
      longitude: gym.latitude.toNumber(),
    }
  }

  public async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })

    if (gym) {
      return {
        ...gym,
        latitude: gym.latitude.toNumber(),
        longitude: gym.latitude.toNumber(),
      }
    }

    return gym
  }

  public async findManyNearby({
    latitude,
    longitude,
  }: Coordinates): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<PrismaGym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    const formattedGyms = gyms.map((gym) => {
      return {
        ...gym,
        latitude: gym.latitude.toNumber(),
        longitude: gym.latitude.toNumber(),
      }
    })

    return formattedGyms
  }

  public async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: PAGINATION.MAX_ITEMS_PER_PAGE,
      skip: (page - 1) * PAGINATION.MAX_ITEMS_PER_PAGE,
    })

    const formattedGyms = gyms.map((gym) => {
      return {
        ...gym,
        latitude: gym.latitude.toNumber(),
        longitude: gym.latitude.toNumber(),
      }
    })

    return formattedGyms
  }
}
