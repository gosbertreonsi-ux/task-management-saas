"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
// REGISTER
const register = async (req, res) => {
    try {
        const data = auth_validation_1.registerSchema.parse(req.body);
        const user = await (0, auth_service_1.registerUser)(data);
        return res.status(201).json({
            message: "User registered successfully",
            user
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : "Registration failed"
        });
    }
};
exports.register = register;
// LOGIN
const login = async (req, res) => {
    try {
        const data = auth_validation_1.loginSchema.parse(req.body);
        const result = await (0, auth_service_1.loginUser)(data);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({
            message: error instanceof Error
                ? error.message
                : "Login failed"
        });
    }
};
exports.login = login;
