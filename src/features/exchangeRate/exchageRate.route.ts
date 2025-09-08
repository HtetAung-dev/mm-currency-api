import { FastifyInstance } from 'fastify'
import { updateRate, convert } from './exchangeRate.handler'

export default async function exchangeRoutes(app: FastifyInstance) {
  app.post('/exchange-rate', updateRate)
  app.get('/convert', convert)
}
