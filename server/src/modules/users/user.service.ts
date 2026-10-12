import bcrypt from "bcrypt";

import prisma from "../../config/database";

import type {
  UpdateUserInput,
} from "./user.types";

export const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,

      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserById = async (
  id: number
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,

        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  return user;
};

export const updateUser = async (
  id: number,
  data: UpdateUserInput
) => {
  const existingUser =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!existingUser) {
    throw new Error(
      "User not found"
    );
  }

  const updateData: {
    name?: string;
    email?: string;
    password?: string;
    roleId?: number;
  } = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.password !== undefined) {
    updateData.password =
      await bcrypt.hash(
        data.password,
        10
      );
  }

  if (data.role !== undefined) {
    const role =
      await prisma.role.findUnique({
        where: {
          name: data.role,
        },
      });

    if (!role) {
      throw new Error(
        `Role ${data.role} does not exist`
      );
    }

    updateData.roleId = role.id;
  }

  return prisma.user.update({
    where: {
      id,
    },

    data: updateData,

    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,

      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const deleteUser = async (
  id: number
) => {
  const existingUser =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!existingUser) {
    throw new Error(
      "User not found"
    );
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  return {
    message:
      "User deleted successfully",
  };
};