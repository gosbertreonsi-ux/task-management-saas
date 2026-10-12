"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.assign = exports.updateStatus = exports.update = exports.getOne = exports.getAll = exports.create = void 0;
const task_service_1 = require("./task.service");
const task_validation_1 = require("./task.validation");
/*
 * ============================================================
 * CREATE
 * ============================================================
 */
const create = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);
        if (Number.isNaN(projectId) ||
            projectId <= 0) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }
        const data = task_validation_1.createTaskSchema.parse(req.body);
        const userId = Number(req.user.id);
        const task = await (0, task_service_1.createTask)({
            ...data,
            projectId,
        }, userId);
        return res
            .status(201)
            .json(task);
    }
    catch (error) {
        console.error("CREATE TASK ERROR:", error);
        return res.status(400).json({
            message: error?.message ||
                "Unable to create task",
        });
    }
};
exports.create = create;
/*
 * ============================================================
 * GET ALL
 * ============================================================
 */
const getAll = async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);
        if (Number.isNaN(projectId) ||
            projectId <= 0) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }
        const userId = Number(req.user.id);
        const tasks = await (0, task_service_1.getTasks)(projectId, userId);
        return res.json(tasks);
    }
    catch (error) {
        console.error("GET TASKS ERROR:", error);
        return res.status(400).json({
            message: error?.message ||
                "Unable to load tasks",
        });
    }
};
exports.getAll = getAll;
/*
 * ============================================================
 * GET ONE
 * ============================================================
 */
const getOne = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id) ||
            id <= 0) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        }
        const userId = Number(req.user.id);
        const task = await (0, task_service_1.getTaskById)(id, userId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }
        return res.json(task);
    }
    catch (error) {
        console.error("GET TASK ERROR:", error);
        return res.status(400).json({
            message: error?.message ||
                "Unable to load task",
        });
    }
};
exports.getOne = getOne;
/*
 * ============================================================
 * UPDATE
 * ============================================================
 */
const update = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id) ||
            id <= 0) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        }
        const data = task_validation_1.updateTaskSchema.parse(req.body);
        const userId = Number(req.user.id);
        const task = await (0, task_service_1.updateTask)(id, data, userId);
        return res.json(task);
    }
    catch (error) {
        console.error("UPDATE TASK ERROR:", error);
        return res.status(400).json({
            message: error?.message ||
                "Unable to update task",
        });
    }
};
exports.update = update;
/*
 * ============================================================
 * UPDATE STATUS
 * ============================================================
 */
const updateStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id) ||
            id <= 0) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        }
        const data = task_validation_1.updateTaskStatusSchema.parse(req.body);
        const userId = Number(req.user.id);
        const task = await (0, task_service_1.updateTaskStatus)(id, data.status, userId);
        return res.json(task);
    }
    catch (error) {
        console.error("UPDATE TASK STATUS ERROR:", error);
        return res.status(400).json({
            message: error?.message ||
                "Unable to update task status",
        });
    }
};
exports.updateStatus = updateStatus;
/*
 * ============================================================
 * ASSIGN
 * ============================================================
 */
const assign = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id) ||
            id <= 0) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        }
        const data = task_validation_1.assignTaskSchema.parse(req.body);
        const userId = Number(req.user.id);
        const task = await (0, task_service_1.assignTask)(id, data.assignedToId, userId);
        return res.json(task);
    }
    catch (error) {
        console.error("ASSIGN TASK ERROR:", error);
        return res.status(400).json({
            message: error?.message ||
                "Unable to assign task",
        });
    }
};
exports.assign = assign;
/*
 * ============================================================
 * DELETE
 * ============================================================
 */
const remove = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id) ||
            id <= 0) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        }
        const userId = Number(req.user.id);
        await (0, task_service_1.deleteTask)(id, userId);
        return res.json({
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        console.error("DELETE TASK ERROR:", error);
        return res.status(400).json({
            message: error?.message ||
                "Unable to delete task",
        });
    }
};
exports.remove = remove;
