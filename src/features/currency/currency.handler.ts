import { FastifyReply, FastifyRequest } from 'fastify'
import { CurrencyService } from './currency.service'
import { BadRequestError } from '../../utils/errors'

const service = new CurrencyService()

export const addCurrency = async (req: FastifyRequest, reply: FastifyReply) => {
  const { code, name } = req.body as { code?: string; name?: string }
  if (!code || !name) {
    throw new BadRequestError('code and name are required')
  }
  const currency = await service.create(code, name)
  reply.send(currency)
}

export const listCurrencies = async (_req: FastifyRequest, reply: FastifyReply) => {
  const currencies = await service.list()
  reply.send(currencies)
}
