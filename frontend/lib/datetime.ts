/**
 * Shared date/time formatting.
 *
 * All API timestamps are UTC ISO strings; `new Date(...)` parses them into
 * an absolute instant and `Intl.DateTimeFormat(undefined, …)` renders it in
 * the user's local timezone and locale. Never hardcode a timezone or add a
 * manual offset here.
 */

/** "Jul 13, 2026, 4:55 PM" (in the viewer's locale + timezone), or null. */
export function formatDateTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/** "Jul 13, 2026" (in the viewer's locale + timezone), or null. */
export function formatDateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    date,
  );
}
