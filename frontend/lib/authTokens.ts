const ACCESS_TOKEN_KEY = "evervale_access_token";
const REFRESH_TOKEN_KEY = "evervale_refresh_token";
export const AUTH_TOKENS_UPDATED_EVENT = "evervale-auth-tokens-updated";

function emitAuthTokensUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_TOKENS_UPDATED_EVENT));
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  emitAuthTokensUpdated();
}

export function setRefreshToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  emitAuthTokensUpdated();
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  emitAuthTokensUpdated();
}
