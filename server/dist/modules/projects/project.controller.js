"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getSingle = exports.getAll = exports.create = void 0;
const project_service_1 = require("./project.service");
const project_validation_1 = require("./project.validation");
/*
 * ============================================================
 * CREATE PROJECT
 * ============================================================
 */
const create = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const data = project_validation_1.createProjectSchema.parse(req.body);
        const project = await (0, project_service_1.createProject)(data, req.user.id);
        return res.status(201).json({
            message: "Project created successfully",
            project,
        });
    }
    catch (error) {
        console.error("CREATE PROJECT ERROR:", error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Failed to create project",
        });
    }
};
exports.create = create;
/*
 * ============================================================
 * GET ALL PROJECTS
 * ============================================================
 */
const getAll = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const projects = await (0, project_service_1.getProjects)(req.user.id, req.user.role);
        return res.status(200).json({
            projects,
        });
    }
    catch (error) {
        console.error("GET PROJECTS ERROR:", error);
        return res.status(500).json({
            message: "Failed to fetch projects",
        });
    }
};
exports.getAll = getAll;
/*
 * ============================================================
 * GET SINGLE PROJECT
 * ============================================================
 */
const getSingle = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const { id } = project_validation_1.projectIdSchema.parse(req.params);
        const project = await (0, project_service_1.getProjectById)(id);
        const access = await (0, project_service_1.checkProjectAccess)(id, req.user.id, req.user.role);
        if (!access.allowed) {
            return res.status(403).json({
                message: "You do not have access to this project",
            });
        }
        return res.status(200).json({
            project,
        });
    }
    catch (error) {
        console.error("GET PROJECT ERROR:", error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Failed to fetch project",
        });
    }
};
exports.getSingle = getSingle;
/*
 * ============================================================
 * UPDATE PROJECT
 * ============================================================
 */
const update = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const { id } = project_validation_1.projectIdSchema.parse(req.params);
        const data = project_validation_1.updateProjectSchema.parse(req.body);
        const updated = await (0, project_service_1.updateProject)(id, data, req.user.id, req.user.role);
        return res.status(200).json({
            message: "Project updated successfully",
            project: updated,
        });
    }
    catch (error) {
        console.error("UPDATE PROJECT ERROR:", error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Failed to update project",
        });
    }
};
exports.update = update;
/*
 * ============================================================
 * DELETE PROJECT
 * ============================================================
 */
const remove = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const { id } = project_validation_1.projectIdSchema.parse(req.params);
        const result = await (0, project_service_1.deleteProject)(id, req.user.id, req.user.role);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("DELETE PROJECT ERROR:", error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Failed to delete project",
        });
    }
};
exports.remove = remove;
