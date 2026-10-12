"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../../config/database"));
const env_1 = require("../../config/env");
// REGISTER
const registerUser = async (data) => {
    const existingUser = await database_1.default.user.findUnique({
        where: {
            email: data.email
        }
    });
    if (existingUser) {
        throw new Error("Email already registered");
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const memberRole = await database_1.default.role.findUnique({
        where: {
            name: "MEMBER"
        }
    });
    if (!memberRole) {
        throw new Error("MEMBER role does not exist. Run the database seed.");
    }
    const user = await database_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            roleId: memberRole.id
        },
        include: {
            role: true
        }
    });
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        createdAt: user.createdAt
    };
};
exports.registerUser = registerUser;
// LOGIN
const loginUser = async (data) => {
    const user = await database_1.default.user.findUnique({
        where: {
            email: data.email
        },
        include: {
            role: true
        }
    });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const passwordMatch = await bcrypt_1.default.compare(data.password, user.password);
    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role.name
    }, env_1.env.JWT_SECRET, {
        expiresIn: env_1.env.JWT_EXPIRES_IN
    });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.name
        }
    };
};
exports.loginUser = loginUser;
