import { FastifyReply, FastifyRequest } from "fastify";
import { BlogService } from "./blog.service";
import { BadRequestError } from "../../utils/errors";

const service = new BlogService();

export const addBlog = async (req: FastifyRequest, reply: FastifyReply) => {
  let fileBuffer: string | null = null;
  let name: string | undefined;
  let description: string | undefined;

  for await (const part of (req as any).parts()) {
    if (part.file) {
      // It's a file
      if (part.fieldname === "file") {
        const allowedTypes = [
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/webp",
        ];
        if (!allowedTypes.includes(part.mimetype)) {
          throw new BadRequestError(
            "Only PNG, JPEG, and WEBP images are allowed."
          );
        }
        const buffer = await part.toBuffer();
        fileBuffer = `data:${part.mimetype};base64,${buffer.toString(
          "base64"
        )}`;
      }
    } else if (part.value) {
      // It's a text field
      if (part.fieldname === "name") name = part.value;
      if (part.fieldname === "description") description = part.value;
    }
  }

  // Validate required fields
  if (!name || !description)
    throw new BadRequestError("code and name are required");

  // Create currency
  const blog = await service.create(
    name.trim(),
    description.trim(),
    fileBuffer
  );
  reply.code(201).send(blog);
};

export const listBlog = async (_req: FastifyRequest, reply: FastifyReply) => {
  const blogs = await service.list();
  reply.send(blogs);
};

export const updateBlog = async (req: FastifyRequest, reply: FastifyReply) => {
  let fileBuffer: string | null = null;
  let name: string | undefined;
  let description: string | undefined;
  let id: string | undefined;

  for await (const part of (req as any).parts()) {
    if (part.file) {
      // Handle file
      if (part.fieldname === "file") {
        const allowedTypes = [
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/webp",
        ];
        if (!allowedTypes.includes(part.mimetype)) {
          throw new BadRequestError(
            "Only PNG, JPEG, and WEBP images are allowed."
          );
        }
        const buffer = await part.toBuffer();
        fileBuffer = `data:${part.mimetype};base64,${buffer.toString(
          "base64"
        )}`;
      }
    } else if (part.value) {
      // Handle text fields
      if (part.fieldname === "id") id = part.value;
      if (part.fieldname === "name") name = part.value;
      if (part.fieldname === "description") description = part.value;
    }
  }

  if (!id || isNaN(Number(id))) {
    throw new BadRequestError("id must be a valid number");
  }
  if (!name || !description) {
    throw new BadRequestError("name and description are required");
  }

  const blog = await service.update(
    Number(id),
    name.trim(),
    description.trim(),
    fileBuffer
  );
  reply.send(blog);
};

export const deleteblog = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.query as { id?: string };
  if (!id || isNaN(Number(id))) {
    throw new BadRequestError("id must be a valid number");
  }

  const result = await service.delete(Number(id));
  reply.send(result);
};
