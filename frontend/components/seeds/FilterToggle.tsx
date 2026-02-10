"use client";

type FilterToggleProps = {
  label: string;
  active: boolean;
  onToggle: () => void;
};

export default function FilterToggle({
  label,
  active,
  onToggle,
}: FilterToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs transition ${
        active ? "bg-pr_w text-pr_dg" : "bg-sr_dg text-pr_w"
      }`}
    >
      <span>{label}</span>
      {active ? <span className="text-[10px]">✕</span> : null}
    </button>
  );
}
