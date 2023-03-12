import { randomUUID } from 'node:crypto'

import { prisma } from '@/lib/prisma'

import { CreateUserData, User, UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  public async create({
    email,
    name,
    password_hash,
  }: CreateUserData): Promise<User> {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name,
        email,
        password_hash,
      },
    })

    return user
  }

  public async findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}
