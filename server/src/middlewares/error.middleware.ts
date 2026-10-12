import {
  Request,
  Response,
  NextFunction,
} from "express";

import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { AppError } from "../utils/errors";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.issues.map(
        (issue) => ({
          field:
            issue.path.join("."),
          message: issue.message,
        })
      ),
    });
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError
  ) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message:
          "A record with this value already exists",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message:
          "Requested record was not found",
      });
    }
  }

  if (error instanceof AppError) {
    return res.status(
      error.statusCode
    ).json({
      message: error.message,
    });
  }

  if (error instanceof Error) {
    return res.status(500).json({
      message:
        "Internal server error",
    });
  }

  return res.status(500).json({
    message:
      "Internal server error",
  });
};