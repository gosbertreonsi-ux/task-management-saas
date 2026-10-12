import prisma from "../config/database";


export const checkProjectAccess = async (
  userId: number,
  projectId: number
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


  // Project owner automatically has access
  if (project.ownerId === userId) {

    return {
      userId,
      projectId,
      role: "OWNER" as const,
    };
  }


  // Otherwise check project membership
  const member =
    await prisma.projectMember.findUnique({

      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });


  if (!member) {
    throw new Error(
      "You are not a project member"
    );
  }


  return member;
};