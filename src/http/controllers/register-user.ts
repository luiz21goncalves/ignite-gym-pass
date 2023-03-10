import { randomUUID } from 'node:crypto'

import { hash } from 'bcrypt'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ENV } from '@/env'
import { prisma } from '@/lib/prisma'

export async function registerUser(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodySchema.parse(request.body)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    return replay.status(409).send()
  }

  const password_hash = await hash(password, ENV.HASH_ROUNDS)

  await prisma.user.create({
    data: {
      id: randomUUID(),
      name,
      email,
      password_hash,
    },
  })

  return replay.status(201).send()
}
