import { AppDataSource } from "../../db/data-source";
import { Blog } from "./blog.entity";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/errors";

export class BlogService {
  private repo = AppDataSource.getRepository(Blog);

  async create(name: string, description: string, buffer: string | null) {
    const normalizedCode = name.trim().toUpperCase();
    const normalizedName = description.trim();
    if (!normalizedCode || !normalizedName) {
      throw new BadRequestError("code and name must be non-empty strings");
    }
    const blog = this.repo.create({
      name: normalizedCode,
      description: normalizedName,
      imageUrl: buffer,
    });
    return this.repo.save(blog);
  }

  async list() {
    return this.repo.find({
      order: { updatedAt: "DESC" },
    });
  }

  async update(
    id: number,
    name: string,
    description: string,
    buffer: string | null
  ) {
    const blog = await this.repo.findOneBy({ id });
    if (!blog) {
      throw new NotFoundError("Blog ID not found");
    }

    const normalizedCode = name.trim().toUpperCase();
    const normalizedName = description.trim();
    if (!normalizedCode || !normalizedName) {
      throw new BadRequestError("code and name must be non-empty strings");
    }

    blog.name = normalizedCode;
    blog.description = normalizedName;

    if (buffer) {
      blog.imageUrl = buffer;
    }

    return this.repo.save(blog);
  }

  async delete(id: number) {
    const blog = await this.repo.findOneBy({ id });
    if (!blog) {
      throw new NotFoundError("Blog ID not found");
    }

    await this.repo.remove(blog);
    return { message: "Blog deleted successfully" };
  }
}
