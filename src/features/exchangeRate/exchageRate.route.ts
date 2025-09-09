import { FastifyInstance } from 'fastify'
import { updateRate, convert, getRate, getRateByFromId } from './exchangeRate.handler'

export default async function exchangeRoutes(app: FastifyInstance) {
  app.post('/exchange-rate', updateRate)
  app.get('/convert', convert)
  app.get('/rate', getRate)
  app.get('/rate-by-id', getRateByFromId)
}
