import { Request, Response } from "express";

import {
  registerUser,
  loginUser
} from "./auth.service";

import {
  registerSchema,
  loginSchema
} from "./auth.validation";

// REGISTER

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    return res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Registration failed"
    });
  }
};

// LOGIN

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data);

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Login failed"
    });
  }
};