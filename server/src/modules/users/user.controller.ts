import {
  Request,
  Response,
} from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.service";

import {
  updateUserSchema,
  userIdSchema,
} from "./user.validation";

export const getAllUsers = async (
  _req: Request,
  res: Response
) => {
  try {
    const users =
      await getUsers();

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to fetch users",
    });
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } =
      userIdSchema.parse(
        req.params
      );

    if (
      req.user?.role !== "ADMIN" &&
      req.user?.id !== id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const user =
      await getUserById(id);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch user",
    });
  }
};

export const updateSingleUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } =
      userIdSchema.parse(
        req.params
      );

    if (
      req.user?.role !== "ADMIN" &&
      req.user?.id !== id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const data =
      updateUserSchema.parse(
        req.body
      );

    if (
      req.user?.role !== "ADMIN" &&
      data.role !== undefined
    ) {
      return res.status(403).json({
        message:
          "Only ADMIN users can change roles",
      });
    }

    const user =
      await updateUser(
        id,
        data
      );

    return res.status(200).json({
      message:
        "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user",
    });
  }
};

export const removeUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } =
      userIdSchema.parse(
        req.params
      );

    const result =
      await deleteUser(id);

    return res.status(200).json(
      result
    );
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete user",
    });
  }
};