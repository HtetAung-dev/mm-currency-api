import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Currency } from '../features/currency/currency.entity'
import { ExchangeRate } from '../features/exchangeRate/exchangeRate.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'currencydb',
  synchronize: true, // ❌ use migrations in prod
  logging: false,
  entities: [Currency, ExchangeRate],
})
