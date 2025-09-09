import { AppDataSource } from "../../db/data-source";
import { ExchangeRate } from "./exchangeRate.entity";
import { Currency } from "../currency/currency.entity";
import { BadRequestError, NotFoundError } from "../../utils/errors";

export class ExchangeRateService {
  private repo = AppDataSource.getRepository(ExchangeRate);
  private currencyRepo = AppDataSource.getRepository(Currency);

  async setRate(
    fromId: number,
    rate: number,
    buyRate: number,
    sellRate: number
  ) {
    const fromCurrency = await this.currencyRepo.findOneBy({ id: fromId });
    if (!fromCurrency) throw new NotFoundError("Currency not found");

    let exchangeRate = await this.repo.findOne({
      where: { fromCurrency },
      relations: ["fromCurrency"],
    });

    let change = 0;

    if (!exchangeRate) {
      exchangeRate = this.repo.create({
        fromCurrency,
        rate,
        buyRate,
        sellRate,
        changeValue: 0,
        updatedAt: new Date(),
      });
    } else {
      const oldAverage =
        ((exchangeRate.buyRate || 0) + (exchangeRate.sellRate || 0)) / 2;
      const newAverage = (buyRate + sellRate) / 2;
      change = parseFloat((newAverage - oldAverage).toFixed(3));

      exchangeRate.rate = rate;
      exchangeRate.buyRate = buyRate;
      exchangeRate.sellRate = sellRate;
      exchangeRate.updatedAt = new Date();
    }

    return this.repo.save(exchangeRate);
  }

  async getRate(fromId: number) {
    const rate = await this.repo.findOne({
      where: { fromCurrency: { id: fromId } },
      relations: ["fromCurrency"],
    });
    if (!rate) throw new NotFoundError("Exchange rate not found");

    return {
      id: rate.id,
      currency_id: rate.fromCurrency.id,
      rate: rate.rate,
      buyRate: rate.buyRate,
      sellRate: rate.sellRate,
      changeValue: rate.changeValue,
      updatedAt: rate.updatedAt,
    };
  }

  async createRate(
    fromId: number,
    rate: number,
    buyRate: number,
    sellRate: number
  ) {
    const fromCurrency = await this.currencyRepo.findOneBy({ id: fromId });
    if (!fromCurrency) {
      throw new NotFoundError("Currency not found");
    }

    const latestRate = await this.repo.findOne({
      where: { fromCurrency },
      order: { updatedAt: "DESC" },
    });

    let change = 0;

    if (latestRate) {
      const oldAverage =
        ((latestRate.buyRate || 0) + (latestRate.sellRate || 0)) / 2;
      const newAverage = (buyRate + sellRate) / 2;
      change = parseFloat((newAverage - oldAverage).toFixed(3));
    }

    // Always create a new exchange rate
    const exchangeRate = this.repo.create({
      fromCurrency,
      rate,
      buyRate,
      sellRate,
      changeValue: change,
      updatedAt: new Date(),
    });

    return this.repo.save(exchangeRate);
  }

  async getRateByFromId(fromId: number) {
    const rates = await this.repo.find({
      where: { fromCurrency: { id: fromId } },
      relations: ["fromCurrency", "toCurrency"],
    });
    if (!rates || rates.length === 0) {
      throw new NotFoundError("No exchange rates found for the given fromId");
    }
    return rates;
  }

  async getRatesWithCurrency(fromId: number) {
    const rates = await this.repo.find({
      where: { fromCurrency: { id: fromId } },
      relations: ["fromCurrency"],
    });

    if (!rates || rates.length === 0) {
      throw new NotFoundError("No exchange rates found for the given fromId");
    }

    return rates.map((rate) => ({
      id: rate.id,
      rate: rate.rate,
      currency_id: rate.fromCurrency.id,
      buyRate: rate.buyRate,
      sellRate: rate.sellRate,
      changeValue: rate.changeValue,
      updatedAt: rate.updatedAt,
    }));
  }

  async getRates() {
    const rates = await this.repo.find({
      where: { fromCurrency: {} },
      relations: ["fromCurrency"],
    });

    if (!rates || rates.length === 0) {
      throw new NotFoundError("No exchange rates found for the given fromId");
    }

    return rates.map((rate) => ({
      id: rate.id,
      rate: rate.rate,
      currency_id: rate.fromCurrency.id,
      buyRate: rate.buyRate,
      sellRate: rate.sellRate,
      changeValue: rate.changeValue,
      updatedAt: rate.updatedAt,
    }));
  }

  async deleteRate(id: number) {
    const rate = await this.repo.findOneBy({ id });
    if (!rate) throw new NotFoundError("Exchange rate not found");

    await this.repo.remove(rate);
    return { message: "Exchange rate deleted successfully" };
  }
}
