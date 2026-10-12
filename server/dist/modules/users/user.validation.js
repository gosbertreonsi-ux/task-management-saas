"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdSchema = exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .optional(),
    email: zod_1.z
        .string()
        .trim()
        .email("Invalid email address")
        .transform((email) => email.toLowerCase())
        .optional(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .optional(),
    role: zod_1.z
        .enum([
        "ADMIN",
        "MEMBER",
    ])
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});
exports.userIdSchema = zod_1.z.object({
    id: zod_1.z.coerce
        .number()
        .int()
        .positive(),
});
