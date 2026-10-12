"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../../config/database"));
const getUsers = async () => {
    return database_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getUsers = getUsers;
const getUserById = async (id) => {
    const user = await database_1.default.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.getUserById = getUserById;
const updateUser = async (id, data) => {
    const existingUser = await database_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!existingUser) {
        throw new Error("User not found");
    }
    const updateData = {};
    if (data.name !== undefined) {
        updateData.name = data.name;
    }
    if (data.email !== undefined) {
        updateData.email = data.email;
    }
    if (data.password !== undefined) {
        updateData.password =
            await bcrypt_1.default.hash(data.password, 10);
    }
    if (data.role !== undefined) {
        const role = await database_1.default.role.findUnique({
            where: {
                name: data.role,
            },
        });
        if (!role) {
            throw new Error(`Role ${data.role} does not exist`);
        }
        updateData.roleId = role.id;
    }
    return database_1.default.user.update({
        where: {
            id,
        },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    const existingUser = await database_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!existingUser) {
        throw new Error("User not found");
    }
    await database_1.default.user.delete({
        where: {
            id,
        },
    });
    return {
        message: "User deleted successfully",
    };
};
exports.deleteUser = deleteUser;
