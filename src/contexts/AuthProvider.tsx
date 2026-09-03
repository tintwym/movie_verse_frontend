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
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("username");
    setUsername(token ? storedUser : null);
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const login = useCallback(async (user: string, password: string) => {
    const { data } = await backendApi.auth.login({ username: user, password });
    if (!data.token) throw new Error("Invalid credentials");
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("username", user);
    setUsername(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setUsername(null);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn: !!username,
      username,
      isLoading,
      login,
      logout,
      refresh,
    }),
    [username, isLoading, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
