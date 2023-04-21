import { FastifyRequest, FastifyReply } from 'fastify'

import { ENV } from '@/env'
export async function refresh(request: FastifyRequest, replay: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const userId = request.user.sub
  const role = request.user.role

  const token = await replay.jwtSign({ role }, { sign: { sub: userId } })

  const refreshToken = await replay.jwtSign(
    { role },
    { sign: { sub: userId, expiresIn: ENV.JWT_REFRESH_EXPIRES_IN } },
  )

  return replay
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
