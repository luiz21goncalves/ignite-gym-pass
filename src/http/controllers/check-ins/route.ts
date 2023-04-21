import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { checkInHistory } from './check-in-history'
import { createCheckIn } from './create-check-in'
import { metricsCheckIn } from './metrics-check-ins'
import { validateCheckIn } from './validate-check-in'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', checkInHistory)
  app.get('/check-ins/metrics', metricsCheckIn)
  app.post('/gyms/:gymId/check-ins', createCheckIn)
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validateCheckIn,
  )
}
