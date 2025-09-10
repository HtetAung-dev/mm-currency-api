import "reflect-metadata";
import { DataSource } from "typeorm";
import { Currency } from "../features/currency/currency.entity";
import { ExchangeRate } from "../features/exchangeRate/exchangeRate.entity";
import * as dotenv from "dotenv";
import { GoldRate } from "../features/goldRate/goldRate.entity";

dotenv.config();

console.log("db", process.env.DB_HOST);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // ❌ use migrations in prod
  logging: true,
  entities: [Currency, ExchangeRate, GoldRate],
});
