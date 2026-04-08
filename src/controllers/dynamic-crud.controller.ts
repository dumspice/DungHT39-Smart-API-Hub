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

    // Get fields
    const select = parseSelectField(req.query._fields);

    const model = (prisma as any)[prismaModelName];

    let finalFindArgs = { ...findArgs };

    if (select) {
      // If select fields exists, assign relations into select
      if (finalFindArgs.include) {
        finalFindArgs.select = { ...select, ...finalFindArgs.include };
        delete finalFindArgs.include;
      } else {
        finalFindArgs.select = select;
      }
    }

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
    const user = (req as any).user;

    // Ownership Enforcement:
    // If resource is not 'users' and has a 'userId' field in body (or schema)
    // and user is not admin, force userId to be the authenticated user's id.
    if (user && user.role !== "admin") {
      // Check if schema defines userId for this resource
      const schemaPath = require("path").join(process.cwd(), "schema.json");
      const schema = require("fs").readFileSync(schemaPath, "utf-8");
      const tableSchema = JSON.parse(schema).tables[resource];

      if (tableSchema && tableSchema.userId) {
        body.userId = user.id;
      }
    }

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
    const user = (req as any).user;

    const where: any = { id: parseId(id) };

    // Ownership Enforcement:
    // Non-admins can only update their own records if the resource has a userId field.
    if (user && user.role !== "admin") {
      const schemaPath = require("path").join(process.cwd(), "schema.json");
      const schema = require("fs").readFileSync(schemaPath, "utf-8");
      const tableSchema = JSON.parse(schema).tables[resource];

      if (tableSchema && tableSchema.userId) {
        where.userId = user.id;
      }
    }

    const data = await (prisma as any)[resource].update({
      where,
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
