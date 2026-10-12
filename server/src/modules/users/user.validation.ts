import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Name must be at least 2 characters"
      )
      .max(
        100,
        "Name must not exceed 100 characters"
      )
      .optional(),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .transform((email) =>
        email.toLowerCase()
      )
      .optional(),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
      .optional(),

    role: z
      .enum([
        "ADMIN",
        "MEMBER",
      ])
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "At least one field must be provided",
    }
  );

export const userIdSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive(),
});