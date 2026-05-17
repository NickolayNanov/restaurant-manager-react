/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthState, LoginRequest, RegisterRequest, UserInfo } from "./types";
import { apiFetch, SESSION_EXPIRED_EVENT } from "../api/apiFetch";

type AuthContextValue = AuthState & {
    login: (req: LoginRequest) => Promise<void>;
    register: (req: RegisterRequest) => Promise<void>;
    logout: () => void;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const didInit = useRef(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data: UserInfo = await apiFetch("api/users/user-info", {
        authMode: "silent",
        showToast: false,
      });
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setIsLoading(false);
      navigate("/login", {
        replace: true,
        state: { message: "Your session expired. Please sign in again." },
      });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [navigate]);

  const login = useCallback(async (req: LoginRequest) => {
    setIsLoading(true);
    try {
      await apiFetch("api/auth/login", {
        method: "POST",
        body: JSON.stringify(req),
        authMode: "silent",
        showToast: false,
      });

      await refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const register = useCallback(async (req: RegisterRequest) => {
    await apiFetch("api/users", {
      method: "POST",
      body: JSON.stringify(req),
      authMode: "silent",
      showToast: false,
    });
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiFetch("api/auth/logout", { method: "POST", showToast: false });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refresh,
    }),
    [user, isLoading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
