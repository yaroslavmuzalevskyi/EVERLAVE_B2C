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
  AUTH_TOKENS_UPDATED_EVENT,
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
const DISABLE_AUTH = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

type AuthTokenPair = {
  accessToken?: string;
  refreshToken?: string;
};

function getStringToken(
  source: Record<string, unknown> | undefined,
  keys: string[],
) {
  if (!source) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function extractAuthTokens(payload: unknown): AuthTokenPair {
  if (!payload || typeof payload !== "object") return {};

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : undefined;
  const rootTokens =
    root.tokens && typeof root.tokens === "object"
      ? (root.tokens as Record<string, unknown>)
      : undefined;
  const dataTokens =
    data?.tokens && typeof data.tokens === "object"
      ? (data.tokens as Record<string, unknown>)
      : undefined;

  const accessToken =
    getStringToken(root, ["accessToken", "access_token"]) ||
    getStringToken(data, ["accessToken", "access_token"]) ||
    getStringToken(rootTokens, ["accessToken", "access_token"]) ||
    getStringToken(dataTokens, ["accessToken", "access_token"]);

  const refreshToken =
    getStringToken(root, ["refreshToken", "refresh_token"]) ||
    getStringToken(data, ["refreshToken", "refresh_token"]) ||
    getStringToken(rootTokens, ["refreshToken", "refresh_token"]) ||
    getStringToken(dataTokens, ["refreshToken", "refresh_token"]);

  return { accessToken, refreshToken };
}

function buildAuthCandidateUrls(path: string) {
  if (API_BASE_URL) return [`${API_BASE_URL}${path}`];
  return [path];
}

async function fetchAuthWithFallback(path: string, init: RequestInit = {}) {
  const urls = buildAuthCandidateUrls(path);
  let lastError: unknown;

  for (let index = 0; index < urls.length; index += 1) {
    const url = urls[index];
    try {
      const response = await fetch(url, init);
      if (response.status >= 500 && index < urls.length - 1) {
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;
      const hasNext = index < urls.length - 1;
      if (hasNext) continue;
      throw error;
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error("Failed to fetch");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (DISABLE_AUTH) {
      setAccessTokenState("dev");
      setIsInitializing(false);
      return;
    }
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
          const response = await fetchAuthWithFallback("/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Support both refresh payload formats.
            body: JSON.stringify({
              refreshToken: storedRefresh,
              token: storedRefresh,
            }),
          });
          if (response.ok) {
            const data = extractAuthTokens(
              await response.json().catch(() => ({})),
            );
            if (data?.accessToken) {
              setAccessToken(data.accessToken);
              setAccessTokenState(data.accessToken);
              if (data?.refreshToken) {
                setRefreshToken(data.refreshToken);
              }
            } else {
              clearTokens();
              setAccessTokenState(null);
            }
          } else {
            clearTokens();
            setAccessTokenState(null);
          }
        } catch {
          clearTokens();
          setAccessTokenState(null);
        }
      }
      setIsInitializing(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (DISABLE_AUTH || typeof window === "undefined") return;

    const syncAuthState = () => {
      setAccessTokenState(getAccessToken());
    };

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key.includes("evervale_")) {
        syncAuthState();
      }
    };

    window.addEventListener(AUTH_TOKENS_UPDATED_EVENT, syncAuthState);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(AUTH_TOKENS_UPDATED_EVENT, syncAuthState);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const applyTokens = useCallback((data?: {
    accessToken?: string;
    refreshToken?: string;
  }) => {
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      setAccessTokenState(data.accessToken);
    }
    if (data?.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      if (DISABLE_AUTH) {
        setAccessTokenState("dev");
        return;
      }
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetchAuthWithFallback("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.message || "Invalid credentials");
      }

      const data = (await response.json()) as {
        accessToken?: string;
        refreshToken?: string;
      };
      const tokens = extractAuthTokens(data);

      if (!tokens.accessToken) {
        throw new Error("Login succeeded but no access token was returned");
      }

      applyTokens(tokens);
    },
    [applyTokens],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      if (DISABLE_AUTH) {
        setAccessTokenState("dev");
        return;
      }
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetchAuthWithFallback("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.message || "Registration failed");
      }

      const data = extractAuthTokens(await response.json().catch(() => ({})));

      if (data?.accessToken) {
        applyTokens(data);
        return;
      }

      await login(normalizedEmail, password);
    },
    [applyTokens, login],
  );

  const logout = useCallback(async () => {
    if (DISABLE_AUTH) {
      setAccessTokenState("dev");
      return;
    }
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await fetchAuthWithFallback("/auth/logout", {
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
      isAuthenticated: DISABLE_AUTH ? true : Boolean(accessToken),
      isInitializing: DISABLE_AUTH ? false : isInitializing,
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
