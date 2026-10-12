import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import { env } from "../config/env";

import type { AuthUser } from "../types/express";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const parts =
      authorization.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer" ||
      !parts[1]
    ) {
      return res.status(401).json({
        message:
          "Invalid authorization header format",
      });
    }

    const token = parts[1];

    const decoded =
      jwt.verify(
        token,
        env.JWT_SECRET
      ) as AuthUser;

    if (
      !decoded.id ||
      !decoded.email ||
      !decoded.role
    ) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return res.status(401).json({
      message:
        "Invalid or expired token",
    });
  }
};