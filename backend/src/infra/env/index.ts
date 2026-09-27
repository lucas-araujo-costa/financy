import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3333),
  JWT_SECRET: z.string().min(1, 'Defina JWT_SECRET no .env'),
  DATABASE_URL: z.string().min(1, 'Defina DATABASE_URL no .env'),
  CORS_ORIGIN: z.url('CORS_ORIGIN deve ser a URL do frontend'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:')
  console.error(z.prettifyError(parsed.error))

  throw new Error('Variáveis de ambiente inválidas.')
}

export const env = parsed.data
