"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authenticate = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        const parts = authorization.split(" ");
        if (parts.length !== 2 ||
            parts[0] !== "Bearer" ||
            !parts[1]) {
            return res.status(401).json({
                message: "Invalid authorization header format",
            });
        }
        const token = parts[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (!decoded.id ||
            !decoded.email ||
            !decoded.role) {
            return res.status(401).json({
                message: "Invalid token payload",
            });
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};
exports.authenticate = authenticate;
