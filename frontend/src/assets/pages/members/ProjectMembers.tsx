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
  Mail,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Alert from "../../components/ui/Alert";
import EmptyState from "../../components/ui/EmptyState";

import {
  addProjectMember,
  getAvailableProjectMembers,
  getProjectMembers,
  removeProjectMember,
  getProjectById,
} from "../../services/project.service";

import {
  useAuth,
} from "../../context/AuthContext";

import type {
  ProjectMember,
  User,
} from "../../types/member";

const ProjectMembers = () => {
  const {
    projectId,
  } = useParams<{
    projectId: string;
  }>();

  const {
    user: currentUser,
  } = useAuth();

  const numericProjectId =
    Number(projectId);

  const [members, setMembers] =
    useState<ProjectMember[]>([]);

  const [availableUsers, setAvailableUsers] =
    useState<User[]>([]);

  const [projectOwnerId, setProjectOwnerId] =
    useState<number | null>(null);

  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [adding, setAdding] =
    useState(false);

  const [removingUserId, setRemovingUserId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const canManageMembers =
    currentUser?.role === "ADMIN" ||
    currentUser?.id === projectOwnerId;

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        project,
        memberData,
      ] = await Promise.all([
        getProjectById(
          numericProjectId
        ),

        getProjectMembers(
          numericProjectId
        ),
      ]);

      setProjectOwnerId(
        project.ownerId
      );

      setMembers(
        Array.isArray(memberData)
          ? memberData
          : []
      );

      if (
        currentUser?.role === "ADMIN" ||
        project.ownerId === currentUser?.id
      ) {
        const users =
          await getAvailableProjectMembers(
            numericProjectId
          );

        setAvailableUsers(
          Array.isArray(users)
            ? users
            : []
        );
      } else {
        setAvailableUsers([]);
      }
    } catch (err) {
      console.error(
        "Failed to load project members:",
        err
      );

      setError(
        "Unable to load project members."
      );
    } finally {
      setLoading(false);
    }
  };

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
  }, [
    numericProjectId,
    currentUser?.id,
    currentUser?.role,
  ]);

  const selectableUsers =
    useMemo(() => {
      const memberIds =
        new Set(
          members.map(
            (member) =>
              member.userId
          )
        );

      return availableUsers.filter(
        (user) =>
          !memberIds.has(user.id) &&
          user.id !== projectOwnerId
      );
    }, [
      members,
      availableUsers,
      projectOwnerId,
    ]);

  const handleAddMember =
    async () => {
      if (!canManageMembers) {
        setError(
          "You do not have permission to add members."
        );

        return;
      }

      const userId =
        Number(selectedUserId);

      if (!userId) {
        setError(
          "Please select a user."
        );

        return;
      }

      try {
        setAdding(true);
        setError("");

        const member =
          await addProjectMember(
            numericProjectId,
            {
              userId,
            }
          );

        setMembers((current) => [
          ...current,
          member,
        ]);

        setAvailableUsers(
          (current) =>
            current.filter(
              (user) =>
                user.id !== userId
            )
        );

        setSelectedUserId("");
      } catch (err) {
        console.error(
          "Failed to add project member:",
          err
        );

        setError(
          "Unable to add member."
        );
      } finally {
        setAdding(false);
      }
    };

  const handleRemoveMember =
    async (
      member: ProjectMember
    ) => {
      if (!canManageMembers) {
        setError(
          "You do not have permission to remove members."
        );

        return;
      }

      if (
        member.userId ===
        projectOwnerId
      ) {
        setError(
          "The project owner cannot be removed from the project."
        );

        return;
      }

      const confirmed =
        window.confirm(
          `Remove ${member.user.name} from this project?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setRemovingUserId(
          member.userId
        );

        setError("");

        await removeProjectMember(
          numericProjectId,
          member.userId
        );

        setMembers((current) =>
          current.filter(
            (item) =>
              item.userId !==
              member.userId
          )
        );

        setAvailableUsers(
          (current) => {
            const alreadyExists =
              current.some(
                (user) =>
                  user.id ===
                  member.user.id
              );

            if (alreadyExists) {
              return current;
            }

            return [
              ...current,
              {
                id: member.user.id,
                name: member.user.name,
                email: member.user.email,
                role: member.user.role,
              },
            ];
          }
        );
      } catch (err) {
        console.error(
          "Failed to remove member:",
          err
        );

        setError(
          "Unable to remove member."
        );
      } finally {
        setRemovingUserId(
          null
        );
      }
    };

  const getInitials = (
    name: string
  ) => {
    const words =
      name.trim().split(/\s+/);

    if (words.length >= 2) {
      return (
        words[0].charAt(0) +
        words[1].charAt(0)
      ).toUpperCase();
    }

    return name
      .charAt(0)
      .toUpperCase();
  };

  const getProjectRole = (
    member: ProjectMember,
    isOwner: boolean
  ) => {
    if (isOwner) {
      return "OWNER";
    }

    return member.role || "MEMBER";
  };

  const getRoleVariant = (
    role: string
  ) => {
    switch (role) {
      case "OWNER":
        return "blue" as const;

      case "ADMIN":
        return "purple" as const;

      default:
        return "slate" as const;
    }
  };

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-5xl">

          {/* HEADER */}

          <section className="mb-8">

            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft
                size={17}
              />
              Back to Projects
            </Link>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                  <Users
                    size={23}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Team Management
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Project Members
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Manage the people working on
                    this project.
                  </p>
                </div>

              </div>

              <Badge
                variant="blue"
                icon={
                  <Users
                    size={14}
                  />
                }
              >
                {loading
                  ? "Loading..."
                  : `${members.length} ${
                      members.length === 1
                        ? "member"
                        : "members"
                    }`}
              </Badge>

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

              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={loadData}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* ADD MEMBER */}

          {canManageMembers && (
            <Card
              padding="none"
              className="overflow-hidden"
            >
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <UserPlus
                      size={19}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Add Member
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Invite an existing user to
                      this project.
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-5 sm:p-6">

                <div className="flex flex-col gap-3 sm:flex-row">

                  <div className="min-w-0 flex-1">

                    <label
                      htmlFor="member"
                      className="sr-only"
                    >
                      Select a user
                    </label>

                    <select
                      id="member"
                      value={
                        selectedUserId
                      }
                      onChange={(event) =>
                        setSelectedUserId(
                          event.target.value
                        )
                      }
                      disabled={
                        loading ||
                        adding ||
                        selectableUsers.length ===
                          0
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">
                        {selectableUsers.length ===
                        0
                          ? "No available users"
                          : "Select a user to add"}
                      </option>

                      {selectableUsers.map(
                        (user) => (
                          <option
                            key={
                              user.id
                            }
                            value={
                              user.id
                            }
                          >
                            {user.name} —{" "}
                            {user.email}
                          </option>
                        )
                      )}
                    </select>

                  </div>

                  <Button
                    type="button"
                    onClick={
                      handleAddMember
                    }
                    loading={adding}
                    disabled={
                      adding ||
                      !selectedUserId ||
                      selectableUsers.length ===
                        0
                    }
                  >
                    <Plus
                      size={18}
                    />

                    {adding
                      ? "Adding..."
                      : "Add Member"}
                  </Button>

                </div>

                {selectableUsers.length ===
                  0 &&
                  !loading && (
                    <p className="mt-3 text-xs text-slate-400">
                      All available users are
                      already members of this
                      project.
                    </p>
                  )}

              </div>
            </Card>
          )}

          {/* MEMBER LIST */}

          <Card
            padding="none"
            className={
              canManageMembers
                ? "mt-6 overflow-hidden"
                : "overflow-hidden"
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

              <div>
                <div className="flex items-center gap-2">

                  <h2 className="font-bold text-slate-900">
                    Team Members
                  </h2>

                  <Badge variant="slate">
                    {loading
                      ? "—"
                      : members.length}
                  </Badge>

                </div>

                <p className="mt-1 text-xs text-slate-500">
                  People currently assigned to
                  this project.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
                <Users
                  size={18}
                  className="text-slate-400"
                />
              </div>

            </div>

            {/* LOADING */}

            {loading && (
              <div className="divide-y divide-slate-100">

                {[1, 2, 3, 4].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 px-5 py-5 sm:px-6"
                    >

                      <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />

                      <div className="min-w-0 flex-1">

                        <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />

                        <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-100" />

                      </div>

                      <div className="hidden h-9 w-20 animate-pulse rounded-xl bg-slate-100 sm:block" />

                    </div>
                  )
                )}

              </div>
            )}

            {/* EMPTY */}

            {!loading &&
              members.length === 0 && (
                <EmptyState
                  icon={
                    <Users
                      size={25}
                    />
                  }
                  title="No members yet"
                  description="Add people to start collaborating on this project."
                />
              )}

            {/* MEMBERS */}

            {!loading &&
              members.length > 0 && (
                <div className="divide-y divide-slate-100">

                  {members.map(
                    (member) => {

                      const isOwner =
                        member.userId ===
                        projectOwnerId;

                      const projectRole =
                        getProjectRole(
                          member,
                          isOwner
                        );

                      return (
                        <div
                          key={
                            member.id
                          }
                          className="group flex flex-col gap-4 px-5 py-5 transition-colors duration-150 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                        >

                          {/* INFO */}

                          <div className="flex min-w-0 items-center gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 ring-4 ring-white">
                              {getInitials(
                                member.user.name
                              )}
                            </div>

                            <div className="min-w-0">

                              <div className="flex flex-wrap items-center gap-2">

                                <p className="truncate text-sm font-bold text-slate-900">
                                  {
                                    member.user.name
                                  }
                                </p>

                                <Badge
                                  variant={getRoleVariant(
                                    projectRole
                                  )}
                                >
                                  {
                                    projectRole
                                  }
                                </Badge>

                              </div>

                              <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-xs text-slate-500 sm:text-sm">

                                <Mail
                                  size={14}
                                  className="shrink-0 text-slate-400"
                                />

                                <span className="truncate">
                                  {
                                    member.user.email
                                  }
                                </span>

                              </div>

                              <p className="mt-1 text-[11px] text-slate-400">
                                Account role:{" "}
                                <span className="font-semibold text-slate-500">
                                  {
                                    member.user.role.name
                                  }
                                </span>
                              </p>

                            </div>

                          </div>

                          {/* ACTION */}

                          {canManageMembers &&
                            !isOwner && (
                              <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleRemoveMember(
                                    member
                                  )
                                }
                                loading={
                                  removingUserId ===
                                  member.userId
                                }
                                disabled={
                                  removingUserId ===
                                  member.userId
                                }
                                className="self-stretch sm:self-auto"
                              >
                                <Trash2
                                  size={16}
                                />

                                {removingUserId ===
                                member.userId
                                  ? "Removing..."
                                  : "Remove"}
                              </Button>
                            )}

                          {/* OWNER */}

                          {isOwner &&
                            canManageMembers && (
                              <Badge
                                variant="blue"
                                className="hidden"
                              >
                                Project Owner
                              </Badge>
                            )}

                        </div>
                      );
                    }
                  )}

                </div>
              )}

          </Card>

        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectMembers;