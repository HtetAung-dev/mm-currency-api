import { FastifyReply, FastifyRequest } from "fastify";
import { CurrencyService } from "./currency.service";
import { BadRequestError } from "../../utils/errors";

const service = new CurrencyService();

export const addCurrency = async (req: FastifyRequest, reply: FastifyReply) => {
  let fileBuffer: string | null = null;
  let code: string | undefined;
  let name: string | undefined;

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
      if (part.fieldname === "code") code = part.value;
      if (part.fieldname === "name") name = part.value;
    }
  }

  // Validate required fields
  if (!code || !name) throw new BadRequestError("code and name are required");

  // Create currency
  const currency = await service.create(code.trim(), name.trim(), fileBuffer);
  reply.code(201).send(currency);
};

export const listCurrencies = async (
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  const currencies = await service.list();
  reply.send(currencies);
};

export const deleteCurrency = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.query as { id?: string };
  if (!id || isNaN(Number(id))) {
    throw new BadRequestError("id must be a valid number");
  }

  const result = await service.deleteCurrency(Number(id));
  reply.send(result);
};
