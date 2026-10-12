import {
  Request,
  Response,
} from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  checkProjectAccess,
  updateProject,
  deleteProject,
} from "./project.service";

import {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
} from "./project.validation";


/*
 * ============================================================
 * CREATE PROJECT
 * ============================================================
 */

export const create = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    const data =
      createProjectSchema.parse(
        req.body
      );

    const project =
      await createProject(
        data,
        req.user.id
      );

    return res.status(201).json({
      message:
        "Project created successfully",

      project,
    });

  } catch (error) {
    console.error(
      "CREATE PROJECT ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create project",
    });
  }
};


/*
 * ============================================================
 * GET ALL PROJECTS
 * ============================================================
 */

export const getAll = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    const projects =
      await getProjects(
        req.user.id,
        req.user.role
      );

    return res.status(200).json({
      projects,
    });

  } catch (error) {
    console.error(
      "GET PROJECTS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch projects",
    });
  }
};


/*
 * ============================================================
 * GET SINGLE PROJECT
 * ============================================================
 */

export const getSingle = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    const { id } =
      projectIdSchema.parse(
        req.params
      );

    const project =
      await getProjectById(id);

    const access =
      await checkProjectAccess(
        id,
        req.user.id,
        req.user.role
      );

    if (!access.allowed) {
      return res.status(403).json({
        message:
          "You do not have access to this project",
      });
    }

    return res.status(200).json({
      project,
    });

  } catch (error) {
    console.error(
      "GET PROJECT ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch project",
    });
  }
};


/*
 * ============================================================
 * UPDATE PROJECT
 * ============================================================
 */

export const update = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    const { id } =
      projectIdSchema.parse(
        req.params
      );

    const data =
      updateProjectSchema.parse(
        req.body
      );

    const updated =
      await updateProject(
        id,
        data,
        req.user.id,
        req.user.role
      );

    return res.status(200).json({
      message:
        "Project updated successfully",

      project: updated,
    });

  } catch (error) {
    console.error(
      "UPDATE PROJECT ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update project",
    });
  }
};


/*
 * ============================================================
 * DELETE PROJECT
 * ============================================================
 */

export const remove = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    const { id } =
      projectIdSchema.parse(
        req.params
      );

    const result =
      await deleteProject(
        id,
        req.user.id,
        req.user.role
      );

    return res.status(200).json(
      result
    );

  } catch (error) {
    console.error(
      "DELETE PROJECT ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete project",
    });
  }
};