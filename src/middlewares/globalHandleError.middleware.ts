import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export const globalHandleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

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

  console.error(`[ERROR] ${req.method} ${req.path}: `, err);

  res.status(status).json({
    error: message,
  });
};
