"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMember = exports.addMember = exports.getAvailableMembers = exports.getProjectMembers = void 0;
const database_1 = __importDefault(require("../../config/database"));
/*
 * ============================================================
 * CHECK PROJECT EXISTS
 * ============================================================
 */
const getProject = async (projectId) => {
    const project = await database_1.default.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            id: true,
            ownerId: true,
        },
    });
    if (!project) {
        throw new Error("Project not found");
    }
    return project;
};
/*
 * ============================================================
 * CHECK PROJECT ACCESS
 * ============================================================
 */
const checkProjectAccess = async (projectId, userId, role) => {
    const project = await getProject(projectId);
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
    const membership = await database_1.default.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId,
                projectId,
            },
        },
    });
    if (!membership) {
        throw new Error("You do not have access to this project");
    }
};
/*
 * ============================================================
 * CHECK MEMBER MANAGEMENT PERMISSION
 * ============================================================
 */
const checkMemberManagementPermission = async (projectId, userId, role) => {
    const project = await getProject(projectId);
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
    throw new Error("Only the project owner or ADMIN can manage members");
};
/*
 * ============================================================
 * GET PROJECT MEMBERS
 * ============================================================
 */
const getProjectMembers = async (projectId, userId, role) => {
    await checkProjectAccess(projectId, userId, role);
    return database_1.default.projectMember.findMany({
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
exports.getProjectMembers = getProjectMembers;
/*
 * ============================================================
 * GET AVAILABLE MEMBERS
 * ============================================================
 */
const getAvailableMembers = async (projectId, userId, role) => {
    await checkMemberManagementPermission(projectId, userId, role);
    /*
     * Get all current project members.
     */
    const existingMembers = await database_1.default.projectMember.findMany({
        where: {
            projectId,
        },
        select: {
            userId: true,
        },
    });
    const existingUserIds = existingMembers.map((member) => member.userId);
    /*
     * Return users who are not
     * already members.
     */
    return database_1.default.user.findMany({
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
exports.getAvailableMembers = getAvailableMembers;
/*
 * ============================================================
 * ADD MEMBER
 * ============================================================
 */
const addMember = async (data, requesterId, requesterRole) => {
    await checkMemberManagementPermission(data.projectId, requesterId, requesterRole);
    /*
     * Make sure project exists.
     */
    await getProject(data.projectId);
    /*
     * Make sure user exists.
     */
    const user = await database_1.default.user.findUnique({
        where: {
            id: Number(data.userId),
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    /*
     * Check if already a member.
     */
    const existingMember = await database_1.default.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: Number(data.userId),
                projectId: data.projectId,
            },
        },
    });
    if (existingMember) {
        throw new Error("User is already a member of this project");
    }
    return database_1.default.projectMember.create({
        data: {
            projectId: data.projectId,
            userId: Number(data.userId),
            role: data.role ?? "MEMBER",
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
exports.addMember = addMember;
/*
 * ============================================================
 * REMOVE MEMBER
 * ============================================================
 */
const removeMember = async (projectId, userId, requesterId, requesterRole) => {
    await checkMemberManagementPermission(projectId, requesterId, requesterRole);
    const project = await getProject(projectId);
    /*
     * NEVER allow the project owner
     * to be removed.
     */
    if (project.ownerId === userId) {
        throw new Error("The project owner cannot be removed");
    }
    const membership = await database_1.default.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId,
                projectId,
            },
        },
    });
    if (!membership) {
        throw new Error("Project member not found");
    }
    await database_1.default.projectMember.delete({
        where: {
            userId_projectId: {
                userId,
                projectId,
            },
        },
    });
    return {
        message: "Member removed successfully",
    };
};
exports.removeMember = removeMember;
