"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectIdSchema = exports.updateProjectSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
const projectTitle = zod_1.z
    .string()
    .trim()
    .min(2, "Project title must be at least 2 characters")
    .max(150, "Project title must not exceed 150 characters");
const projectDescription = zod_1.z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters")
    .optional();
exports.createProjectSchema = zod_1.z.object({
    title: projectTitle,
    description: projectDescription,
});
exports.updateProjectSchema = zod_1.z
    .object({
    title: projectTitle.optional(),
    description: projectDescription,
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});
exports.projectIdSchema = zod_1.z.object({
    id: zod_1.z.coerce
        .number()
        .int()
        .positive(),
});
