"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { backendApi } from "@/lib/api/backend";

interface AuthContextValue {
  isLoggedIn: boolean;
  username: string | null;
  role: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("userRole");
    setUsername(token ? storedUser : null);
    setRole(token ? storedRole : null);
  }, []);

  useEffect(() => {
    refresh();
    const token = localStorage.getItem("authToken");
    if (token) {
      backendApi.auth
        .getProfile()
        .then((res) => {
          const nextRole = res.data.role ?? "User";
          localStorage.setItem("userRole", nextRole);
          setRole(nextRole);
          if (res.data.username) {
            localStorage.setItem("username", res.data.username);
            setUsername(res.data.username);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refresh]);

  const login = useCallback(async (user: string, password: string) => {
    const { data } = await backendApi.auth.login({ username: user, password });
    if (!data.token) throw new Error("Invalid credentials");
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("username", user);
    const nextRole = data.role ?? "User";
    localStorage.setItem("userRole", nextRole);
    setUsername(user);
    setRole(nextRole);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setUsername(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn: !!username,
      username,
      role,
      isAdmin: role === "Admin",
      isLoading,
      login,
      logout,
      refresh,
    }),
    [username, role, isLoading, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
