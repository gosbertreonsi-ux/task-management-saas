"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.updateSingleUser = exports.getSingleUser = exports.getAllUsers = void 0;
const user_service_1 = require("./user.service");
const user_validation_1 = require("./user.validation");
const getAllUsers = async (_req, res) => {
    try {
        const users = await (0, user_service_1.getUsers)();
        return res.status(200).json({
            users,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch users",
        });
    }
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    try {
        const { id } = user_validation_1.userIdSchema.parse(req.params);
        if (req.user?.role !== "ADMIN" &&
            req.user?.id !== id) {
            return res.status(403).json({
                message: "Access denied",
            });
        }
        const user = await (0, user_service_1.getUserById)(id);
        return res.status(200).json({
            user,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Failed to fetch user",
        });
    }
};
exports.getSingleUser = getSingleUser;
const updateSingleUser = async (req, res) => {
    try {
        const { id } = user_validation_1.userIdSchema.parse(req.params);
        if (req.user?.role !== "ADMIN" &&
            req.user?.id !== id) {
            return res.status(403).json({
                message: "Access denied",
            });
        }
        const data = user_validation_1.updateUserSchema.parse(req.body);
        if (req.user?.role !== "ADMIN" &&
            data.role !== undefined) {
            return res.status(403).json({
                message: "Only ADMIN users can change roles",
            });
        }
        const user = await (0, user_service_1.updateUser)(id, data);
        return res.status(200).json({
            message: "User updated successfully",
            user,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Failed to update user",
        });
    }
};
exports.updateSingleUser = updateSingleUser;
const removeUser = async (req, res) => {
    try {
        const { id } = user_validation_1.userIdSchema.parse(req.params);
        const result = await (0, user_service_1.deleteUser)(id);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Failed to delete user",
        });
    }
};
exports.removeUser = removeUser;
