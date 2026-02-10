"use client";

import { cn } from "@/lib/utils";

type TextInputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

export default function TextInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-pr_dg">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-full border px-4 py-3 text-sm text-pr_dg placeholder:text-pr_dg/50 focus:outline-none",
          error ? "border-pr_dr" : "border-pr_dg/30",
        )}
      />
      {error ? <p className="text-xs text-pr_dr">{error}</p> : null}
    </div>
  );
}
