export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  createdAt?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "MEMBER";
}