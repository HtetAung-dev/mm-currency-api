import { FastifyReply, FastifyRequest } from 'fastify'
import { ExchangeRateService } from './exchangeRate.service'
import { BadRequestError } from '../../utils/errors'

const service = new ExchangeRateService()

export const updateRate = async (req: FastifyRequest, reply: FastifyReply) => {
  const { fromId, toId, rate } = req.body as { fromId?: number; toId?: number; rate?: number }
  if (
    typeof fromId !== 'number' ||
    typeof toId !== 'number' ||
    typeof rate !== 'number' ||
    !Number.isFinite(rate) ||
    rate <= 0
  ) {
    throw new BadRequestError('fromId, toId must be numbers and rate must be a positive number')
  }
  const result = await service.setRate(fromId, toId, rate)
  reply.send(result)
}

export const convert = async (req: FastifyRequest, reply: FastifyReply) => {
  const { fromId, toId, amount } = req.query as {
    fromId?: number
    toId?: number
    amount?: number
  }
  if (
    typeof fromId !== 'number' ||
    typeof toId !== 'number' ||
    typeof amount !== 'number' ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new BadRequestError('fromId, toId and amount must be positive numbers')
  }
  const result = await service.convert(fromId, toId, amount)
  reply.send(result)
}
