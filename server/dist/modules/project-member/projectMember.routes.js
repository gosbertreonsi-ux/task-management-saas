"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const projectMember_controller_1 = require("./projectMember.controller");
const router = (0, express_1.Router)({
    mergeParams: true,
});
/*
 * Authentication
 */
router.use(auth_middleware_1.authenticate);
/*
 * GET
 * /api/projects/:id/members
 */
router.get("/", projectMember_controller_1.getAll);
/*
 * GET
 * /api/projects/:id/members/available
 */
router.get("/available", projectMember_controller_1.getAvailable);
/*
 * POST
 * /api/projects/:id/members
 */
router.post("/", projectMember_controller_1.create);
/*
 * DELETE
 * /api/projects/:id/members/:userId
 */
router.delete("/:userId", projectMember_controller_1.remove);
exports.default = router;
