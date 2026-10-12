import prisma from "../../config/database";

import type {
  AddMemberInput,
} from "./projectMember.types";

/*
 * ============================================================
 * CHECK PROJECT EXISTS
 * ============================================================
 */

const getProject = async (
  projectId: number
) => {
  const project =
    await prisma.project.findUnique({
      where: {
        id: projectId,
      },

      select: {
        id: true,
        ownerId: true,
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

const checkProjectAccess = async (
  projectId: number,
  userId: number,
  role: string
) => {
  const project =
    await getProject(projectId);

  /*
   * Global ADMIN can access everything.
   */
  if (role === "ADMIN") {
    return;
  }

  /*
   * Project owner can access.
   */
  if (project.ownerId === userId) {
    return;
  }

  /*
   * Check project membership.
   */
  const membership =
    await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

  if (!membership) {
    throw new Error(
      "You do not have access to this project"
    );
  }
};


/*
 * ============================================================
 * CHECK MEMBER MANAGEMENT PERMISSION
 * ============================================================
 */

const checkMemberManagementPermission =
  async (
    projectId: number,
    userId: number,
    role: string
  ) => {
    const project =
      await getProject(projectId);

    /*
     * Global ADMIN.
     */
    if (role === "ADMIN") {
      return;
    }

    /*
     * Only project owner can manage
     * members.
     */
    if (project.ownerId === userId) {
      return;
    }

    throw new Error(
      "Only the project owner or ADMIN can manage members"
    );
  };


/*
 * ============================================================
 * GET PROJECT MEMBERS
 * ============================================================
 */

export const getProjectMembers =
  async (
    projectId: number,
    userId: number,
    role: string
  ) => {
    await checkProjectAccess(
      projectId,
      userId,
      role
    );

    return prisma.projectMember.findMany({
      where: {
        projectId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },

      orderBy: {
        id: "asc",
      },
    });
  };


/*
 * ============================================================
 * GET AVAILABLE MEMBERS
 * ============================================================
 */

export const getAvailableMembers =
  async (
    projectId: number,
    userId: number,
    role: string
  ) => {
    await checkMemberManagementPermission(
      projectId,
      userId,
      role
    );

    /*
     * Get all current project members.
     */
    const existingMembers =
      await prisma.projectMember.findMany({
        where: {
          projectId,
        },

        select: {
          userId: true,
        },
      });

    const existingUserIds =
      existingMembers.map(
        (member) =>
          member.userId
      );

    /*
     * Return users who are not
     * already members.
     */
    return prisma.user.findMany({
      where: {
        id: {
          notIn: existingUserIds,
        },
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },

      orderBy: {
        name: "asc",
      },
    });
  };


/*
 * ============================================================
 * ADD MEMBER
 * ============================================================
 */

export const addMember = async (
  data: AddMemberInput,
  requesterId: number,
  requesterRole: string
) => {
  await checkMemberManagementPermission(
    data.projectId,
    requesterId,
    requesterRole
  );

  /*
   * Make sure project exists.
   */
  await getProject(
    data.projectId
  );

  /*
   * Make sure user exists.
   */
  const user =
    await prisma.user.findUnique({
      where: {
        id: Number(data.userId),
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  /*
   * Check if already a member.
   */
  const existingMember =
    await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: Number(
            data.userId
          ),

          projectId:
            data.projectId,
        },
      },
    });

  if (existingMember) {
    throw new Error(
      "User is already a member of this project"
    );
  }

  return prisma.projectMember.create({
    data: {
      projectId:
        data.projectId,

      userId:
        Number(data.userId),

      role:
        data.role ?? "MEMBER",
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};


/*
 * ============================================================
 * REMOVE MEMBER
 * ============================================================
 */

export const removeMember =
  async (
    projectId: number,
    userId: number,
    requesterId: number,
    requesterRole: string
  ) => {
    await checkMemberManagementPermission(
      projectId,
      requesterId,
      requesterRole
    );

    const project =
      await getProject(projectId);

    /*
     * NEVER allow the project owner
     * to be removed.
     */
    if (project.ownerId === userId) {
      throw new Error(
        "The project owner cannot be removed"
      );
    }

    const membership =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
      });

    if (!membership) {
      throw new Error(
        "Project member not found"
      );
    }

    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    return {
      message:
        "Member removed successfully",
    };
  };