import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import * as controller from "./task.controller";

const router = Router({
  mergeParams: true,
});

router.use(authenticate);

/*
 * Project-scoped task routes
 *
 * GET  /api/projects/:projectId/tasks
 * POST /api/projects/:projectId/tasks
 */
router.get("/", controller.getAll);

router.post("/", controller.create);

export default router;