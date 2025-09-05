import { FastifyInstance } from 'fastify'
import { addCurrency, listCurrencies } from './currency.handler'

export default async function currencyRoutes(app: FastifyInstance) {
  app.post('/currencies', addCurrency)
  app.get('/currencies', listCurrencies)
}
