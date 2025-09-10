import { FastifyInstance } from "fastify";
import {
  addGoldRate,
  updateGoldRate,
  listGoldRates,
  deleteGoldRate,
} from "./goldRate.handler";

export default async function goldRateRoutes(app: FastifyInstance) {
  app.post("/create", addGoldRate);
  app.put("/update/:id", updateGoldRate);
  app.get("/list", listGoldRates);
  app.delete("/delete", deleteGoldRate);
}
