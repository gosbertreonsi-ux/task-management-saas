import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  register as registerService,
} from "../../services/auth.service";

const Register = () => {
  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (name.trim().length < 2) {
      setError(
        "Name must be at least 2 characters."
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      await registerService({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
        },
      });
    } catch (error: any) {
      const validationErrors =
        error.response?.data?.errors;

      if (
        Array.isArray(validationErrors) &&
        validationErrors.length > 0
      ) {
        setError(
          validationErrors
            .map(
              (item: {
                message: string;
              }) => item.message
            )
            .join(" ")
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to create account."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
            T
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Create your account
          </h1>

          <p className="mt-2 text-slate-500">
            Start managing your projects and tasks
          </p>

        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="John Doe"
                autoComplete="name"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>


            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>


            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            <div>

              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>


          <div className="mt-6 text-center text-sm text-slate-600">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
};

export default Register;