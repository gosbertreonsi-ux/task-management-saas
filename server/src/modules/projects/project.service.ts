import prisma from "../../config/database";

import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "./project.types";

/*
 * ============================================================
 * CREATE PROJECT
 * ============================================================
 */

export const createProject = async (
  data: CreateProjectInput,
  ownerId: number
) => {
  return prisma.$transaction(
    async (tx) => {
      const project =
        await tx.project.create({
          data: {
            title: data.title,
            description: data.description,
            ownerId,
          },

          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId: ownerId,
          role: "OWNER",
        },
      });

      return project;
    }
  );
};


/*
 * ============================================================
 * GET PROJECTS
 * ============================================================
 */

export const getProjects = async (
  userId: number,
  role: string
) => {
  if (role === "ADMIN") {
    return prisma.project.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return prisma.project.findMany({
    where: {
      OR: [
        {
          ownerId: userId,
        },

        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },

    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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
 * GET PROJECT BY ID
 * ============================================================
 */

export const getProjectById = async (
  id: number
) => {
  const project =
    await prisma.project.findUnique({
      where: {
        id,
      },

      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

  if (!project) {
    throw new Error(
      "Project not found"
    );
  }

  return project;
};


/*
 * ============================================================
 * CHECK PROJECT ACCESS
 * ============================================================
 */

export const checkProjectAccess = async (
  projectId: number,
  userId: number,
  role: string
) => {
  const project =
    await prisma.project.findUnique({
      where: {
        id: projectId,
      },

      select: {
        ownerId: true,
        members: {
          where: {
            userId,
          },

          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

  if (!project) {
    throw new Error(
      "Project not found"
    );
  }

  /*
   * Global ADMIN can access everything.
   */
  if (role === "ADMIN") {
    return {
      allowed: true,
      role: "ADMIN",
    };
  }

  /*
   * Project owner.
   */
  if (project.ownerId === userId) {
    return {
      allowed: true,
      role: "OWNER",
    };
  }

  /*
   * Project member.
   */
  if (project.members.length > 0) {
    return {
      allowed: true,
      role: project.members[0].role,
    };
  }

  return {
    allowed: false,
    role: null,
  };
};


/*
 * ============================================================
 * UPDATE PROJECT
 * ============================================================
 */

export const updateProject = async (
  id: number,
  data: UpdateProjectInput,
  userId: number,
  role: string
) => {
  const project =
    await prisma.project.findUnique({
      where: {
        id,
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

  const isAdmin =
    role === "ADMIN";

  const isOwner =
    project.ownerId === userId;

  if (!isAdmin && !isOwner) {
    throw new Error(
      "Only the project owner or ADMIN can update this project"
    );
  }

  return prisma.project.update({
    where: {
      id,
    },

    data,

    include: {
      owner: {
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
 * DELETE PROJECT
 * ============================================================
 */

export const deleteProject = async (
  id: number,
  userId: number,
  role: string
) => {
  const project =
    await prisma.project.findUnique({
      where: {
        id,
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

  const isAdmin =
    role === "ADMIN";

  const isOwner =
    project.ownerId === userId;

  if (!isAdmin && !isOwner) {
    throw new Error(
      "Only the project owner or ADMIN can delete this project"
    );
  }

  await prisma.project.delete({
    where: {
      id,
    },
  });

  return {
    message:
      "Project deleted successfully",
  };
};