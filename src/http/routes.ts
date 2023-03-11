import { FastifyInstance } from 'fastify'

import { authenticate } from './controllers/authenticate'
import { registerUser } from './controllers/register-user'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticate)
}
