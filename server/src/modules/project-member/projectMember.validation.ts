import { z } from "zod";

export const addMemberSchema =
  z.object({
    userId: z.coerce
      .number()
      .int()
      .positive(),

    role: z
      .enum([
        "ADMIN",
        "MEMBER",
      ])
      .optional()
      .default("MEMBER"),
  });

export const projectMemberParamsSchema =
  z.object({
    id: z.coerce
      .number()
      .int()
      .positive(),
  });

export const removeMemberParamsSchema =
  z.object({
    id: z.coerce
      .number()
      .int()
      .positive(),

    userId: z.coerce
      .number()
      .int()
      .positive(),
  });