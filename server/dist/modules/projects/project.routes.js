"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const project_controller_1 = require("./project.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/*
 * POST /api/projects
 */
router.post("/", project_controller_1.create);
/*
 * GET /api/projects
 */
router.get("/", project_controller_1.getAll);
/*
 * GET /api/projects/:id
 */
router.get("/:id", project_controller_1.getSingle);
/*
 * PATCH /api/projects/:id
 */
router.patch("/:id", project_controller_1.update);
/*
 * DELETE /api/projects/:id
 */
router.delete("/:id", project_controller_1.remove);
exports.default = router;
