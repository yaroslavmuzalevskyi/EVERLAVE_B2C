"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/lib/authTokens";

type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedAccess = getAccessToken();
      const storedRefresh = getRefreshToken();

      if (storedAccess) {
        setAccessTokenState(storedAccess);
        setIsInitializing(false);
        return;
      }

      if (storedRefresh) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: storedRefresh }),
          });
          if (response.ok) {
            const data = (await response.json()) as { accessToken: string };
            if (data?.accessToken) {
              setAccessToken(data.accessToken);
              setAccessTokenState(data.accessToken);
            }
          } else {
            clearTokens();
          }
        } catch {
          clearTokens();
        }
      }
      setIsInitializing(false);
    };

    init();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.message || "Invalid credentials");
    }

    const data = (await response.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setAccessTokenState(data.accessToken);
    },
    [],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.message || "Registration failed");
    }

    const data = (await response.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setAccessTokenState(data.accessToken);
    },
    [],
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } finally {
      clearTokens();
      setAccessTokenState(null);
      router.push("/");
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isInitializing,
      login,
      register,
      logout,
    }),
    [accessToken, isInitializing, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
