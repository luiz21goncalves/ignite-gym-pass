import { randomUUID } from 'node:crypto'

import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

import {
  CheckIn,
  CheckInData,
  CheckInsRepository,
} from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  public async create({ gym_id, user_id }: CheckInData): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data: {
        id: randomUUID(),
        gym_id,
        user_id,
      },
    })

    return checkIn
  }

  public async save({
    created_at,
    gym_id,
    id,
    user_id,
    validated_at,
  }: CheckIn): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.update({
      where: { id },
      data: {
        gym_id,
        user_id,
        created_at,
        validated_at,
      },
    })

    return checkIn
  }

  public async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date').toDate()
    const endOfTheDay = dayjs(date).endOf('date').toDate()

    const checkIns = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })

    return checkIns
  }

  public async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({ where: { id } })

    return checkIn
  }

  public async countUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }

  public async findManyByUserId(
    userId: string,
    page: number,
  ): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: { user_id: userId },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }
}
