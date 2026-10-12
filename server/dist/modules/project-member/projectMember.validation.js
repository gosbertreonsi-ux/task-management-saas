"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMemberParamsSchema = exports.projectMemberParamsSchema = exports.addMemberSchema = void 0;
const zod_1 = require("zod");
exports.addMemberSchema = zod_1.z.object({
    userId: zod_1.z.coerce
        .number()
        .int()
        .positive(),
    role: zod_1.z
        .enum([
        "ADMIN",
        "MEMBER",
    ])
        .optional()
        .default("MEMBER"),
});
exports.projectMemberParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce
        .number()
        .int()
        .positive(),
});
exports.removeMemberParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce
        .number()
        .int()
        .positive(),
    userId: zod_1.z.coerce
        .number()
        .int()
        .positive(),
});
