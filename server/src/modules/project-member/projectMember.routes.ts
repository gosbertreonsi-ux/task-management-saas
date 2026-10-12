import { Router } from "express";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  create,
  getAll,
  getAvailable,
  remove,
} from "./projectMember.controller";

const router = Router({
  mergeParams: true,
});


/*
 * Authentication
 */

router.use(
  authenticate
);


/*
 * GET
 * /api/projects/:id/members
 */

router.get(
  "/",
  getAll
);


/*
 * GET
 * /api/projects/:id/members/available
 */

router.get(
  "/available",
  getAvailable
);


/*
 * POST
 * /api/projects/:id/members
 */

router.post(
  "/",
  create
);


/*
 * DELETE
 * /api/projects/:id/members/:userId
 */

router.delete(
  "/:userId",
  remove
);


export default router;