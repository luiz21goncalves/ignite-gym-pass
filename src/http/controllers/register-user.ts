import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserUseCase } from '@/use-cases/register-user'

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

  const prismaUsersRepository = new PrismaUsersRepository()
  const registerUserUseCase = new RegisterUserUseCase(prismaUsersRepository)

  try {
    await registerUserUseCase.execute({
      email,
      name,
      password,
    })
  } catch {
    return replay.status(409).send()
  }

  return replay.status(201).send()
}
