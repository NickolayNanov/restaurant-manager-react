import React, { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import type { AuthState, LoginRequest, UserInfo } from "./types";
import { apiFetch } from "../api/apiFetch";

type AuthContextValue = AuthState & {
    login: (req: LoginRequest) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Optional: avoid double call in React 18 StrictMode dev
  const didInit = useRef(false);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const data: UserInfo = await apiFetch("api/users/user-info");
      setUser(data);
    } catch (e: any) {
      // If your apiFetch throws with status:
      // if (e.status === 401) ...
      // Otherwise just treat as not authenticated.
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    void refresh();
  }, []);

  const login = async (req: LoginRequest) => {
    setIsLoading(true);
    try {
      await apiFetch("api/auth/login", {
        method: "POST",
        body: JSON.stringify(req),
      });

      await refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiFetch("api/auth/logout", { method: "POST" });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refresh,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
