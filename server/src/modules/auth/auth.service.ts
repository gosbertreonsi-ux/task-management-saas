import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../../config/database";
import { env } from "../../config/env";

import {
  RegisterInput,
  LoginInput
} from "./auth.types";

// REGISTER

export const registerUser = async (
  data: RegisterInput
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  const memberRole = await prisma.role.findUnique({
    where: {
      name: "MEMBER"
    }
  });

  if (!memberRole) {
    throw new Error(
      "MEMBER role does not exist. Run the database seed."
    );
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roleId: memberRole.id
    },

    include: {
      role: true
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    createdAt: user.createdAt
  };
};

// LOGIN

export const loginUser = async (
  data: LoginInput
) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    },

    include: {
      role: true
    }
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role.name
    },

    env.JWT_SECRET,

    {
      expiresIn: env.JWT_EXPIRES_IN
    } as jwt.SignOptions
  );

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name
    }
  };
};