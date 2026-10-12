import {
  Request,
  Response,
} from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
} from "./task.service";

import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  assignTaskSchema,
} from "./task.validation";


/*
 * ============================================================
 * CREATE
 * ============================================================
 */

export const create = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId =
      Number(req.params.projectId);

    if (
      Number.isNaN(projectId) ||
      projectId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const data =
      createTaskSchema.parse(
        req.body
      );

    const userId =
      Number((req as any).user.id);

    const task =
      await createTask(
        {
          ...data,
          projectId,
        },
        userId
      );

    return res
      .status(201)
      .json(task);

  } catch (error: any) {
    console.error(
      "CREATE TASK ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error?.message ||
        "Unable to create task",
    });
  }
};


/*
 * ============================================================
 * GET ALL
 * ============================================================
 */

export const getAll = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId =
      Number(req.params.projectId);

    if (
      Number.isNaN(projectId) ||
      projectId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const userId =
      Number((req as any).user.id);

    const tasks =
      await getTasks(
        projectId,
        userId
      );

    return res.json(tasks);

  } catch (error: any) {
    console.error(
      "GET TASKS ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error?.message ||
        "Unable to load tasks",
    });
  }
};


/*
 * ============================================================
 * GET ONE
 * ============================================================
 */

export const getOne = async (
  req: Request,
  res: Response
) => {
  try {
    const id =
      Number(req.params.id);

    if (
      Number.isNaN(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const userId =
      Number((req as any).user.id);

    const task =
      await getTaskById(
        id,
        userId
      );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json(task);

  } catch (error: any) {
    console.error(
      "GET TASK ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error?.message ||
        "Unable to load task",
    });
  }
};


/*
 * ============================================================
 * UPDATE
 * ============================================================
 */

export const update = async (
  req: Request,
  res: Response
) => {
  try {
    const id =
      Number(req.params.id);

    if (
      Number.isNaN(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const data =
      updateTaskSchema.parse(
        req.body
      );

    const userId =
      Number((req as any).user.id);

    const task =
      await updateTask(
        id,
        data,
        userId
      );

    return res.json(task);

  } catch (error: any) {
    console.error(
      "UPDATE TASK ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error?.message ||
        "Unable to update task",
    });
  }
};


/*
 * ============================================================
 * UPDATE STATUS
 * ============================================================
 */

export const updateStatus =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id =
        Number(req.params.id);

      if (
        Number.isNaN(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          message:
            "Invalid task ID",
        });
      }

      const data =
        updateTaskStatusSchema.parse(
          req.body
        );

      const userId =
        Number(
          (req as any).user.id
        );

      const task =
        await updateTaskStatus(
          id,
          data.status,
          userId
        );

      return res.json(task);

    } catch (error: any) {
      console.error(
        "UPDATE TASK STATUS ERROR:",
        error
      );

      return res.status(400).json({
        message:
          error?.message ||
          "Unable to update task status",
      });
    }
  };


/*
 * ============================================================
 * ASSIGN
 * ============================================================
 */

export const assign = async (
  req: Request,
  res: Response
) => {
  try {
    const id =
      Number(req.params.id);

    if (
      Number.isNaN(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const data =
      assignTaskSchema.parse(
        req.body
      );

    const userId =
      Number((req as any).user.id);

    const task =
      await assignTask(
        id,
        data.assignedToId,
        userId
      );

    return res.json(task);

  } catch (error: any) {
    console.error(
      "ASSIGN TASK ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error?.message ||
        "Unable to assign task",
    });
  }
};


/*
 * ============================================================
 * DELETE
 * ============================================================
 */

export const remove = async (
  req: Request,
  res: Response
) => {
  try {
    const id =
      Number(req.params.id);

    if (
      Number.isNaN(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const userId =
      Number((req as any).user.id);

    await deleteTask(
      id,
      userId
    );

    return res.json({
      message:
        "Task deleted successfully",
    });

  } catch (error: any) {
    console.error(
      "DELETE TASK ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error?.message ||
        "Unable to delete task",
    });
  }
};