import { FastifyInstance } from "fastify";
import {
  updateRate,
  getRateByFromId,
  getRatesWithCurrency,
  getRates,
  createRate,
  deleteRate,
} from "./exchangeRate.handler";

export default async function exchangeRoutes(app: FastifyInstance) {
  app.post("/create", createRate);
  app.post("/exchange-rate", updateRate);
  app.get("/rate-by-id", getRateByFromId);
  app.get("/rate", getRates);
  app.get("/rates-with-currency", getRatesWithCurrency);
  app.delete("/delete", deleteRate);
}
