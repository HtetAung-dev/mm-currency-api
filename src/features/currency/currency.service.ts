import { AppDataSource } from "../../db/data-source";
import { Currency } from "./currency.entity";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/errors";

export class CurrencyService {
  private repo = AppDataSource.getRepository(Currency);

  async create(code: string, name: string, buffer: string | null) {
    const normalizedCode = code.trim().toUpperCase();
    const normalizedName = name.trim();
    if (!normalizedCode || !normalizedName) {
      throw new BadRequestError("code and name must be non-empty strings");
    }
    const existing = await this.repo.findOne({
      where: { code: normalizedCode },
    });

    console.log("buffer - --- - - -", buffer);
    if (existing) {
      throw new ConflictError("Currency code already exists");
    }
    const currency = this.repo.create({
      code: normalizedCode,
      name: normalizedName,
      imageUrl: buffer,
    });
    return this.repo.save(currency);
  }

  async list() {
    const result = this.repo.find();
    return result;
  }

  async deleteCurrency(id: number) {
    const rate = await this.repo.findOneBy({ id });
    if (!rate) throw new NotFoundError("Exchange rate not found");

    await this.repo.remove(rate);
    return { message: "Exchange rate deleted successfully" };
  }
}
