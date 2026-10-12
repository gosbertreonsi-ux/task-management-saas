import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import * as controller from "./task.controller";

const router = Router();

router.use(authenticate);

/*
 * Individual task routes
 *
 * GET    /api/tasks/:id
 * PATCH  /api/tasks/:id
 * PATCH  /api/tasks/:id/status
 * PATCH  /api/tasks/:id/assign
 * DELETE /api/tasks/:id
 */

router.get("/:id", controller.getOne);

router.patch("/:id", controller.update);

router.patch(
  "/:id/status",
  controller.updateStatus
);

router.patch(
  "/:id/assign",
  controller.assign
);

router.delete(
  "/:id",
  controller.remove
);

export default router;