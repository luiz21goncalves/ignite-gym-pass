import { FastifyInstance } from 'fastify'

import { authenticate } from './controllers/authenticate'
import { registerUser } from './controllers/register-user'
import { userProfile } from './controllers/user-profile'
import { verifyJwt } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticate)

  app.get('/me', { onRequest: [verifyJwt] }, userProfile)
}
