import { FastifyInstance } from 'fastify'

import { registerUser } from './controllers/register-user'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
}
