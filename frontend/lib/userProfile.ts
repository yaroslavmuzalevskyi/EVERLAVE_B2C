const PROFILE_NAME_KEY = "evervale_profile_name";
const PROFILE_EMAIL_KEY = "evervale_profile_email";

function canUseStorage() {
  return typeof window !== "undefined";
}

function userNameKey(email?: string) {
  if (email) return `evervale_profile_name_${email.trim().toLowerCase()}`;
  // Fall back to current email in storage
  const stored = canUseStorage() ? window.localStorage.getItem(PROFILE_EMAIL_KEY) : null;
  if (stored) return `evervale_profile_name_${stored}`;
  return PROFILE_NAME_KEY;
}

export function getStoredProfileName() {
  if (!canUseStorage()) return "";
  // Try per-user key first, fall back to legacy key
  const key = userNameKey();
  return window.localStorage.getItem(key) || window.localStorage.getItem(PROFILE_NAME_KEY) || "";
}

export function setStoredProfileName(name: string, email?: string) {
  if (!canUseStorage()) return;
  const trimmedName = name.trim();
  if (!trimmedName) return;
  const key = userNameKey(email);
  window.localStorage.setItem(key, trimmedName);
  // Also write legacy key for backwards compat
  window.localStorage.setItem(PROFILE_NAME_KEY, trimmedName);
}

export function getStoredProfileEmail() {
  if (!canUseStorage()) return "";
  return window.localStorage.getItem(PROFILE_EMAIL_KEY) || "";
}

export function setStoredProfileEmail(email: string) {
  if (!canUseStorage()) return;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;
  window.localStorage.setItem(PROFILE_EMAIL_KEY, normalized);
}
