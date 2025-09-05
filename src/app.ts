import Fastify from 'fastify'
import cors from '@fastify/cors'
import currencyRoutes from './features/currency/currency.route'
import { AppDataSource } from './db/data-source'

export async function buildApp() {
  const app = Fastify({ logger: true })
  await app.register(cors)

  await AppDataSource.initialize()

  app.register(currencyRoutes)

  return app
}
