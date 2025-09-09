import Fastify from "fastify";
import cors from "@fastify/cors";
import currencyRoutes from "./features/currency/currency.route";
import { AppDataSource } from "./db/data-source";
import exchangeRoutes from "./features/exchangeRate/exchageRate.route";
import { AppError, toResponse } from "./utils/errors";
import fastifyMultipart from "@fastify/multipart";

export async function buildApp() {
  const app = Fastify({ logger: true });
  await app.register(cors);

  try {
    await AppDataSource.initialize();
  } catch (err) {
    app.log.error({ err }, "Failed to initialize data source");
    throw err;
  }

  app.register(currencyRoutes, { prefix: "/currency" });
  app.register(exchangeRoutes, { prefix: "/exchange" });

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 1,
    },
  });

  app.setErrorHandler((error, _request, reply) => {
    const { statusCode, body } = toResponse(error);
    app.log.error(error);
    reply.code(statusCode).send(body);
  });

  app.setNotFoundHandler((request, reply) => {
    const err = new AppError(
      `Route ${request.method} ${request.url} not found`,
      404
    );
    const { statusCode, body } = toResponse(err);
    reply.code(statusCode).send(body);
  });

  return app;
}
