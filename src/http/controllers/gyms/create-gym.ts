import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCrateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function createGym(request: FastifyRequest, replay: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { description, latitude, longitude, phone, title } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCrateGymUseCase()

  await createGymUseCase.execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  })

  return replay.status(201).send()
}
