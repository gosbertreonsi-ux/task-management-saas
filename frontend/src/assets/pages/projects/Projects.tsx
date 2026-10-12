import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowUpRight,
  CheckSquare,
  Edit,
  FolderKanban,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";

import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../../services/project.service";

import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "../../types/project";

import ProjectForm from "./ProjectForm";

const Projects = () => {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [deleteProjectTarget, setDeleteProjectTarget] =
    useState<Project | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getProjects();

      setProjects(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load projects:",
        err
      );

      setError(
        "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (
    data:
      | CreateProjectInput
      | UpdateProjectInput
  ) => {
    try {
      setError("");

      const project =
        await createProject({
          title: data.title ?? "",
          description:
            data.description,
        });

      setProjects((current) => [
        project,
        ...current,
      ]);

      setShowForm(false);
    } catch (err) {
      console.error(
        "Failed to create project:",
        err
      );

      setError(
        "Unable to create project."
      );

      throw err;
    }
  };

  const handleUpdate = async (
    data:
      | CreateProjectInput
      | UpdateProjectInput
  ) => {
    if (!editingProject) {
      return;
    }

    try {
      setError("");

      const updatedProject =
        await updateProject(
          editingProject.id,
          {
            title: data.title,
            description:
              data.description,
          }
        );

      setProjects((current) =>
        current.map((project) =>
          project.id ===
          editingProject.id
            ? updatedProject
            : project
        )
      );

      setEditingProject(null);
    } catch (err) {
      console.error(
        "Failed to update project:",
        err
      );

      setError(
        "Unable to update project."
      );

      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteProjectTarget) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteProject(
        deleteProjectTarget.id
      );

      setProjects((current) =>
        current.filter(
          (project) =>
            project.id !==
            deleteProjectTarget.id
        )
      );

      setDeleteProjectTarget(null);
    } catch (err) {
      console.error(
        "Failed to delete project:",
        err
      );

      setError(
        "Unable to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  const getProjectInitials = (
    title: string
  ) => {
    const words =
      title.trim().split(/\s+/);

    if (words.length >= 2) {
      return (
        words[0].charAt(0) +
        words[1].charAt(0)
      ).toUpperCase();
    }

    return title
      .charAt(0)
      .toUpperCase();
  };

  const filteredProjects = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.title
          .toLowerCase()
          .includes(query) ||
        project.description
          ?.toLowerCase()
          .includes(query)
    );
  }, [projects, search]);

  return (
    <AppLayout>
      <div className="min-w-0 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">

          {/* PAGE HEADER */}

          <section className="mb-6 sm:mb-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

              <div className="min-w-0">
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                    <FolderKanban
                      size={22}
                      className="text-blue-600"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      Workspace
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                      Projects
                    </h1>
                  </div>

                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Organize your team's work,
                  manage projects, and keep
                  everything moving forward.
                </p>
              </div>

              <Button
                type="button"
                size="lg"
                onClick={() =>
                  setShowForm(true)
                }
                className="w-full sm:w-fit"
              >
                <Plus size={18} />
                New Project
              </Button>

            </div>

            {/* SUMMARY */}

            {!loading &&
              projects.length > 0 && (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />

                    {projects.length}{" "}
                    {projects.length === 1
                      ? "project"
                      : "projects"}
                  </div>

                  <div className="hidden h-4 w-px bg-slate-200 sm:block" />

                  <p className="text-xs text-slate-400">
                    Manage your workspace
                    from here.
                  </p>

                </div>
              )}
          </section>

          {/* ERROR */}

          {error && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-red-700">
                {error}
              </p>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={loadProjects}
                className="self-start text-red-700 hover:bg-red-100 hover:text-red-800 sm:self-auto"
              >
                Retry
              </Button>
            </div>
          )}

          {/* SEARCH */}

          {!loading &&
            projects.length > 0 && (
              <div className="mb-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="w-full sm:max-w-md">
                    <Input
                      type="search"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search projects..."
                      aria-label="Search projects"
                      icon={
                        <Search size={17} />
                      }
                    />
                  </div>

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                    >
                      <X size={14} />
                      Clear search
                    </button>
                  )}

                </div>
              </div>
            )}

          {/* LOADING */}

          {loading && (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <Card
                    key={item}
                    className="animate-pulse"
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-slate-200" />

                        <div>
                          <div className="h-4 w-32 rounded bg-slate-200" />

                          <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
                        </div>
                      </div>

                      <div className="h-9 w-9 rounded-xl bg-slate-100" />

                    </div>

                    <div className="mt-6 h-4 rounded bg-slate-100" />

                    <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />

                    <div className="mt-7 h-px bg-slate-100" />

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="h-10 rounded-xl bg-slate-100" />
                      <div className="h-10 rounded-xl bg-slate-100" />
                    </div>
                  </Card>
                )
              )}

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            projects.length === 0 && (
              <EmptyState
                icon={
                  <FolderKanban
                    size={28}
                    className="text-blue-600"
                  />
                }
                title="Your workspace is empty"
                description="Create your first project to start organizing tasks, members, and your team's work."
                action={
                  <Button
                    type="button"
                    onClick={() =>
                      setShowForm(true)
                    }
                  >
                    <Plus size={18} />
                    Create Project
                  </Button>
                }
              />
            )}

          {/* NO SEARCH RESULTS */}

          {!loading &&
            projects.length > 0 &&
            filteredProjects.length === 0 && (
              <EmptyState
                icon={
                  <Search
                    size={28}
                    className="text-blue-600"
                  />
                }
                title="No projects found"
                description={`No projects match "${search}". Try a different search term.`}
                action={
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setSearch("")
                    }
                  >
                    Clear Search
                  </Button>
                }
              />
            )}

          {/* PROJECT GRID */}

          {!loading &&
            filteredProjects.length > 0 && (
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">

                {filteredProjects.map(
                  (project) => (
                    <Card
                      key={project.id}
                      padding="none"
                      hover
                      className="group relative overflow-hidden"
                    >
                      {/* TOP ACCENT */}

                      <div className="absolute inset-x-0 top-0 h-1 bg-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                      <div className="p-5 sm:p-6">

                        {/* CARD HEADER */}

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                              {getProjectInitials(
                                project.title
                              )}
                            </div>

                            <div className="min-w-0">
                              <h2 className="truncate text-base font-bold text-slate-900">
                                {project.title}
                              </h2>

                              <p className="mt-1 text-xs text-slate-400">
                                Project #{project.id}
                              </p>
                            </div>

                          </div>

                          <Link
                            to={`/projects/${project.id}/tasks`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                            aria-label={`Open ${project.title}`}
                            title="Open project"
                          >
                            <ArrowUpRight
                              size={18}
                            />
                          </Link>

                        </div>

                        {/* DESCRIPTION */}

                        <p className="mt-5 min-h-[72px] text-sm leading-6 text-slate-500">
                          {project.description ||
                            "No description provided for this project."}
                        </p>

                        {/* META */}

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Created
                            </p>

                            <p className="mt-1 text-xs font-medium text-slate-600">
                              {new Date(
                                project.createdAt
                              ).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                            <FolderKanban
                              size={16}
                              className="text-slate-400"
                            />
                          </div>

                        </div>

                        {/* PRIMARY ACTIONS */}

                        <div className="mt-5 grid grid-cols-2 gap-2">

                          <Link
                            to={`/projects/${project.id}/tasks`}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
                          >
                            <CheckSquare
                              size={16}
                            />
                            Tasks
                          </Link>

                          <Link
                            to={`/projects/${project.id}/members`}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                          >
                            <Users
                              size={16}
                            />
                            Members
                          </Link>

                        </div>

                        {/* SECONDARY ACTIONS */}

                        <div className="mt-2 grid grid-cols-2 gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              setEditingProject(
                                project
                              )
                            }
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Edit
                              size={15}
                            />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteProjectTarget(
                                project
                              )
                            }
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2
                              size={15}
                            />
                            Delete
                          </button>

                        </div>

                      </div>
                    </Card>
                  )
                )}

              </div>
            )}

        </div>
      </div>

      {/* CREATE PROJECT */}

      {showForm && (
        <ProjectForm
          onSubmit={handleCreate}
          onCancel={() =>
            setShowForm(false)
          }
        />
      )}

      {/* EDIT PROJECT */}

      {editingProject && (
        <ProjectForm
          initialData={{
            title:
              editingProject.title,
            description:
              editingProject.description ||
              "",
          }}
          onSubmit={handleUpdate}
          onCancel={() =>
            setEditingProject(null)
          }
          submitLabel="Save Changes"
        />
      )}

      {/* DELETE CONFIRMATION */}

      <Modal
        isOpen={
          Boolean(deleteProjectTarget)
        }
        onClose={() => {
          if (!deleting) {
            setDeleteProjectTarget(null);
          }
        }}
        title="Delete project?"
        description="This action cannot be undone."
        size="sm"
      >
        <div className="space-y-5">

          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm leading-6 text-red-700">
              Are you sure you want to delete{" "}
              <span className="font-bold">
                "{deleteProjectTarget?.title}"
              </span>
              ?
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setDeleteProjectTarget(null)
              }
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="danger"
              loading={deleting}
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Delete Project
            </Button>

          </div>

        </div>
      </Modal>
    </AppLayout>
  );
};

export default Projects;