import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { parseSelectField } from "../utils/parseSelectFields";
import { parseId } from "../utils/parseId";
import { buildPrismaQuery } from "../utils/buildQuery";

export const getResources = async (req: Request, res: Response) => {
  const resource = req.params.resource as string;
  const queryData: any = buildPrismaQuery(resource, req.query);

  const { prismaModelName, findArgs, countArgs } = queryData;
  const select = parseSelectField(req.query._fields);

  try {
    const model = (prisma as any)[prismaModelName];

    const [data, totalCount] = await Promise.all([
      model.findMany({ ...findArgs, select }),
      model.count(countArgs),
    ]);

    res.setHeader("X-Total-Count", totalCount);
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getResourceById = async (req: Request, res: Response) => {
  const resource = req.params.resource as string;
  const id = req.params.id as string;
  const select = parseSelectField(req.query._fields);

  try {
    const data = await (prisma as any)[resource].findUnique({
      where: { id: parseId(id) },
      data: select,
    });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createResource = async (req: Request, res: Response) => {
  const resource = req.params.resource as string;
  const body = req.body;

  try {
    const data = await (prisma as any)[resource].create({
      data: body,
    });
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateResource = async (req: Request, res: Response) => {
  const resource = req.params.resource as string;
  const id = req.params.id as string;
  const body = req.body;

  try {
    const data = await (prisma as any)[resource].update({
      where: { id: parseId(id) },
      data: body,
    });
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  const resource = req.params.resource as string;
  const id = req.params.id as string;

  try {
    await (prisma as any)[resource].delete({
      where: { id: parseId(id) },
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
