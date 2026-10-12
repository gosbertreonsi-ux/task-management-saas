"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const errorHandler = (error, _req, res, _next) => {
    console.error(error);
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "A record with this value already exists",
            });
        }
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Requested record was not found",
            });
        }
    }
    if (error instanceof errors_1.AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
        });
    }
    if (error instanceof Error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
    return res.status(500).json({
        message: "Internal server error",
    });
};
exports.errorHandler = errorHandler;
