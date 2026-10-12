import express from "express";

import cors from "cors";

import { env } from "./config/env";

import {
  notFound,
} from "./middlewares/not-found.middleware";

import {
  errorHandler,
} from "./middlewares/error.middleware";

import authRoutes from "./modules/auth/auth.routes";

import userRoutes from "./modules/users/user.routes";

import projectRoutes from "./modules/projects/project.routes";

import memberRoutes from "./modules/project-member/projectMember.routes";

import taskRoutes from "./modules/tasks/task.routes";

import singleTaskRoutes from "./modules/tasks/task.single.routes";

import {
  authenticate,
} from "./middlewares/auth.middleware";

import {
  authorize,
} from "./middlewares/role.middleware";


const app = express();


/*
 * ============================================================
 * CORS
 * ============================================================
 */

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);


/*
 * ============================================================
 * BODY PARSER
 * ============================================================
 */

app.use(
  express.json()
);


/*
 * ============================================================
 * HEALTH CHECK
 * ============================================================
 */

app.get(
  "/api/health",
  (_req, res) => {
    return res.status(200).json({
      message:
        "Task Management SaaS API is running",
    });
  }
);


/*
 * ============================================================
 * AUTH
 * ============================================================
 */

app.use(
  "/api/auth",
  authRoutes
);


/*
 * ============================================================
 * TEST PROTECTED ROUTE
 * ============================================================
 */

app.get(
  "/api/test/protected",
  authenticate,
  (req, res) => {
    return res.status(200).json({
      message:
        "You accessed a protected route",

      user: req.user,
    });
  }
);


/*
 * ============================================================
 * TEST ADMIN ROUTE
 * ============================================================
 */

app.get(
  "/api/test/admin",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    return res.status(200).json({
      message:
        "You accessed an ADMIN-only route",

      user: req.user,
    });
  }
);


/*
 * ============================================================
 * USERS
 * ============================================================
 */

app.use(
  "/api/users",
  userRoutes
);


/*
 * ============================================================
 * PROJECTS
 * ============================================================
 */

app.use(
  "/api/projects",
  projectRoutes
);


/*
 * ============================================================
 * PROJECT MEMBERS
 * ============================================================
 */

app.use(
  "/api/projects/:id/members",
  memberRoutes
);


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

app.use(
  "/api/projects/:projectId/tasks",
  taskRoutes
);


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

app.use(
  "/api/tasks",
  singleTaskRoutes
);


/*
 * ============================================================
 * 404
 * ============================================================
 */

app.use(
  notFound
);


/*
 * ============================================================
 * ERROR HANDLER
 * ============================================================
 */

app.use(
  errorHandler
);


export default app;