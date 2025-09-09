import { FastifyReply, FastifyRequest } from "fastify";
import { ExchangeRateService } from "./exchangeRate.service";
import { BadRequestError } from "../../utils/errors";

const service = new ExchangeRateService();

export const createRate = async (req: FastifyRequest, reply: FastifyReply) => {
  const { fromId, rate, buyRate, sellRate } = req.body as {
    fromId?: number;
    rate?: number;
    buyRate?: number;
    sellRate?: number;
  };

  if (
    typeof fromId !== "number" ||
    typeof rate !== "number" ||
    typeof buyRate !== "number" ||
    typeof sellRate !== "number" ||
    !Number.isFinite(rate) ||
    rate <= 0
  ) {
    throw new BadRequestError(
      "fromId, rate, buyRate, and sellRate must be numbers and rate must be positive"
    );
  }

  // Simply create a new rate for the given currency
  const result = await service.createRate(fromId, rate, buyRate, sellRate);
  reply.status(201).send(result);
};

export const updateRate = async (req: FastifyRequest, reply: FastifyReply) => {
  const { fromId, rate, buyRate, sellRate } = req.body as {
    fromId?: number;
    rate?: number;
    buyRate?: number;
    sellRate?: number;
  };

  if (
    typeof fromId !== "number" ||
    typeof rate !== "number" ||
    typeof buyRate !== "number" ||
    typeof sellRate !== "number" ||
    !Number.isFinite(rate) ||
    rate <= 0
  ) {
    throw new BadRequestError(
      "fromId, rate, buyRate, and sellRate must be numbers and rate must be positive"
    );
  }

  const result = await service.setRate(fromId, rate, buyRate, sellRate);
  reply.send(result);
};

export const getRateByFromId = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { fromId } = req.query as { fromId?: string };
  if (!fromId || isNaN(Number(fromId))) {
    throw new BadRequestError("fromId must be a valid number");
  }
  const result = await service.getRateByFromId(Number(fromId));
  reply.send(result);
};

export const getRatesWithCurrency = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { fromId } = req.query as { fromId?: string };

  if (!fromId || isNaN(Number(fromId))) {
    throw new BadRequestError("fromId must be a valid number");
  }

  const result = await service.getRatesWithCurrency(Number(fromId));
  reply.send(result);
};

export const getRates = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await service.getRates();
  reply.send(result);
};

export const deleteRate = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.query as { id?: string };
  if (!id || isNaN(Number(id))) {
    throw new BadRequestError("id must be a valid number");
  }

  const result = await service.deleteRate(Number(id));
  reply.send(result);
};
