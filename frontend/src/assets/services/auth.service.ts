import api from "./api";

import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
} from "../types/auth";

export const login = async (
  data: LoginInput
): Promise<LoginResponse> => {
  const response =
    await api.post<LoginResponse>(
      "/auth/login",
      data
    );

  return response.data;
};

export const register = async (
  data: RegisterInput
): Promise<RegisterResponse> => {
  const response =
    await api.post<RegisterResponse>(
      "/auth/register",
      data
    );

  return response.data;
};