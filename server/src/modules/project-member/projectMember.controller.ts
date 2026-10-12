import {
  Request,
  Response,
} from "express";

import {
  addMember,
  getProjectMembers,
  getAvailableMembers,
  removeMember,
} from "./projectMember.service";

import {
  addMemberSchema,
  projectMemberParamsSchema,
  removeMemberParamsSchema,
} from "./projectMember.validation";


/*
 * ============================================================
 * GET PROJECT MEMBERS
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

    const { id } =
      projectMemberParamsSchema.parse(
        req.params
      );

    const members =
      await getProjectMembers(
        id,
        req.user.id,
        req.user.role
      );

    return res.status(200).json({
      members,
    });

  } catch (error) {
    console.error(
      "GET PROJECT MEMBERS ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch project members";

    const status =
      message.includes(
        "access"
      )
        ? 403
        : message.includes(
            "not found"
          )
        ? 404
        : 400;

    return res.status(status).json({
      message,
    });
  }
};


/*
 * ============================================================
 * GET AVAILABLE MEMBERS
 * ============================================================
 */

export const getAvailable =
  async (
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
        projectMemberParamsSchema.parse(
          req.params
        );

      const users =
        await getAvailableMembers(
          id,
          req.user.id,
          req.user.role
        );

      return res.status(200).json({
        users,
      });

    } catch (error) {
      console.error(
        "GET AVAILABLE MEMBERS ERROR:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch available members";

      const status =
        message.includes(
          "Only the project owner"
        )
          ? 403
          : message.includes(
              "not found"
            )
          ? 404
          : 400;

      return res.status(status).json({
        message,
      });
    }
  };


/*
 * ============================================================
 * ADD MEMBER
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

    const { id } =
      projectMemberParamsSchema.parse(
        req.params
      );

    const body =
      addMemberSchema.parse(
        req.body
      );

    const member =
      await addMember(
        {
          projectId: id,
          userId: body.userId,
          role: body.role,
        },
        req.user.id,
        req.user.role
      );

    return res.status(201).json({
      message:
        "Member added successfully",

      member,
    });

  } catch (error) {
    console.error(
      "ADD MEMBER ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to add member";

    let status = 400;

    if (
      message.includes(
        "Only the project owner"
      )
    ) {
      status = 403;
    }

    if (
      message.includes(
        "Project not found"
      )
    ) {
      status = 404;
    }

    if (
      message.includes(
        "already a member"
      )
    ) {
      status = 409;
    }

    if (
      message.includes(
        "User not found"
      )
    ) {
      status = 404;
    }

    return res.status(status).json({
      message,
    });
  }
};


/*
 * ============================================================
 * REMOVE MEMBER
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

    const {
      id,
      userId,
    } =
      removeMemberParamsSchema.parse(
        req.params
      );

    const result =
      await removeMember(
        id,
        userId,
        req.user.id,
        req.user.role
      );

    return res.status(200).json(
      result
    );

  } catch (error) {
    console.error(
      "REMOVE MEMBER ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to remove member";

    let status = 400;

    if (
      message.includes(
        "Only the project owner"
      )
    ) {
      status = 403;
    }

    if (
      message.includes(
        "cannot be removed"
      )
    ) {
      status = 403;
    }

    if (
      message.includes(
        "not found"
      )
    ) {
      status = 404;
    }

    return res.status(status).json({
      message,
    });
  }
};