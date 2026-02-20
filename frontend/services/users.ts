import { apiFetch } from "@/lib/apiClient";

type ApiErrorPayload = {
  message?: string;
  error?: string;
};

function isHtmlLike(value: string) {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.startsWith("<!doctype") ||
    normalized.startsWith("<html") ||
    normalized.includes("<body") ||
    normalized.includes("</html>")
  );
}

function sanitizeMessage(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function readApiError(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const payload = isJson
    ? ((await response.json().catch(() => ({}))) as ApiErrorPayload)
    : {};
  const text = isJson ? "" : (await response.text().catch(() => "")).trim();
  const payloadMessage = payload?.message || payload?.error || "";
  const rawMessage = payloadMessage || text;
  const safeMessage = rawMessage
    ? isHtmlLike(rawMessage)
      ? ""
      : sanitizeMessage(rawMessage)
    : "";

  return {
    status: response.status,
    message: safeMessage,
  };
}

export async function updateMyName(name: string) {
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 100) {
    throw new Error("Name must be between 2 and 100 characters");
  }

  const response = await apiFetch("/users/me/name", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: trimmedName }),
  });

  if (!response.ok) {
    const error = await readApiError(response);
    throw new Error(error.message || "Failed to update name");
  }

  const data = (await response.json()) as { success?: boolean; name?: string };
  return {
    success: Boolean(data.success),
    name: typeof data.name === "string" ? data.name : trimmedName,
  };
}

export async function updateMyPassword(
  currentPassword: string,
  newPassword: string,
) {
  if (!currentPassword.trim()) {
    throw new Error("Current password is required");
  }
  if (newPassword.length < 8 || newPassword.length > 128) {
    throw new Error("New password must be 8-128 characters");
  }

  const response = await apiFetch("/users/me/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  if (!response.ok) {
    const error = await readApiError(response);
    const normalized = error.message.toLowerCase();
    const isServerInternalError =
      error.status >= 500 &&
      (!error.message || normalized.includes("internal server error"));

    const isCurrentPasswordError =
      normalized.includes("current password") &&
      (normalized.includes("incorrect") ||
        normalized.includes("invalid") ||
        normalized.includes("wrong"));

    if (
      isCurrentPasswordError ||
      (error.status === 400 && !error.message) ||
      isServerInternalError
    ) {
      throw new Error("Current password is incorrect");
    }

    if (error.status === 401) {
      throw new Error("Your session expired. Please sign in again.");
    }

    throw new Error(error.message || "Failed to update password");
  }

  return { success: true };
}
