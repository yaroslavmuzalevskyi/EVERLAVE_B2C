const PROFILE_NAME_KEY = "evervale_profile_name";
const PROFILE_EMAIL_KEY = "evervale_profile_email";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getStoredProfileName() {
  if (!canUseStorage()) return "";
  return window.localStorage.getItem(PROFILE_NAME_KEY) || "";
}

export function setStoredProfileName(name: string) {
  if (!canUseStorage()) return;
  const trimmedName = name.trim();
  if (!trimmedName) return;
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
