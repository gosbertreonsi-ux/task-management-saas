import prisma from "../../config/database";

import type {
  CreateTaskInput,
} from "./task.types";

import {
  checkProjectAccess,
} from "../../utils/checkPermission";

/*
 * ============================================================
 * CREATE TASK
 * ============================================================
 */

export const createTask = async (
  data: CreateTaskInput,
  userId: number
) => {
  await checkProjectAccess(
    userId,
    Number(data.projectId)
  );

  /*
   * Make sure the assigned user belongs
   * to the project.
   */
  const assignedMember =
    await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: Number(data.assignedToId),
          projectId: Number(data.projectId),
        },
      },
    });

  const project =
    await prisma.project.findUnique({
      where: {
        id: Number(data.projectId),
      },
      select: {
        ownerId: true,
      },
    });

  if (!project) {
    throw new Error("Project not found");
  }

  const assignedIsOwner =
    project.ownerId ===
    Number(data.assignedToId);

  if (!assignedMember && !assignedIsOwner) {
    throw new Error(
      "Assigned user is not a member of this project"
    );
  }

  return prisma.task.create({
    data: {
      title: data.title,

      description:
        data.description,

      status:
        data.status ?? "TODO",

      dueDate:
        data.dueDate,

      projectId:
        Number(data.projectId),

      assignedToId:
        Number(data.assignedToId),
    },

    include: {
      project: true,

      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};


/*
 * ============================================================
 * GET PROJECT TASKS
 * ============================================================
 */

export const getTasks = async (
  projectId: number,
  userId: number
) => {
  await checkProjectAccess(
    userId,
    projectId
  );

  return prisma.task.findMany({
    where: {
      projectId,
    },

    include: {
      project: true,

      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};


/*
 * ============================================================
 * GET SINGLE TASK
 * ============================================================
 */

export const getTaskById = async (
  id: number,
  userId: number
) => {
  const task =
    await prisma.task.findUnique({
      where: {
        id,
      },

      include: {
        project: true,

        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

  if (!task) {
    return null;
  }

  await checkProjectAccess(
    userId,
    task.projectId
  );

  return task;
};


/*
 * ============================================================
 * UPDATE TASK
 * ============================================================
 */

export const updateTask = async (
  id: number,
  data: Partial<CreateTaskInput>,
  userId: number
) => {
  const existingTask =
    await prisma.task.findUnique({
      where: {
        id,
      },

      select: {
        projectId: true,
      },
    });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  await checkProjectAccess(
    userId,
    existingTask.projectId
  );

  /*
   * If assigning the task while updating,
   * verify that the new user belongs to
   * the project.
   */
  if (
    data.assignedToId !== undefined
  ) {
    await validateProjectAssignee(
      existingTask.projectId,
      Number(data.assignedToId)
    );
  }

  return prisma.task.update({
    where: {
      id,
    },

    data: {
      ...(data.title !== undefined && {
        title: data.title,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate,
      }),

      ...(data.assignedToId !== undefined && {
        assignedToId:
          Number(data.assignedToId),
      }),
    },

    include: {
      project: true,

      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};


/*
 * ============================================================
 * UPDATE TASK STATUS
 * ============================================================
 */

export const updateTaskStatus = async (
  id: number,
  status:
    | "TODO"
    | "IN_PROGRESS"
    | "DONE",
  userId: number
) => {
  const existingTask =
    await prisma.task.findUnique({
      where: {
        id,
      },

      select: {
        projectId: true,
      },
    });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  await checkProjectAccess(
    userId,
    existingTask.projectId
  );

  return prisma.task.update({
    where: {
      id,
    },

    data: {
      status,
    },

    include: {
      project: true,

      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};


/*
 * ============================================================
 * ASSIGN TASK
 * ============================================================
 */

export const assignTask = async (
  id: number,
  assignedToId: number,
  userId: number
) => {
  const existingTask =
    await prisma.task.findUnique({
      where: {
        id,
      },

      select: {
        projectId: true,
      },
    });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  await checkProjectAccess(
    userId,
    existingTask.projectId
  );

  await validateProjectAssignee(
    existingTask.projectId,
    assignedToId
  );

  return prisma.task.update({
    where: {
      id,
    },

    data: {
      assignedToId,
    },

    include: {
      project: true,

      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};


/*
 * ============================================================
 * DELETE TASK
 * ============================================================
 */

export const deleteTask = async (
  id: number,
  userId: number
) => {
  const existingTask =
    await prisma.task.findUnique({
      where: {
        id,
      },

      select: {
        projectId: true,
      },
    });

  if (!existingTask) {
    throw new Error("Task not found");
  }

  await checkProjectAccess(
    userId,
    existingTask.projectId
  );

  return prisma.task.delete({
    where: {
      id,
    },
  });
};


/*
 * ============================================================
 * VALIDATE ASSIGNEE
 * ============================================================
 */

const validateProjectAssignee =
  async (
    projectId: number,
    assignedToId: number
  ) => {
    const project =
      await prisma.project.findUnique({
        where: {
          id: projectId,
        },

        select: {
          ownerId: true,
        },
      });

    if (!project) {
      throw new Error(
        "Project not found"
      );
    }

    /*
     * Project owner can be assigned
     * without a ProjectMember row.
     */
    if (
      project.ownerId === assignedToId
    ) {
      return;
    }

    const member =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: assignedToId,
            projectId,
          },
        },
      });

    if (!member) {
      throw new Error(
        "Assigned user is not a member of this project"
      );
    }
  };