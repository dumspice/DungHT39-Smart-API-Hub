import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { logger } from "../utils/logger";

export const globalHandleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status: number = err.statusCode || 500;
  let message: string = err.message || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        status = 400;
        message = `Duplicate data (duplicate field ${err.meta?.target})`;
        break;

      case "P2025":
        status = 404;
        message = "Not found record";
        break;

      case "P2003":
        status = 400;
        message = "Data Link Error (Foreign key constraint failed)";
        break;
    }
  }

  logger.error("API Error", {
    method: req.method,
    url: req.originalUrl,
    status,
    message,
    stack: err.stack,
  });

  res.status(status).json({
    error: message,
  });
};
