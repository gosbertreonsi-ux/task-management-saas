import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "DATABASE_URL",
  "JWT_SECRET",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Missing required environment variable: ${variable}`
    );
  }
}

export const env = {
  PORT:
    Number(process.env.PORT) || 5000,

  DATABASE_URL:
    process.env.DATABASE_URL!,

  JWT_SECRET:
    process.env.JWT_SECRET!,

  JWT_EXPIRES_IN:
    process.env.JWT_EXPIRES_IN ||
    "7d",

  FRONTEND_URL:
    process.env.FRONTEND_URL ||
    "http://localhost:5173",

  NODE_ENV:
    process.env.NODE_ENV ||
    "development",
};