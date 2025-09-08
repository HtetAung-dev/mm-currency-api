import { AppDataSource } from '../../db/data-source'
import { ExchangeRate } from './exchangeRate.entity'
import { Currency } from '../currency/currency.entity'
import { BadRequestError, NotFoundError } from '../../utils/errors'

export class ExchangeRateService {
  private repo = AppDataSource.getRepository(ExchangeRate)
  private currencyRepo = AppDataSource.getRepository(Currency)

  async setRate(fromId: number, toId: number, rate: number) {
    if (fromId === toId) {
      throw new BadRequestError('fromId and toId must be different')
    }
    const fromCurrency = await this.currencyRepo.findOneBy({ id: fromId })
    const toCurrency = await this.currencyRepo.findOneBy({ id: toId })
    if (!fromCurrency || !toCurrency) throw new NotFoundError('Currency not found')

    let exchangeRate = await this.repo.findOne({ where: { fromCurrency, toCurrency } })
    if (!exchangeRate) {
      exchangeRate = this.repo.create({ fromCurrency, toCurrency, rate })
    } else {
      exchangeRate.rate = rate
      exchangeRate.updatedAt = new Date()
    }
    return this.repo.save(exchangeRate)
  }

  async convert(fromId: number, toId: number, amount: number) {
    const rate = await this.repo.findOne({
      where: { fromCurrency: { id: fromId }, toCurrency: { id: toId } },
      relations: ['fromCurrency', 'toCurrency'],
    })
    if (!rate) throw new NotFoundError('Exchange rate not found')
    return { amount, converted: amount * rate.rate }
  }
}
