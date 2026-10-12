import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Shield,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  deleteUser,
  getUsers,
  updateUser,
} from "../../services/user.service";

import type {
  User,
} from "../../types/user";

const Users = () => {
  const {
    user: currentUser,
  } = useAuth();

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getUsers();

      setUsers(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (
    user: User,
    role: "ADMIN" | "MEMBER"
  ) => {
    if (user.role === role) {
      return;
    }

    try {
      setActionLoading(user.id);
      setError("");

      const updated =
        await updateUser(
          user.id,
          { role }
        );

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? updated
            : item
        )
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update user role."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (
    user: User
  ) => {
    if (
      user.id ===
      currentUser?.id
    ) {
      setError(
        "You cannot delete your own account from the admin panel."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete ${user.name}? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user.id);
      setError("");

      await deleteUser(
        user.id
      );

      setUsers((current) =>
        current.filter(
          (item) =>
            item.id !== user.id
        )
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (
    currentUser?.role !==
    "ADMIN"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <Shield
            size={48}
            className="mx-auto mb-4 text-slate-300"
          />

          <h1 className="text-2xl font-bold text-slate-900">
            Access denied
          </h1>

          <p className="mt-2 text-slate-500">
            You need administrator privileges to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-8">
          <div className="mb-3 inline-flex rounded-xl bg-slate-900 p-3 text-white">
            <UsersRound size={22} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            User Management
          </h1>

          <p className="mt-1 text-slate-500">
            Manage users, roles and access to the workspace.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-bold text-slate-900">
              All Users
            </h2>

            <p className="text-sm text-slate-500">
              {users.length} registered users
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                size={32}
                className="animate-spin text-slate-400"
              />
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <UserRound
                size={42}
                className="mx-auto mb-4 text-slate-300"
              />

              <h3 className="font-semibold text-slate-900">
                No users found
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">
                      User
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>

                    <th className="px-6 py-4">
                      ID
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map(
                    (user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                              {user.name
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {user.name}
                              </p>

                              <p className="text-sm text-slate-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <select
                            value={
                              user.role
                            }
                            disabled={
                              actionLoading ===
                              user.id
                            }
                            onChange={(
                              event
                            ) =>
                              handleRoleChange(
                                user,
                                event
                                  .target
                                  .value as
                                  | "ADMIN"
                                  | "MEMBER"
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-slate-900"
                          >
                            <option value="MEMBER">
                              MEMBER
                            </option>

                            <option value="ADMIN">
                              ADMIN
                            </option>
                          </select>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          #{user.id}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() =>
                              handleDelete(
                                user
                              )
                            }
                            disabled={
                              actionLoading ===
                                user.id ||
                              user.id ===
                                currentUser?.id
                            }
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                            title="Delete user"
                          >
                            {actionLoading ===
                            user.id ? (
                              <Loader2
                                size={18}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={18}
                              />
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;