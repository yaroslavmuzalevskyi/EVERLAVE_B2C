"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CopyValueProps = {
  /** Full value written to the clipboard — never the shortened display. */
  value: string;
  /** What to render (e.g. a middle-shortened address). Defaults to `value`. */
  display?: string;
  /** Accessible description, e.g. "Copy Bitcoin address". */
  label: string;
  className?: string;
};

/**
 * Mono-spaced value that copies its FULL value on click, with a transient
 * "Copied!" confirmation. Used for Bitcoin addresses, txHashes and amounts,
 * which are shown shortened but must always copy complete.
 */
export default function CopyValue({
  value,
  display,
  label,
  className,
}: CopyValueProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — user can select manually.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={value}
      aria-label={label}
      className={cn(
        "group inline-flex max-w-full items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-left font-mono transition hover:bg-current/5",
        className,
      )}
    >
      <span className="break-all">{display ?? value}</span>
      {/* Inherit the surrounding text color so this works on light and dark surfaces. */}
      <span
        aria-hidden="true"
        className={cn(
          "shrink-0 text-[10px] font-sans uppercase tracking-wide",
          copied ? "text-green-600" : "opacity-40 group-hover:opacity-80",
        )}
      >
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}
