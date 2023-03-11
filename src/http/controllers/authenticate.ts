import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

export async function authenticate(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  const usersRepository = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(usersRepository)

  try {
    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return replay.status(400).send({ message: error.message })
    }

    throw error
  }

  return replay.status(200).send()
}
