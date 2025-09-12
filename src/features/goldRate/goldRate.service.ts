import { AppDataSource } from "../../db/data-source";
import { GoldRate } from "./goldRate.entity";
import { BadRequestError, NotFoundError } from "../../utils/errors";

export class GoldRateService {
  private repo = AppDataSource.getRepository(GoldRate);

  async create(name: string, rate: number, buyRate: number, sellRate: number) {
    const normalizedName = name.trim();

    if (!normalizedName || rate == null) {
      throw new BadRequestError("name must be non-empty and rate is required");
    }

    const goldRate: GoldRate = this.repo.create({
      name: normalizedName!,
      rate: rate,
      buyRate: buyRate ?? null,
      sellRate: sellRate ?? null,
      changeValue: 0,
    });

    return this.repo.save(goldRate);
  }

  async list() {
    return this.repo.find({
      order: { updatedAt: "DESC" },
    });
  }

  async update(id: number, data: Partial<GoldRate>) {
    const goldRate = await this.repo.findOneBy({ id });
    if (!goldRate) {
      throw new NotFoundError("Gold rate not found");
    }

    // update changeValue if rate changes
    if (data.rate != null && data.rate !== goldRate.rate) {
      data.changeValue = data.rate - goldRate.rate;
    }

    Object.assign(goldRate, data);

    return this.repo.save(goldRate);
  }

  async delete(id: number) {
    const goldRate = await this.repo.findOneBy({ id });
    if (!goldRate) {
      throw new NotFoundError("Gold rate not found");
    }

    await this.repo.remove(goldRate);
    return { message: "Gold rate deleted successfully" };
  }
}
