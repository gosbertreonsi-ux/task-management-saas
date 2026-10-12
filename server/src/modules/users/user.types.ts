export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "MEMBER";
}