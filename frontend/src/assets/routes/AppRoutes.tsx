import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// ============================================
// AUTH PAGES
// ============================================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// ============================================
// DASHBOARD
// ============================================

import Dashboard from "../pages/dashboard/Dashboard";

// ============================================
// PROJECTS
// ============================================

import Projects from "../pages/projects/Projects";

// ============================================
// MEMBERS
// ============================================

import Members from "../pages/members/Members";
import ProjectMembers from "../pages/members/ProjectMembers";

// ============================================
// TASKS
// ============================================

import Tasks from "../pages/tasks/Tasks";

// ============================================
// PROFILE
// ============================================

import Profile from "../pages/profile/Profile";

// ============================================
// USERS
// ============================================

import Users from "../pages/users/Users";

// ============================================
// ROUTE PROTECTION
// ============================================

import ProtectedRoute from "./ProtectedRoute";

// ============================================
// 404 PAGE
// ============================================

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="text-center">

        <h1 className="text-7xl font-bold text-slate-900">
          404
        </h1>

        <p className="mt-4 text-slate-500">
          Page not found.
        </p>

        <a
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Go to Dashboard
        </a>

      </div>
    </div>
  );
};

// ============================================
// APP ROUTES
// ============================================

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ======================================================
            PUBLIC ROUTES
        ====================================================== */}

        {/* Login */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ======================================================
            PROTECTED ROUTES
        ====================================================== */}

        <Route
          element={<ProtectedRoute />}
        >

          {/* ==================================================
              DASHBOARD
          ================================================== */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* ==================================================
              PROJECTS
          ================================================== */}

          <Route
            path="/projects"
            element={<Projects />}
          />

          {/* ==================================================
              MEMBERS
              
              General Members page.
              
              User selects a project and is then taken to:
              /projects/:projectId/members
          ================================================== */}

          <Route
            path="/members"
            element={<Members />}
          />

          {/* ==================================================
              PROJECT MEMBERS
              
              Members belonging to one specific project.
          ================================================== */}

          <Route
            path="/projects/:projectId/members"
            element={<ProjectMembers />}
          />

          {/* ==================================================
              PROJECT TASKS
              
              Tasks belonging to one specific project.
          ================================================== */}

          <Route
            path="/projects/:projectId/tasks"
            element={<Tasks />}
          />

          {/* ==================================================
              PROFILE
          ================================================== */}

          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* ==================================================
              ADMIN USERS
              
              Global user management page.
          ================================================== */}

          <Route
            path="/users"
            element={<Users />}
          />

          {/* ==================================================
              GENERAL TASKS LINK
              
              There is no standalone Tasks page.
              Send users to Projects where they can
              select a project and manage its tasks.
          ================================================== */}

          <Route
            path="/tasks"
            element={
              <Navigate
                to="/projects"
                replace
              />
            }
          />

        </Route>

        {/* ======================================================
            ROOT ROUTE
        ====================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* ======================================================
            404
        ====================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;