import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'

import { authenticate } from './authenticate'
import { registerUser } from './register-user'
import { userProfile } from './user-profile'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticate)

  app.get('/me', { onRequest: [verifyJwt] }, userProfile)
}
