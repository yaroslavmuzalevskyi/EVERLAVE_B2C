"use client";

import { useMemo } from "react";

type FilterOption = {
  label: string;
  value: string;
};

type FilterDropdownProps = {
  id: string;
  label: string;
  options: FilterOption[];
  selected: string;
  open: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string, value: string) => void;
  placeholder?: string;
  variant?: "default" | "price";
  minPrice?: string;
  maxPrice?: string;
  onMinPriceChange?: (value: string) => void;
  onMaxPriceChange?: (value: string) => void;
};

export default function FilterDropdown({
  id,
  label,
  options,
  selected,
  open,
  onToggle,
  onSelect,
  placeholder,
  variant = "default",
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: FilterDropdownProps) {
  const selectedLabel = useMemo(() => {
    const found = options.find((option) => option.value === selected);
    return found ? found.label : "";
  }, [options, selected]);

  const isActive = Boolean(selected);
  const buttonLabel = isActive ? selectedLabel || label : label;

  const isPrice = variant === "price";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs transition ${
          isActive ? "bg-pr_w text-pr_dg" : "bg-sr_dg text-pr_w"
        }`}
      >
        <span>{buttonLabel}</span>
        <span className={`text-[10px] transition ${open ? "rotate-180" : ""}`}>
          ⌄
        </span>
      </button>

      <div
        className={`absolute left-0 z-20 mt-2 origin-top-left rounded-2xl bg-sr_dg p-3 text-xs text-pr_w shadow-lg transition ${
          isPrice ? "w-64" : "w-44"
        } ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {isPrice ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-pr_w/80">Minimum</p>
              <div className="mt-2 flex items-center rounded-full bg-pr_w px-3 py-2">
                <span className="text-sm font-semibold text-pr_dg">€</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={minPrice ?? ""}
                  onChange={(event) =>
                    onMinPriceChange?.(event.target.value)
                  }
                  className="w-full bg-transparent px-2 text-sm font-semibold text-pr_dg outline-none placeholder:text-pr_dg/40"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-pr_w/80">Maximum</p>
              <div className="mt-2 flex items-center rounded-full bg-pr_w px-3 py-2">
                <span className="text-sm font-semibold text-pr_dg">€</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={maxPrice ?? ""}
                  onChange={(event) =>
                    onMaxPriceChange?.(event.target.value)
                  }
                  className="w-full bg-transparent px-2 text-sm font-semibold text-pr_dg outline-none placeholder:text-pr_dg/40"
                  placeholder="500"
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="w-full rounded-lg px-3 py-2 text-left text-pr_w/70 hover:bg-pr_w/10"
              onClick={() => onSelect(id, "")}
            >
              {placeholder ?? "Any"}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`w-full rounded-lg px-3 py-2 text-left transition ${
                  option.value === selected ? "bg-pr_w/15" : "hover:bg-pr_w/10"
                }`}
                onClick={() => onSelect(id, option.value)}
              >
                {option.label}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
