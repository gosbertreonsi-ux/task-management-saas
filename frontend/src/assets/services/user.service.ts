import api from "./api";

import type {
  UpdateUserInput,
  User,
} from "../types/user";

/*
|--------------------------------------------------------------------------
| Normalize User
|--------------------------------------------------------------------------
|
| The backend may return role as:
|
| "ADMIN"
|
| or:
|
| { id: 1, name: "ADMIN" }
|
| The frontend should always receive:
|
| role: "ADMIN" | "MEMBER"
|
|--------------------------------------------------------------------------
*/

const normalizeUser = (
  user: any
): User => {
  const role =
    typeof user.role === "string"
      ? user.role
      : user.role?.name;

  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
    role:
      role === "ADMIN"
        ? "ADMIN"
        : "MEMBER",
    createdAt:
      user.createdAt,
  };
};

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

export const getUsers =
  async (): Promise<User[]> => {
    const response =
      await api.get("/users");

    const users =
      response.data.users ??
      response.data;

    return users.map(
      (user: any) =>
        normalizeUser(user)
    );
  };

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

export const getUserById =
  async (
    id: number
  ): Promise<User> => {
    const response =
      await api.get(
        `/users/${id}`
      );

    const user =
      response.data.user ??
      response.data;

    return normalizeUser(user);
  };

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export const updateUser =
  async (
    id: number,
    data: UpdateUserInput
  ): Promise<User> => {
    const response =
      await api.patch(
        `/users/${id}`,
        data
      );

    const user =
      response.data.user ??
      response.data;

    return normalizeUser(user);
  };

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export const deleteUser =
  async (
    id: number
  ): Promise<void> => {
    await api.delete(
      `/users/${id}`
    );
  };