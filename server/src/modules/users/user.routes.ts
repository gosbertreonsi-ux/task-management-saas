import { Router } from "express";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/role.middleware";

import {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  removeUser,
} from "./user.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getAllUsers
);

router.get(
  "/:id",
  authenticate,
  getSingleUser
);

router.patch(
  "/:id",
  authenticate,
  updateSingleUser
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  removeUser
);

export default router;