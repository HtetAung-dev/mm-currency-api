import { FastifyReply, FastifyRequest } from "fastify";
import { GoldRateService } from "./goldRate.service";
import { BadRequestError } from "../../utils/errors";

const service = new GoldRateService();

export const addGoldRate = async (req: FastifyRequest, reply: FastifyReply) => {
  const { name, rate, buyRate, sellRate } = req.body as {
    name: string;
    rate: number;
    buyRate: number;
    sellRate: number;
  };

  // Validate required fields
  if (!name || rate == null) {
    throw new BadRequestError("name and rate are required");
  }

  const goldRate = await service.create(name.trim(), rate, buyRate, sellRate);

  reply.code(201).send(goldRate);
};

export const listGoldRates = async (
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  const goldRates = await service.list();
  reply.send(goldRates);
};

export const updateGoldRate = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id?: string };
  if (!id || isNaN(Number(id))) {
    throw new BadRequestError("id must be a valid number");
  }

  const { name, rate, buyRate, sellRate } = req.body as Partial<{
    name: string;
    rate: number;
    buyRate: number;
    sellRate: number;
  }>;

  const updatedGoldRate = await service.update(Number(id), {
    name: name?.trim(),
    rate,
    buyRate,
    sellRate,
  });

  reply.send(updatedGoldRate);
};

export const deleteGoldRate = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.query as { id?: string };
  if (!id || isNaN(Number(id))) {
    throw new BadRequestError("id must be a valid number");
  }

  const result = await service.delete(Number(id));
  reply.send(result);
};
