import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number(),
  HASH_ROUNDS: z.coerce.number(),
  JWT_SECRET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables.', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const ENV = _env.data
