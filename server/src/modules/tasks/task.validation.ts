import { z } from "zod";

const taskTitle = z
  .string()
  .trim()
  .min(3, "Title must be at least 3 characters")
  .max(200, "Title must not exceed 200 characters");

const taskDescription = z
  .string()
  .trim()
  .max(
    2000,
    "Description must not exceed 2000 characters"
  )
  .optional();

export const createTaskSchema = z.object({
  title: taskTitle,

  description: taskDescription,

  status: z
    .enum([
      "TODO",
      "IN_PROGRESS",
      "DONE",
    ])
    .optional()
    .default("TODO"),

  dueDate: z
    .coerce
    .date()
    .optional(),

  assignedToId: z
    .number()
    .int()
    .positive(),
});

export const updateTaskSchema = z
  .object({
    title: taskTitle.optional(),

    description: taskDescription,

    dueDate: z
      .coerce
      .date()
      .optional(),

    assignedToId: z
      .number()
      .int()
      .positive()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "At least one field must be provided",
    }
  );

export const updateTaskStatusSchema =
  z.object({
    status: z.enum([
      "TODO",
      "IN_PROGRESS",
      "DONE",
    ]),
  });

export const assignTaskSchema =
  z.object({
    assignedToId: z
      .number()
      .int()
      .positive(),
  });