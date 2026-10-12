export interface User {
  id: number;

  name: string;

  email: string;

  role: "ADMIN" | "MEMBER";
}

export interface LoginInput {
  email: string;

  password: string;
}

export interface RegisterInput {
  name: string;

  email: string;

  password: string;
}

export interface LoginResponse {
  message: string;

  token: string;

  user: User;
}

export interface RegisterResponse {
  message: string;

  user: User;
}