"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.create = exports.getAvailable = exports.getAll = void 0;
const projectMember_service_1 = require("./projectMember.service");
const projectMember_validation_1 = require("./projectMember.validation");
/*
 * ============================================================
 * GET PROJECT MEMBERS
 * ============================================================
 */
const getAll = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const { id } = projectMember_validation_1.projectMemberParamsSchema.parse(req.params);
        const members = await (0, projectMember_service_1.getProjectMembers)(id, req.user.id, req.user.role);
        return res.status(200).json({
            members,
        });
    }
    catch (error) {
        console.error("GET PROJECT MEMBERS ERROR:", error);
        const message = error instanceof Error
            ? error.message
            : "Failed to fetch project members";
        const status = message.includes("access")
            ? 403
            : message.includes("not found")
                ? 404
                : 400;
        return res.status(status).json({
            message,
        });
    }
};
exports.getAll = getAll;
/*
 * ============================================================
 * GET AVAILABLE MEMBERS
 * ============================================================
 */
const getAvailable = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const { id } = projectMember_validation_1.projectMemberParamsSchema.parse(req.params);
        const users = await (0, projectMember_service_1.getAvailableMembers)(id, req.user.id, req.user.role);
        return res.status(200).json({
            users,
        });
    }
    catch (error) {
        console.error("GET AVAILABLE MEMBERS ERROR:", error);
        const message = error instanceof Error
            ? error.message
            : "Failed to fetch available members";
        const status = message.includes("Only the project owner")
            ? 403
            : message.includes("not found")
                ? 404
                : 400;
        return res.status(status).json({
            message,
        });
    }
};
exports.getAvailable = getAvailable;
/*
 * ============================================================
 * ADD MEMBER
 * ============================================================
 */
const create = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const { id } = projectMember_validation_1.projectMemberParamsSchema.parse(req.params);
        const body = projectMember_validation_1.addMemberSchema.parse(req.body);
        const member = await (0, projectMember_service_1.addMember)({
            projectId: id,
            userId: body.userId,
            role: body.role,
        }, req.user.id, req.user.role);
        return res.status(201).json({
            message: "Member added successfully",
            member,
        });
    }
    catch (error) {
        console.error("ADD MEMBER ERROR:", error);
        const message = error instanceof Error
            ? error.message
            : "Failed to add member";
        let status = 400;
        if (message.includes("Only the project owner")) {
            status = 403;
        }
        if (message.includes("Project not found")) {
            status = 404;
        }
        if (message.includes("already a member")) {
            status = 409;
        }
        if (message.includes("User not found")) {
            status = 404;
        }
        return res.status(status).json({
            message,
        });
    }
};
exports.create = create;
/*
 * ============================================================
 * REMOVE MEMBER
 * ============================================================
 */
const remove = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const { id, userId, } = projectMember_validation_1.removeMemberParamsSchema.parse(req.params);
        const result = await (0, projectMember_service_1.removeMember)(id, userId, req.user.id, req.user.role);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("REMOVE MEMBER ERROR:", error);
        const message = error instanceof Error
            ? error.message
            : "Failed to remove member";
        let status = 400;
        if (message.includes("Only the project owner")) {
            status = 403;
        }
        if (message.includes("cannot be removed")) {
            status = 403;
        }
        if (message.includes("not found")) {
            status = 404;
        }
        return res.status(status).json({
            message,
        });
    }
};
exports.remove = remove;
