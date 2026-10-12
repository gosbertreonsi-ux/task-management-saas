import {
  useEffect,
  useState,
} from "react";

import {
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Alert from "../../components/ui/Alert";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  updateUser,
} from "../../services/user.service";

const Profile = () => {
  const {
    user,
    token,
    login,
  } = useAuth();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setEmail(user.email || "");
  }, [user]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!token) {
      setError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    try {
      setLoading(true);

const updatedUser =
  await updateUser(user!.id, {
    name: name.trim(),
    email: email.trim(),
    ...(password.trim()
      ? {
          password:
            password.trim(),
        }
      : {}),
  });

      login(
        token,
        updatedUser
      );

      setPassword("");

      setSuccess(
        "Your profile has been updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      setError(
        "Unable to update your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-4xl">

          {/* ====================================
              HEADER
          ==================================== */}

          <div className="mb-6">
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <User
                  size={21}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Profile
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your account information
                  and security settings.
                </p>
              </div>

            </div>
          </div>

          {/* ====================================
              ALERTS
          ==================================== */}

          {error && (
            <div className="mb-4">
              <Alert
                message={error}
                variant="error"
                onClose={() =>
                  setError("")
                }
              />
            </div>
          )}

          {success && (
            <div className="mb-4">
              <Alert
                message={success}
                variant="success"
                onClose={() =>
                  setSuccess("")
                }
              />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">

            {/* ==================================
                ACCOUNT SUMMARY
            ================================== */}

            <Card className="h-fit">

              <div className="flex flex-col items-center text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-blue-600">
                  {user?.name
                    ?.charAt(0)
                    .toUpperCase() ||
                    "U"}
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  {user?.name ||
                    "User"}
                </h2>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {user?.email}
                </p>

                <div className="mt-4">
                  <Badge
                    variant={
                      user?.role ===
                      "ADMIN"
                        ? "purple"
                        : "slate"
                    }
                  >
                    {user?.role ||
                      "MEMBER"}
                  </Badge>
                </div>

              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50">
                    <ShieldCheck
                      size={17}
                      className="text-slate-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      ACCOUNT ROLE
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-700">
                      {user?.role ===
                      "ADMIN"
                        ? "Administrator"
                        : "Member"}
                    </p>
                  </div>

                </div>

              </div>

            </Card>

            {/* ==================================
                PROFILE FORM
            ================================== */}

            <Card
              className="lg:col-span-2"
            >

              <div className="mb-6">

                <h2 className="text-lg font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the information
                  associated with your account.
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <Input
                  id="profile-name"
                  label="Full name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Enter your name"
                  icon={
                    <User size={18} />
                  }
                  autoComplete="name"
                />

                <Input
                  id="profile-email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="Enter your email"
                  icon={
                    <Mail size={18} />
                  }
                  autoComplete="email"
                />

                <div className="border-t border-slate-100 pt-5">

                  <h3 className="text-sm font-bold text-slate-900">
                    Change Password
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Leave this field empty if you
                    do not want to change your
                    password.
                  </p>

                </div>

                <Input
                  id="profile-password"
                  label="New password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter a new password"
                  autoComplete="new-password"
                />

                <div className="flex justify-end border-t border-slate-100 pt-5">

                  <Button
                    type="submit"
                    loading={loading}
                    size="lg"
                  >
                    {loading
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>

                </div>

              </form>

            </Card>

          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;