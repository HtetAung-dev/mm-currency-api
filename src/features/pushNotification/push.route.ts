import { FastifyInstance } from "fastify";
import { sendPushNotification } from "./push.service";

export default async function pushRoutes(app: FastifyInstance) {
  app.post("/send", async (req, reply) => {
    const { pushToken, title, body, data } = req.body as {
      pushToken: string;
      title: string;
      body: string;
      data?: Record<string, any>;
    };

    try {
      const ticket = await sendPushNotification(pushToken, title, body, data);
      return reply.send({ success: true, ticket });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: (err as Error).message });
    }
  });
}
