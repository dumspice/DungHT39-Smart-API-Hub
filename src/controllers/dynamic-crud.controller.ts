import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { parseSelectField } from "../utils/parseSelectFields";
import { parseId } from "../utils/parseId";
import { buildPrismaQuery } from "../utils/buildQuery";
import { asyncHandler } from "../utils/asyncHandler";

export const getResources = asyncHandler(
  async (req: Request, res: Response) => {
    const resource = req.params.resource as string;
    const queryData: any = buildPrismaQuery(resource, req.query);

    const { prismaModelName, findArgs, countArgs } = queryData;
    const select = parseSelectField(req.query._fields);

    const model = (prisma as any)[prismaModelName];

    const [data, totalCount] = await Promise.all([
      model.findMany({ ...findArgs, select }),
      model.count(countArgs),
    ]);

    res.setHeader("X-Total-Count", totalCount);
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json(data);
  },
);

export const getResourceById = asyncHandler(
  async (req: Request, res: Response) => {
    const resource = req.params.resource as string;
    const id = req.params.id as string;
    const select = parseSelectField(req.query._fields);

    const data = await (prisma as any)[resource].findUniqueOrThrow({
      where: { id: parseId(id) },
      select,
    });

    res.json(data);
  },
);

export const createResource = asyncHandler(
  async (req: Request, res: Response) => {
    const resource = req.params.resource as string;
    const body = req.body;

    const data = await (prisma as any)[resource].create({
      data: body,
    });
    res.status(201).json(data);
  },
);

export const updateResource = asyncHandler(
  async (req: Request, res: Response) => {
    const resource = req.params.resource as string;
    const id = req.params.id as string;
    const body = req.body;

    const data = await (prisma as any)[resource].update({
      where: { id: parseId(id) },
      data: body,
    });
    res.json(data);
  },
);

export const deleteResource = asyncHandler(
  async (req: Request, res: Response) => {
    const resource = req.params.resource as string;
    const id = req.params.id as string;

    await (prisma as any)[resource].delete({
      where: { id: parseId(id) },
    });
    res.status(204).send();
  },
);
