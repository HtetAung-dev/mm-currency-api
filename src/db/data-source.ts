import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Currency } from '../features/currency/currency.entity'
import { ExchangeRate } from '../features/exchangeRate/exchangeRate.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '192.168.0.221',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'amuze_user',
  password: process.env.DB_PASS || 'amuzedb123',
  database: process.env.DB_NAME || 'currency_exchangedb',
  synchronize: true, // ❌ use migrations in prod
  logging: true,
  entities: [Currency, ExchangeRate],
})
