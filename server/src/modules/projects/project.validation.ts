import { z } from "zod";

const projectTitle = z
  .string()
  .trim()
  .min(
    2,
    "Project title must be at least 2 characters"
  )
  .max(
    150,
    "Project title must not exceed 150 characters"
  );

const projectDescription = z
  .string()
  .trim()
  .max(
    1000,
    "Description must not exceed 1000 characters"
  )
  .optional();

export const createProjectSchema =
  z.object({
    title: projectTitle,

    description:
      projectDescription,
  });

export const updateProjectSchema =
  z
    .object({
      title:
        projectTitle.optional(),

      description:
        projectDescription,
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one field must be provided",
      }
    );

export const projectIdSchema =
  z.object({
    id: z.coerce
      .number()
      .int()
      .positive(),
  });