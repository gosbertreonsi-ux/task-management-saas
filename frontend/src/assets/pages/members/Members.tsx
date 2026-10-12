import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  FolderKanban,
  Search,
  Users,
  X,
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";

import {
  getProjects,
} from "../../services/project.service";

import type {
  Project,
} from "../../types/project";

const Members = () => {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

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
                    <Users
                      size={22}
                      className="text-blue-600"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      Team Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                      Members
                    </h1>
                  </div>

                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Select a project to view and
                  manage the people working on
                  it.
                </p>
              </div>

              {!loading &&
                projects.length > 0 && (
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />

                    {projects.length}{" "}
                    {projects.length === 1
                      ? "project"
                      : "projects"}
                  </div>
                )}

            </div>
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
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

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

                      <div className="h-11 w-11 rounded-xl bg-slate-200" />

                      <div className="h-9 w-9 rounded-xl bg-slate-100" />

                    </div>

                    <div className="mt-6 h-5 w-2/3 rounded bg-slate-200" />

                    <div className="mt-3 h-4 w-full rounded bg-slate-100" />

                    <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />

                    <div className="mt-6 h-10 w-full rounded-xl bg-slate-200" />

                    <div className="mt-2 h-9 w-full rounded-xl bg-slate-100" />
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
                title="No projects yet"
                description="You need a project before you can view and manage its members."
                action={
                  <Link to="/projects">
                    <Button type="button">
                      Go to Projects
                      <ArrowRight
                        size={17}
                      />
                    </Button>
                  </Link>
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
                      {/* ACCENT */}

                      <div className="absolute inset-x-0 top-0 h-1 bg-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                      <div className="p-5 sm:p-6">

                        {/* HEADER */}

                        <div className="flex items-start justify-between gap-4">

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

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 transition group-hover:bg-blue-50">
                            <Users
                              size={17}
                              className="text-slate-400 transition group-hover:text-blue-600"
                            />
                          </div>

                        </div>

                        {/* DESCRIPTION */}

                        <p className="mt-6 min-h-[72px] text-sm leading-6 text-slate-500">
                          {project.description ||
                            "No project description available."}
                        </p>

                        {/* META */}

                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

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

                          <div className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                            Team
                          </div>

                        </div>

                        {/* MANAGE MEMBERS */}

                        <Link
                          to={`/projects/${project.id}/members`}
                          className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
                        >
                          <Users
                            size={17}
                          />

                          Manage Members

                          <ArrowRight
                            size={16}
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        </Link>

                        {/* VIEW TASKS */}

                        <Link
                          to={`/projects/${project.id}/tasks`}
                          className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <FolderKanban
                            size={15}
                          />

                          View Project

                          <ArrowRight
                            size={14}
                          />
                        </Link>

                      </div>
                    </Card>
                  )
                )}

              </div>
            )}

        </div>
      </div>
    </AppLayout>
  );
};

export default Members;