import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { ENV } from './env'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: ENV.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymsRoutes)

app.setErrorHandler((error, _request, replay) => {
  if (error instanceof ZodError) {
    return replay
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (ENV.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool.
  }

  return replay.status(500).send({ message: 'Internal server error' })
})
