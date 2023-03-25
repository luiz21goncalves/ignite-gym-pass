import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'

import { createGym } from './create-gym'
import { nearbyGyms } from './nearby-gyms'
import { searchGyms } from './search-gyms'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', createGym)
  app.get('/gyms/search', searchGyms)
  app.get('/gyms/nearby', nearbyGyms)
}
