import { AppDataSource } from '../../db/data-source'
import { Currency } from './currency.entity'
import { BadRequestError, ConflictError } from '../../utils/errors'

export class CurrencyService {
  private repo = AppDataSource.getRepository(Currency)

  async create(code: string, name: string) {
    const normalizedCode = code.trim().toUpperCase()
    const normalizedName = name.trim()
    if (!normalizedCode || !normalizedName) {
      throw new BadRequestError('code and name must be non-empty strings')
    }
    const existing = await this.repo.findOne({ where: { code: normalizedCode } })
    if (existing) {
      throw new ConflictError('Currency code already exists')
    }
    const currency = this.repo.create({ code: normalizedCode, name: normalizedName })
    return this.repo.save(currency)
  }

  async list() {
    return this.repo.find()
  }
}
