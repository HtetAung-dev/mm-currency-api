import { AppDataSource } from '../../db/data-source'
import { Currency } from './currency.entity'

export class CurrencyService {
  private repo = AppDataSource.getRepository(Currency)

  async create(code: string, name: string) {
    const currency = this.repo.create({ code, name })
    return this.repo.save(currency)
  }

  async list() {
    return this.repo.find()
  }
}
