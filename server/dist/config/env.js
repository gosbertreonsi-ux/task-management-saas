"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVariables = [
    "DATABASE_URL",
    "JWT_SECRET",
];
for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}
exports.env = {
    PORT: Number(process.env.PORT) || 5000,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ||
        "7d",
    FRONTEND_URL: process.env.FRONTEND_URL ||
        "http://localhost:5173",
    NODE_ENV: process.env.NODE_ENV ||
        "development",
};
