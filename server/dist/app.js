"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const not_found_middleware_1 = require("./middlewares/not-found.middleware");
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const project_routes_1 = __importDefault(require("./modules/projects/project.routes"));
const projectMember_routes_1 = __importDefault(require("./modules/project-member/projectMember.routes"));
const task_routes_1 = __importDefault(require("./modules/tasks/task.routes"));
const task_single_routes_1 = __importDefault(require("./modules/tasks/task.single.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const role_middleware_1 = require("./middlewares/role.middleware");
const app = (0, express_1.default)();
/*
 * ============================================================
 * CORS
 * ============================================================
 */
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
/*
 * ============================================================
 * BODY PARSER
 * ============================================================
 */
app.use(express_1.default.json());
/*
 * ============================================================
 * HEALTH CHECK
 * ============================================================
 */
app.get("/api/health", (_req, res) => {
    return res.status(200).json({
        message: "Task Management SaaS API is running",
    });
});
/*
 * ============================================================
 * AUTH
 * ============================================================
 */
app.use("/api/auth", auth_routes_1.default);
/*
 * ============================================================
 * TEST PROTECTED ROUTE
 * ============================================================
 */
app.get("/api/test/protected", auth_middleware_1.authenticate, (req, res) => {
    return res.status(200).json({
        message: "You accessed a protected route",
        user: req.user,
    });
});
/*
 * ============================================================
 * TEST ADMIN ROUTE
 * ============================================================
 */
app.get("/api/test/admin", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)("ADMIN"), (req, res) => {
    return res.status(200).json({
        message: "You accessed an ADMIN-only route",
        user: req.user,
    });
});
/*
 * ============================================================
 * USERS
 * ============================================================
 */
app.use("/api/users", user_routes_1.default);
/*
 * ============================================================
 * PROJECTS
 * ============================================================
 */
app.use("/api/projects", project_routes_1.default);
/*
 * ============================================================
 * PROJECT MEMBERS
 * ============================================================
 */
app.use("/api/projects/:id/members", projectMember_routes_1.default);
/*
 * ============================================================
 * PROJECT TASKS
 *
 * GET
 * /api/projects/:projectId/tasks
 *
 * POST
 * /api/projects/:projectId/tasks
 * ============================================================
 */
app.use("/api/projects/:projectId/tasks", task_routes_1.default);
/*
 * ============================================================
 * SINGLE TASK
 *
 * GET
 * /api/tasks/:id
 *
 * PATCH
 * /api/tasks/:id
 *
 * PATCH
 * /api/tasks/:id/status
 *
 * PATCH
 * /api/tasks/:id/assign
 *
 * DELETE
 * /api/tasks/:id
 * ============================================================
 */
app.use("/api/tasks", task_single_routes_1.default);
/*
 * ============================================================
 * 404
 * ============================================================
 */
app.use(not_found_middleware_1.notFound);
/*
 * ============================================================
 * ERROR HANDLER
 * ============================================================
 */
app.use(error_middleware_1.errorHandler);
exports.default = app;
