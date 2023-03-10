import { randomUUID } from 'node:crypto'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

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

  await prisma.user.create({
    data: {
      id: randomUUID(),
      name,
      email,
      password_hash: password,
    },
  })

  return replay.status(201).send()
}
