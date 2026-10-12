"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.assignTask = exports.updateTaskStatus = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const database_1 = __importDefault(require("../../config/database"));
const checkPermission_1 = require("../../utils/checkPermission");
/*
 * ============================================================
 * CREATE TASK
 * ============================================================
 */
const createTask = async (data, userId) => {
    await (0, checkPermission_1.checkProjectAccess)(userId, Number(data.projectId));
    /*
     * Make sure the assigned user belongs
     * to the project.
     */
    const assignedMember = await database_1.default.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: Number(data.assignedToId),
                projectId: Number(data.projectId),
            },
        },
    });
    const project = await database_1.default.project.findUnique({
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
    const assignedIsOwner = project.ownerId ===
        Number(data.assignedToId);
    if (!assignedMember && !assignedIsOwner) {
        throw new Error("Assigned user is not a member of this project");
    }
    return database_1.default.task.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status ?? "TODO",
            dueDate: data.dueDate,
            projectId: Number(data.projectId),
            assignedToId: Number(data.assignedToId),
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
exports.createTask = createTask;
/*
 * ============================================================
 * GET PROJECT TASKS
 * ============================================================
 */
const getTasks = async (projectId, userId) => {
    await (0, checkPermission_1.checkProjectAccess)(userId, projectId);
    return database_1.default.task.findMany({
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
exports.getTasks = getTasks;
/*
 * ============================================================
 * GET SINGLE TASK
 * ============================================================
 */
const getTaskById = async (id, userId) => {
    const task = await database_1.default.task.findUnique({
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
    await (0, checkPermission_1.checkProjectAccess)(userId, task.projectId);
    return task;
};
exports.getTaskById = getTaskById;
/*
 * ============================================================
 * UPDATE TASK
 * ============================================================
 */
const updateTask = async (id, data, userId) => {
    const existingTask = await database_1.default.task.findUnique({
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
    await (0, checkPermission_1.checkProjectAccess)(userId, existingTask.projectId);
    /*
     * If assigning the task while updating,
     * verify that the new user belongs to
     * the project.
     */
    if (data.assignedToId !== undefined) {
        await validateProjectAssignee(existingTask.projectId, Number(data.assignedToId));
    }
    return database_1.default.task.update({
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
                assignedToId: Number(data.assignedToId),
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
exports.updateTask = updateTask;
/*
 * ============================================================
 * UPDATE TASK STATUS
 * ============================================================
 */
const updateTaskStatus = async (id, status, userId) => {
    const existingTask = await database_1.default.task.findUnique({
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
    await (0, checkPermission_1.checkProjectAccess)(userId, existingTask.projectId);
    return database_1.default.task.update({
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
exports.updateTaskStatus = updateTaskStatus;
/*
 * ============================================================
 * ASSIGN TASK
 * ============================================================
 */
const assignTask = async (id, assignedToId, userId) => {
    const existingTask = await database_1.default.task.findUnique({
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
    await (0, checkPermission_1.checkProjectAccess)(userId, existingTask.projectId);
    await validateProjectAssignee(existingTask.projectId, assignedToId);
    return database_1.default.task.update({
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
exports.assignTask = assignTask;
/*
 * ============================================================
 * DELETE TASK
 * ============================================================
 */
const deleteTask = async (id, userId) => {
    const existingTask = await database_1.default.task.findUnique({
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
    await (0, checkPermission_1.checkProjectAccess)(userId, existingTask.projectId);
    return database_1.default.task.delete({
        where: {
            id,
        },
    });
};
exports.deleteTask = deleteTask;
/*
 * ============================================================
 * VALIDATE ASSIGNEE
 * ============================================================
 */
const validateProjectAssignee = async (projectId, assignedToId) => {
    const project = await database_1.default.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            ownerId: true,
        },
    });
    if (!project) {
        throw new Error("Project not found");
    }
    /*
     * Project owner can be assigned
     * without a ProjectMember row.
     */
    if (project.ownerId === assignedToId) {
        return;
    }
    const member = await database_1.default.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: assignedToId,
                projectId,
            },
        },
    });
    if (!member) {
        throw new Error("Assigned user is not a member of this project");
    }
};
