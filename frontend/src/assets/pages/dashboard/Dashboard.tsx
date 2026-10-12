import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  FolderKanban,
  ListTodo,
  Plus,
  UserCircle,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

import AppLayout from "../../components/layout/AppLayout";

import {
  getProjects,
} from "../../services/project.service";

import {
  getProjectTasks,
} from "../../services/task.service";

import type {
  Project,
} from "../../types/project";

import type {
  Task,
} from "../../types/task";

const Dashboard = () => {
  const {
    user,
  } = useAuth();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const projectData =
        await getProjects();

      const safeProjects =
        Array.isArray(projectData)
          ? projectData
          : [];

      setProjects(safeProjects);

      const taskResults =
        await Promise.all(
          safeProjects.map(
            async (project) => {
              try {
                const projectTasks =
                  await getProjectTasks(
                    project.id
                  );

                return Array.isArray(
                  projectTasks
                )
                  ? projectTasks
                  : [];
              } catch (err) {
                console.error(
                  `Failed to load tasks for project ${project.id}:`,
                  err
                );

                return [];
              }
            }
          )
        );

      setTasks(
        taskResults.flat()
      );
    } catch (err) {
      console.error(
        "Failed to load dashboard:",
        err
      );

      setError(
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalProjects =
    projects.length;

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "DONE"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status !== "DONE"
    ).length;

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100
        )
      : 0;

  const recentProjects =
    [...projects]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      )
      .slice(0, 4);

  const recentTasks =
    [...tasks]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      )
      .slice(0, 5);

  const getStatusLabel = (
    status: Task["status"]
  ) => {
    switch (status) {
      case "TODO":
        return "To Do";

      case "IN_PROGRESS":
        return "In Progress";

      case "DONE":
        return "Completed";

      default:
        return status;
    }
  };

  const getStatusClasses = (
    status: Task["status"]
  ) => {
    switch (status) {
      case "DONE":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";

      case "IN_PROGRESS":
        return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";

      case "TODO":
      default:
        return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";
    }
  };

  const getProjectInitial = (
    title: string
  ) => {
    return title
      .charAt(0)
      .toUpperCase();
  };

  return (
    <AppLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              HERO
          ================================================== */}

          <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-5 py-6 shadow-sm sm:px-8 sm:py-8 lg:px-10 lg:py-10">

            {/* Decorative background */}

            <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              {/* HERO CONTENT */}

              <div className="max-w-2xl">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  Workspace Dashboard
                </div>

                <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Welcome back,{" "}
                  {user?.name?.split(" ")[0] ||
                    "there"}
                  .
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:mt-4 sm:text-base">
                  Stay on top of your projects,
                  manage your tasks, and keep
                  your team's work moving
                  forward.
                </p>

              </div>

              {/* NEW PROJECT */}

              <Link
                to="/projects"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md sm:w-fit"
              >
                <Plus size={18} />
                New Project
              </Link>

            </div>

          </section>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 sm:mt-6 sm:items-center">
              <span className="min-w-0">
                {error}
              </span>

              <button
                type="button"
                onClick={loadDashboard}
                className="shrink-0 font-semibold text-red-700 hover:text-red-800"
              >
                Retry
              </button>
            </div>
          )}

          {/* ==================================================
              STATS
          ================================================== */}

          <section className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

            {/* PROJECTS */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">

              <div className="flex items-start justify-between gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FolderKanban size={21} />
                </div>

                <span className="hidden rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-400 sm:inline-flex">
                  Workspace
                </span>

              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:mt-5 sm:text-3xl">
                {loading
                  ? "—"
                  : totalProjects}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Total projects
              </p>

            </div>

            {/* TASKS */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">

              <div className="flex items-start justify-between gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <ListTodo size={21} />
                </div>

                <span className="hidden rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-400 sm:inline-flex">
                  Work
                </span>

              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:mt-5 sm:text-3xl">
                {loading
                  ? "—"
                  : totalTasks}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Total tasks
              </p>

            </div>

            {/* COMPLETED */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">

              <div className="flex items-start justify-between gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={21} />
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                  {loading
                    ? "—"
                    : `${completionRate}%`}
                </span>

              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:mt-5 sm:text-3xl">
                {loading
                  ? "—"
                  : completedTasks}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Completed tasks
              </p>

            </div>

            {/* PENDING */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">

              <div className="flex items-start justify-between gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock3 size={21} />
                </div>

                <span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600 sm:inline-flex">
                  Attention
                </span>

              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:mt-5 sm:text-3xl">
                {loading
                  ? "—"
                  : pendingTasks}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Pending tasks
              </p>

            </div>

          </section>

          {/* ==================================================
              PROGRESS
          ================================================== */}

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={18}
                    className="text-emerald-600"
                  />

                  <h2 className="font-bold text-slate-900">
                    Overall Progress
                  </h2>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Your completed tasks across
                  all projects.
                </p>

              </div>

              <p className="text-2xl font-bold text-slate-900">
                {loading
                  ? "—"
                  : `${completionRate}%`}
              </p>

            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{
                  width: loading
                    ? "0%"
                    : `${completionRate}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>
                {loading
                  ? "Loading..."
                  : `${completedTasks} completed`}
              </span>

              <span>
                {loading
                  ? ""
                  : `${totalTasks} total`}
              </span>
            </div>

          </section>

          {/* ==================================================
              CONTENT GRID
          ================================================== */}

          <section className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-3">

            {/* ==================================================
                RECENT PROJECTS
            ================================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">

                <div className="min-w-0">

                  <h2 className="font-bold text-slate-900">
                    Recent Projects
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your latest workspace
                    activity
                  </p>

                </div>

                <Link
                  to="/projects"
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 sm:gap-1.5 sm:text-sm"
                >
                  View all

                  <ArrowRight size={16} />
                </Link>

              </div>

              <div className="divide-y divide-slate-100">

                {loading ? (
                  <div className="px-5 py-14 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading projects...
                    </p>
                  </div>
                ) : recentProjects.length === 0 ? (
                  <div className="px-5 py-14 text-center sm:px-6">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <FolderKanban
                        size={22}
                        className="text-slate-400"
                      />
                    </div>

                    <p className="mt-4 font-semibold text-slate-800">
                      No projects yet
                    </p>

                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                      Create your first project
                      and start organizing your
                      work.
                    </p>

                    <Link
                      to="/projects"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      Create Project
                    </Link>

                  </div>
                ) : (
                  recentProjects.map(
                    (project) => (
                      <div
                        key={project.id}
                        className="group flex items-center justify-between gap-3 px-4 py-4 transition-colors duration-150 hover:bg-slate-50 sm:gap-4 sm:px-6"
                      >

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                            {getProjectInitial(
                              project.title
                            )}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-slate-900">
                              {project.title}
                            </p>

                            <p className="mt-1 hidden truncate text-xs text-slate-500 sm:block">
                              {project.description ||
                                "No description provided."}
                            </p>

                          </div>

                        </div>

                        <Link
                          to={`/projects/${project.id}/tasks`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 opacity-70 transition-all duration-150 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm"
                          aria-label={`Open ${project.title} tasks`}
                        >
                          <ArrowRight size={18} />
                        </Link>

                      </div>
                    )
                  )
                )}

              </div>

            </div>

            {/* ==================================================
                RECENT TASKS
            ================================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5">

                <div className="min-w-0">

                  <h2 className="font-bold text-slate-900">
                    Recent Tasks
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Latest work items
                  </p>

                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                  <ListTodo
                    size={18}
                    className="text-slate-500"
                  />
                </div>

              </div>

              <div className="divide-y divide-slate-100">

                {loading ? (
                  <div className="px-5 py-14 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading tasks...
                    </p>
                  </div>
                ) : recentTasks.length === 0 ? (
                  <div className="px-5 py-14 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <Circle
                        size={22}
                        className="text-slate-400"
                      />
                    </div>

                    <p className="mt-4 font-semibold text-slate-800">
                      No tasks yet
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Tasks from your projects
                      will appear here.
                    </p>

                  </div>
                ) : (
                  recentTasks.map(
                    (task) => (
                      <div
                        key={task.id}
                        className="px-4 py-4 transition-colors hover:bg-slate-50 sm:px-5"
                      >

                        <div className="flex items-start gap-3">

                          {task.status === "DONE" ? (
                            <CheckCircle2
                              size={18}
                              className="mt-0.5 shrink-0 text-emerald-500"
                            />
                          ) : (
                            <Circle
                              size={18}
                              className="mt-0.5 shrink-0 text-slate-300"
                            />
                          )}

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-semibold text-slate-900">
                              {task.title}
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-center gap-2">

                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                                  task.status
                                )}`}
                              >
                                {getStatusLabel(
                                  task.status
                                )}
                              </span>

                              {task.dueDate && (
                                <span className="text-[11px] text-slate-400">
                                  Due{" "}
                                  {new Date(
                                    task.dueDate
                                  ).toLocaleDateString()}
                                </span>
                              )}

                            </div>

                          </div>

                        </div>

                      </div>
                    )
                  )
                )}

              </div>

            </div>

          </section>

          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mt-6">

            <div className="flex flex-col gap-5 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                    <Plus
                      size={18}
                      className="text-blue-600"
                    />
                  </div>

                  <h2 className="font-bold text-slate-900">
                    Quick Actions
                  </h2>

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Jump directly into your
                  workspace.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">

                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  <FolderKanban size={17} />
                  Projects
                </Link>

                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  <UserCircle size={17} />
                  Profile
                </Link>

              </div>

            </div>

          </section>

        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;