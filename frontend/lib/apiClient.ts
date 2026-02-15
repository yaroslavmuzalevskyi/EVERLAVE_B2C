import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/lib/authTokens";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

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

function buildCandidateUrls(path: string) {
  if (API_BASE_URL) return [`${API_BASE_URL}${path}`];
  return [path];
}

async function fetchWithFallback(
  path: string,
  init: RequestInit,
  retryOnProxyError = true,
) {
  const urls = buildCandidateUrls(path);
  let lastError: unknown;

  for (let index = 0; index < urls.length; index += 1) {
    const url = urls[index];
    try {
      const response = await fetch(url, init);
      if (retryOnProxyError && response.status >= 500 && index < urls.length - 1) {
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

type ApiFetchOptions = {
  onUnauthorized?: () => void;
};

export async function apiFetch(
  input: RequestInfo,
  init: RequestInit = {},
  options: ApiFetchOptions = {},
) {
  if (typeof input !== "string") {
    throw new Error("apiFetch currently expects a string path input");
  }

  const accessToken = getAccessToken();
  const headers = new Headers(init.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetchWithFallback(input, {
    ...init,
    headers,
  });

  if (response.status !== 401) return response;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    options.onUnauthorized?.();
    return response;
  }

  const refreshResponse = await fetchWithFallback(
    "/auth/refresh",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Support both backend payload variants while keeping backward compatibility.
      body: JSON.stringify({ refreshToken, token: refreshToken }),
    },
    true,
  );

  if (!refreshResponse.ok) {
    clearTokens();
    options.onUnauthorized?.();
    return response;
  }

  const data = extractAuthTokens(await refreshResponse.json().catch(() => ({})));
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
    headers.set("Authorization", `Bearer ${data.accessToken}`);
  } else {
    clearTokens();
    options.onUnauthorized?.();
    return response;
  }
  if (data?.refreshToken) {
    setRefreshToken(data.refreshToken);
  }

  return fetchWithFallback(input, {
    ...init,
    headers,
  });
}
