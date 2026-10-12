"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProjectAccess = void 0;
const database_1 = __importDefault(require("../config/database"));
const checkProjectAccess = async (userId, projectId) => {
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
    // Project owner automatically has access
    if (project.ownerId === userId) {
        return {
            userId,
            projectId,
            role: "OWNER",
        };
    }
    // Otherwise check project membership
    const member = await database_1.default.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId,
                projectId,
            },
        },
    });
    if (!member) {
        throw new Error("You are not a project member");
    }
    return member;
};
exports.checkProjectAccess = checkProjectAccess;
