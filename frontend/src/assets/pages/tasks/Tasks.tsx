import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  Plus,
  Trash2,
  UserCircle,
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Alert from "../../components/ui/Alert";
import EmptyState from "../../components/ui/EmptyState";

import {
  getProjectMembers,
} from "../../services/project.service";

import {
  createTask,
  deleteTask,
  getProjectTasks,
  updateTask,
  updateTaskStatus,
} from "../../services/task.service";

import type {
  ProjectMember,
} from "../../types/member";

import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "../../types/task";

import TaskForm from "./TaskForm";

type FilterStatus =
  | "ALL"
  | TaskStatus;

const Tasks = () => {
  const { projectId } =
    useParams<{
      projectId: string;
    }>();

  const numericProjectId =
    Number(projectId);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [members, setMembers] =
    useState<ProjectMember[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState<FilterStatus>("ALL");

  const [showForm, setShowForm] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [updatingTaskId, setUpdatingTaskId] =
    useState<number | null>(null);

  // ============================================
  // LOAD DATA
  // ============================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        taskData,
        memberData,
      ] = await Promise.all([
        getProjectTasks(
          numericProjectId
        ),
        getProjectMembers(
          numericProjectId
        ),
      ]);

      setTasks(
        Array.isArray(taskData)
          ? taskData
          : []
      );

      setMembers(
        Array.isArray(memberData)
          ? memberData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load tasks:",
        err
      );

      setError(
        "Unable to load project tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    if (
      Number.isNaN(
        numericProjectId
      ) ||
      numericProjectId <= 0
    ) {
      setError(
        "Invalid project."
      );

      setLoading(false);

      return;
    }

    loadData();
  }, [numericProjectId]);

  // ============================================
  // FILTERED TASKS
  // ============================================

  const filteredTasks =
    useMemo(() => {
      if (filter === "ALL") {
        return tasks;
      }

      return tasks.filter(
        (task) =>
          task.status === filter
      );
    }, [tasks, filter]);

  // ============================================
  // TASK COUNTS
  // ============================================

  const todoCount =
    tasks.filter(
      (task) =>
        task.status === "TODO"
    ).length;

  const inProgressCount =
    tasks.filter(
      (task) =>
        task.status === "IN_PROGRESS"
    ).length;

  const completedCount =
    tasks.filter(
      (task) =>
        task.status === "DONE"
    ).length;

  // ============================================
  // CREATE TASK
  // ============================================

  const handleCreate = async (
    data:
      | CreateTaskInput
      | UpdateTaskInput
  ) => {
    try {
      setError("");

      const task =
        await createTask(
          numericProjectId,
          {
            title:
              data.title ?? "",
            description:
              data.description,
            dueDate:
              data.dueDate,
            assignedToId:
              "assignedToId" in data
                ? data.assignedToId
                : members[0]?.userId ?? 0,
          }
        );

      setTasks((current) => [
        task,
        ...current,
      ]);

      setShowForm(false);
    } catch (err) {
      console.error(
        "Failed to create task:",
        err
      );

      setError(
        "Unable to create task."
      );
    }
  };

  // ============================================
  // UPDATE TASK
  // ============================================

  const handleUpdate = async (
    data:
      | CreateTaskInput
      | UpdateTaskInput
  ) => {
    if (!editingTask) {
      return;
    }

    try {
      setError("");

      const updatedTask =
        await updateTask(
          editingTask.id,
          {
            title:
              data.title,
            description:
              data.description,
            dueDate:
              data.dueDate,
          }
        );

      setTasks((current) =>
        current.map((task) =>
          task.id ===
          editingTask.id
            ? updatedTask
            : task
        )
      );

      setEditingTask(null);
    } catch (err) {
      console.error(
        "Failed to update task:",
        err
      );

      setError(
        "Unable to update task."
      );
    }
  };

  // ============================================
  // UPDATE STATUS
  // ============================================

  const handleStatusChange =
    async (
      task: Task,
      status: TaskStatus
    ) => {
      if (
        task.status === status
      ) {
        return;
      }

      try {
        setUpdatingTaskId(
          task.id
        );

        setError("");

        const updatedTask =
          await updateTaskStatus(
            task.id,
            {
              status,
            }
          );

        setTasks((current) =>
          current.map((item) =>
            item.id === task.id
              ? updatedTask
              : item
          )
        );
      } catch (err) {
        console.error(
          "Failed to update task status:",
          err
        );

        setError(
          "Unable to update task status."
        );
      } finally {
        setUpdatingTaskId(null);
      }
    };

  // ============================================
  // DELETE TASK
  // ============================================

  const handleDelete = async (
    task: Task
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${task.title}"? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingTaskId(
        task.id
      );

      setError("");

      await deleteTask(
        task.id
      );

      setTasks((current) =>
        current.filter(
          (item) =>
            item.id !== task.id
        )
      );
    } catch (err) {
      console.error(
        "Failed to delete task:",
        err
      );

      setError(
        "Unable to delete task."
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // ============================================
  // STATUS HELPERS
  // ============================================

  const getStatusVariant = (
    status: TaskStatus
  ) => {
    switch (status) {
      case "DONE":
        return "green" as const;

      case "IN_PROGRESS":
        return "yellow" as const;

      default:
        return "slate" as const;
    }
  };

  const getStatusLabel = (
    status: TaskStatus
  ) => {
    switch (status) {
      case "DONE":
        return "Completed";

      case "IN_PROGRESS":
        return "In Progress";

      default:
        return "To Do";
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <section className="mb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
                >
                  <ArrowLeft
                    size={17}
                  />

                  Back to Projects
                </Link>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                    <ListTodo
                      size={23}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      Project Workspace
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                      Tasks
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      Manage and track the work
                      for this project.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={() =>
                  setShowForm(true)
                }
                disabled={
                  members.length === 0
                }
                size="lg"
              >
                <Plus
                  size={18}
                />

                New Task
              </Button>
            </div>
          </section>

          {/* ERROR */}

          {error && (
            <div className="mb-6">
              <Alert
                message={error}
                variant="error"
                onClose={() =>
                  setError("")
                }
              />

              <button
                type="button"
                onClick={loadData}
                className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* SUMMARY */}

          {!loading && (
            <section className="mb-6 grid gap-3 sm:grid-cols-4">

              <button
                type="button"
                onClick={() =>
                  setFilter("ALL")
                }
                className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                  filter === "ALL"
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      filter === "ALL"
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    All Tasks
                  </span>

                  <ListTodo
                    size={17}
                    className={
                      filter === "ALL"
                        ? "text-slate-300"
                        : "text-slate-400"
                    }
                  />
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {tasks.length}
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFilter("TODO")
                }
                className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                  filter === "TODO"
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      filter === "TODO"
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    To Do
                  </span>

                  <Circle
                    size={17}
                    className={
                      filter === "TODO"
                        ? "text-slate-300"
                        : "text-slate-400"
                    }
                  />
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {todoCount}
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFilter(
                    "IN_PROGRESS"
                  )
                }
                className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                  filter === "IN_PROGRESS"
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      filter === "IN_PROGRESS"
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    In Progress
                  </span>

                  <Clock3
                    size={17}
                    className={
                      filter === "IN_PROGRESS"
                        ? "text-slate-300"
                        : "text-slate-400"
                    }
                  />
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {inProgressCount}
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFilter("DONE")
                }
                className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                  filter === "DONE"
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      filter === "DONE"
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    Completed
                  </span>

                  <CheckCircle2
                    size={17}
                    className={
                      filter === "DONE"
                        ? "text-slate-300"
                        : "text-emerald-500"
                    }
                  />
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {completedCount}
                </p>
              </button>

            </section>
          )}

          {/* FILTER BAR */}

          <Card
            padding="sm"
            className="mb-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Task List
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {loading
                    ? "Loading tasks..."
                    : `${filteredTasks.length} ${
                        filteredTasks.length ===
                        1
                          ? "task"
                          : "tasks"
                      } shown`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "ALL",
                    "TODO",
                    "IN_PROGRESS",
                    "DONE",
                  ] as FilterStatus[]
                ).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setFilter(
                          status
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                        filter === status
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {status ===
                      "ALL"
                        ? "All"
                        : getStatusLabel(
                            status
                          )}
                    </button>
                  )
                )}
              </div>
            </div>
          </Card>

          {/* LOADING */}

          {loading && (
            <div className="grid gap-5 lg:grid-cols-2">
              {[1, 2, 3, 4].map(
                (item) => (
                  <Card
                    key={item}
                    className="animate-pulse"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-5 w-5 rounded-full bg-slate-200" />

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-4">
                          <div className="h-5 w-2/3 rounded bg-slate-200" />

                          <div className="h-6 w-20 rounded-full bg-slate-100" />
                        </div>

                        <div className="mt-4 h-4 w-full rounded bg-slate-100" />

                        <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />

                        <div className="mt-5 h-4 w-1/2 rounded bg-slate-100" />

                        <div className="mt-6 border-t border-slate-100 pt-4">
                          <div className="flex gap-2">
                            <div className="h-9 w-24 rounded-lg bg-slate-100" />
                            <div className="h-9 w-16 rounded-lg bg-slate-100" />
                            <div className="h-9 w-20 rounded-lg bg-slate-100" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>
          )}

          {/* EMPTY STATE */}

          {!loading &&
            filteredTasks.length ===
              0 && (
              <EmptyState
                icon={
                  <ListTodo
                    size={28}
                    className="text-blue-600"
                  />
                }
                title="No tasks found"
                description={
                  tasks.length ===
                  0
                    ? "Create your first task to start tracking project work."
                    : "There are no tasks matching the selected filter."
                }
                action={
                  tasks.length ===
                    0 &&
                  members.length >
                    0 ? (
                    <Button
                      type="button"
                      onClick={() =>
                        setShowForm(
                          true
                        )
                      }
                    >
                      <Plus
                        size={18}
                      />

                      Create Task
                    </Button>
                  ) : undefined
                }
              />
            )}

          {/* TASK GRID */}

          {!loading &&
            filteredTasks.length >
              0 && (
              <div className="grid gap-5 lg:grid-cols-2">

                {filteredTasks.map(
                  (task) => (
                    <Card
                      key={task.id}
                      padding="none"
                      hover
                      className="relative overflow-hidden"
                    >

                      <div
                        className={`absolute inset-x-0 top-0 h-1 ${
                          task.status ===
                          "DONE"
                            ? "bg-emerald-500"
                            : task.status ===
                                "IN_PROGRESS"
                              ? "bg-amber-500"
                              : "bg-blue-600"
                        }`}
                      />

                      <div className="p-5 sm:p-6">
                        <div className="flex items-start gap-4">

                          <div className="mt-1 shrink-0">
                            {task.status ===
                            "DONE" ? (
                              <CheckCircle2
                                size={22}
                                className="text-emerald-500"
                              />
                            ) : task.status ===
                              "IN_PROGRESS" ? (
                              <Clock3
                                size={22}
                                className="text-amber-500"
                              />
                            ) : (
                              <Circle
                                size={22}
                                className="text-slate-300"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                              <div className="min-w-0">
                                <h2 className="break-words text-lg font-bold text-slate-900">
                                  {task.title}
                                </h2>

                                <p className="mt-1 text-[11px] font-medium text-slate-400">
                                  Task #{task.id}
                                </p>
                              </div>

                              <Badge
                                variant={getStatusVariant(
                                  task.status
                                )}
                              >
                                {getStatusLabel(
                                  task.status
                                )}
                              </Badge>

                            </div>

                            <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-500">
                              {task.description ||
                                "No description provided."}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">

                              {task.assignedTo && (
                                <span className="inline-flex min-w-0 items-center gap-1.5">
                                  <UserCircle
                                    size={15}
                                    className="shrink-0 text-slate-400"
                                  />

                                  <span className="truncate">
                                    {
                                      task
                                        .assignedTo
                                        .name
                                    }
                                  </span>
                                </span>
                              )}

                              {task.dueDate && (
                                <span className="inline-flex items-center gap-1.5">
                                  <CalendarDays
                                    size={15}
                                    className="text-slate-400"
                                  />

                                  Due{" "}
                                  {new Date(
                                    task.dueDate
                                  ).toLocaleDateString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                              )}

                            </div>

                            <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center">

                              <select
                                value={
                                  task.status
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleStatusChange(
                                    task,
                                    event
                                      .target
                                      .value as TaskStatus
                                  )
                                }
                                disabled={
                                  updatingTaskId ===
                                  task.id
                                }
                                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                              >
                                <option value="TODO">
                                  To Do
                                </option>

                                <option value="IN_PROGRESS">
                                  In Progress
                                </option>

                                <option value="DONE">
                                  Completed
                                </option>
                              </select>

                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  setEditingTask(
                                    task
                                  )
                                }
                                disabled={
                                  updatingTaskId ===
                                  task.id
                                }
                              >
                                Edit
                              </Button>

                              <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleDelete(
                                    task
                                  )
                                }
                                disabled={
                                  updatingTaskId ===
                                  task.id
                                }
                                loading={
                                  updatingTaskId ===
                                  task.id
                                }
                              >
                                <Trash2
                                  size={14}
                                />

                                Delete
                              </Button>

                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                )}

              </div>
            )}

          {/* MEMBER WARNING */}

          {!loading &&
            members.length ===
              0 && (
              <div className="mt-6">
                <Alert
                  message="No project members. Add at least one project member before creating tasks."
                  variant="warning"
                />

                <Link
                  to={`/projects/${numericProjectId}/members`}
                  className="mt-2 inline-flex text-sm font-bold text-amber-700 underline underline-offset-2 hover:text-amber-800"
                >
                  Manage project members
                </Link>
              </div>
            )}

        </div>
      </div>

      {/* CREATE TASK */}

      {showForm && (
        <TaskForm
          members={members}
          onSubmit={handleCreate}
          onCancel={() =>
            setShowForm(false)
          }
        />
      )}

      {/* EDIT TASK */}

      {editingTask && (
        <TaskForm
          members={members}
          initialData={{
            title:
              editingTask.title,
            description:
              editingTask.description ||
              "",
            dueDate:
              editingTask.dueDate ||
              "",
            assignedToId:
              editingTask.assignedToId,
          }}
          onSubmit={handleUpdate}
          onCancel={() =>
            setEditingTask(null)
          }
          submitLabel="Save Changes"
        />
      )}

    </AppLayout>
  );
};

export default Tasks;