import { buildApp } from './app'
import { env } from './env'

const app = await buildApp({ logger: true })

await app.listen({ port: env.PORT, host: '0.0.0.0' })

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, async () => {
    await app.close()
    process.exit(0)
  })
}
