import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;

  token: string | null;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;

  isAuthenticated: boolean;
}

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

interface AuthProviderProps {
  children: ReactNode;
};

/*
|--------------------------------------------------------------------------
| Normalize User
|--------------------------------------------------------------------------
*/

const normalizeUser = (
  user: any
): User => {
  const role =
    typeof user.role === "string"
      ? user.role
      : user.role?.name;

  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
    role:
      role === "ADMIN"
        ? "ADMIN"
        : "MEMBER",
  };
};

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [token, setToken] =
    useState<string | null>(() => {
      return localStorage.getItem(
        "token"
      );
    });

  const [user, setUser] =
    useState<User | null>(() => {
      const storedUser =
        localStorage.getItem(
          "user"
        );

      if (!storedUser) {
        return null;
      }

      try {
        const parsedUser =
          JSON.parse(
            storedUser
          );

        return normalizeUser(
          parsedUser
        );
      } catch {
        localStorage.removeItem(
          "user"
        );

        return null;
      }
    });

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  const login = (
    newToken: string,
    newUser: User
  ) => {
    const normalizedUser =
      normalizeUser(
        newUser
      );

    localStorage.setItem(
      "token",
      newToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(
        normalizedUser
      )
    );

    setToken(newToken);
    setUser(normalizedUser);
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken(null);
    setUser(null);
  };

  const isAuthenticated =
    Boolean(
      token && user
    );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};