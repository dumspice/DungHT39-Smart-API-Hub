import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError, ZodObject } from "zod/v3";
import { resourceSchemas } from "../schema/resource.schema";
import { formatZodError } from "../schema/auth.schema";

export const validateRequest =
  (schema?: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const method = req.method;

    let finalSchema = schema;

    if (!finalSchema) {
      const resource = req.params.resource;
      if (typeof resource === "string" && resource in resourceSchemas) {
        finalSchema = resourceSchemas[resource as keyof typeof resourceSchemas];
      }
    }

    if (!finalSchema) return next();

    try {
      let parsed;

      if (method === "POST") {
        parsed = finalSchema.parse(req.body);
      } else if (method === "PUT" || method === "PATCH") {
        parsed = finalSchema.partial().parse(req.body);
      } else {
        return next();
      }

      req.body = parsed;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: formatZodError
            ? formatZodError(error)
            : error.errors.map((e) => ({
                path: e.path.join("."),
                message: e.message,
              })),
        });
      }
      next(error);
    }
  };
