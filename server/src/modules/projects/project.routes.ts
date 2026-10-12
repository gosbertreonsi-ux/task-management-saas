import { Router } from "express";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  create,
  getAll,
  getSingle,
  update,
  remove,
} from "./project.controller";

const router = Router();

router.use(authenticate);


/*
 * POST /api/projects
 */
router.post(
  "/",
  create
);


/*
 * GET /api/projects
 */
router.get(
  "/",
  getAll
);


/*
 * GET /api/projects/:id
 */
router.get(
  "/:id",
  getSingle
);


/*
 * PATCH /api/projects/:id
 */
router.patch(
  "/:id",
  update
);


/*
 * DELETE /api/projects/:id
 */
router.delete(
  "/:id",
  remove
);

export default router;