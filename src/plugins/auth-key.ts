import fp from 'fastify-plugin'
import { FastifyReply, FastifyRequest } from 'fastify'

export default fp(async (app) => {
  app.addHook('onRequest', async (req: FastifyRequest, reply: FastifyReply) => {
    const apiKey = req.headers['x-api-key']

    if (!apiKey || apiKey !== process.env.API_KEY) {
      reply.code(401).send({ error: 'Unauthorized: Invalid API key' })
    }
  })
})
