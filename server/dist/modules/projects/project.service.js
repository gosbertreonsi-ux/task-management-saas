"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.checkProjectAccess = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const database_1 = __importDefault(require("../../config/database"));
/*
 * ============================================================
 * CREATE PROJECT
 * ============================================================
 */
const createProject = async (data, ownerId) => {
    return database_1.default.$transaction(async (tx) => {
        const project = await tx.project.create({
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
    });
};
exports.createProject = createProject;
/*
 * ============================================================
 * GET PROJECTS
 * ============================================================
 */
const getProjects = async (userId, role) => {
    if (role === "ADMIN") {
        return database_1.default.project.findMany({
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
    return database_1.default.project.findMany({
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
exports.getProjects = getProjects;
/*
 * ============================================================
 * GET PROJECT BY ID
 * ============================================================
 */
const getProjectById = async (id) => {
    const project = await database_1.default.project.findUnique({
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
        throw new Error("Project not found");
    }
    return project;
};
exports.getProjectById = getProjectById;
/*
 * ============================================================
 * CHECK PROJECT ACCESS
 * ============================================================
 */
const checkProjectAccess = async (projectId, userId, role) => {
    const project = await database_1.default.project.findUnique({
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
        throw new Error("Project not found");
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
exports.checkProjectAccess = checkProjectAccess;
/*
 * ============================================================
 * UPDATE PROJECT
 * ============================================================
 */
const updateProject = async (id, data, userId, role) => {
    const project = await database_1.default.project.findUnique({
        where: {
            id,
        },
        select: {
            ownerId: true,
        },
    });
    if (!project) {
        throw new Error("Project not found");
    }
    const isAdmin = role === "ADMIN";
    const isOwner = project.ownerId === userId;
    if (!isAdmin && !isOwner) {
        throw new Error("Only the project owner or ADMIN can update this project");
    }
    return database_1.default.project.update({
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
exports.updateProject = updateProject;
/*
 * ============================================================
 * DELETE PROJECT
 * ============================================================
 */
const deleteProject = async (id, userId, role) => {
    const project = await database_1.default.project.findUnique({
        where: {
            id,
        },
        select: {
            ownerId: true,
        },
    });
    if (!project) {
        throw new Error("Project not found");
    }
    const isAdmin = role === "ADMIN";
    const isOwner = project.ownerId === userId;
    if (!isAdmin && !isOwner) {
        throw new Error("Only the project owner or ADMIN can delete this project");
    }
    await database_1.default.project.delete({
        where: {
            id,
        },
    });
    return {
        message: "Project deleted successfully",
    };
};
exports.deleteProject = deleteProject;
