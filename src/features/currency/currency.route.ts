import { FastifyInstance } from "fastify";
import {
  addCurrency,
  listCurrencies,
  deleteCurrency,
} from "./currency.handler";

export default async function currencyRoutes(app: FastifyInstance) {
  app.post("/", addCurrency);
  app.get("/", listCurrencies);
  app.delete("/delete", deleteCurrency);
}
