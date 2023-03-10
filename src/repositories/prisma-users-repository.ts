import { randomUUID } from 'node:crypto'

import { prisma } from '@/lib/prisma'

type CreateUserData = {
  name: string
  email: string
  password_hash: string
}

export class PrismaUsersRepository {
  public async create({ email, name, password_hash }: CreateUserData) {
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

  public async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}
