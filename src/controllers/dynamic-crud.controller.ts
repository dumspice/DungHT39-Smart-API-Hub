import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getResources = async (req: Request, res: Response) => {
  const resource = req.params.resource as string;
  const { _fields } = req.query;

  try {
    const selectFields = _fields
      ? (_fields as string).split(",").reduce((acc: any, field: string) => {
          acc[field.trim()] = true;
          return acc;
        }, {})
      : undefined;

    // Use Prisma's dynamic model access
    const data = await (prisma as any)[resource].findMany({
      select: selectFields,
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
  const id = req.params.id;
  const body = req.body;

  try {
    const data = await (prisma as any)[resource].update({
      where: { id: parseInt(id as string) },
      data: body,
    });
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  const resource = req.params.resource as string;
  const id = req.params.id;

  try {
    await (prisma as any)[resource].delete({
      where: { id: parseInt(id as string) },
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
