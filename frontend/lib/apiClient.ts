import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "@/lib/authTokens";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type ApiFetchOptions = {
  onUnauthorized?: () => void;
};

export async function apiFetch(
  input: RequestInfo,
  init: RequestInit = {},
  options: ApiFetchOptions = {},
) {
  const accessToken = getAccessToken();
  const headers = new Headers(init.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const url =
    typeof input === "string" ? `${API_BASE_URL}${input}` : input;

  const response = await fetch(url, {
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

  const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!refreshResponse.ok) {
    clearTokens();
    options.onUnauthorized?.();
    return response;
  }

  const data = (await refreshResponse.json()) as { accessToken: string };
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
    headers.set("Authorization", `Bearer ${data.accessToken}`);
  }

  return fetch(url, {
    ...init,
    headers,
  });
}
