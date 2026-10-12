"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTaskSchema = exports.updateTaskStatusSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const taskTitle = zod_1.z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters");
const taskDescription = zod_1.z
    .string()
    .trim()
    .max(2000, "Description must not exceed 2000 characters")
    .optional();
exports.createTaskSchema = zod_1.z.object({
    title: taskTitle,
    description: taskDescription,
    status: zod_1.z
        .enum([
        "TODO",
        "IN_PROGRESS",
        "DONE",
    ])
        .optional()
        .default("TODO"),
    dueDate: zod_1.z
        .coerce
        .date()
        .optional(),
    assignedToId: zod_1.z
        .number()
        .int()
        .positive(),
});
exports.updateTaskSchema = zod_1.z
    .object({
    title: taskTitle.optional(),
    description: taskDescription,
    dueDate: zod_1.z
        .coerce
        .date()
        .optional(),
    assignedToId: zod_1.z
        .number()
        .int()
        .positive()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});
exports.updateTaskStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "TODO",
        "IN_PROGRESS",
        "DONE",
    ]),
});
exports.assignTaskSchema = zod_1.z.object({
    assignedToId: zod_1.z
        .number()
        .int()
        .positive(),
});
