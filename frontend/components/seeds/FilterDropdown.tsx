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
  selectedValues?: string[];
  open: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string, value: string) => void;
  onToggleValue?: (id: string, value: string) => void;
  placeholder?: string;
  variant?: "default" | "price" | "range" | "number";
  minPrice?: string;
  maxPrice?: string;
  onMinPriceChange?: (value: string) => void;
  onMaxPriceChange?: (value: string) => void;
  inputPrefix?: string;
  inputSuffix?: string;
  minLabel?: string;
  maxLabel?: string;
  multi?: boolean;
};

export default function FilterDropdown({
  id,
  label,
  options,
  selected,
  selectedValues = [],
  open,
  onToggle,
  onSelect,
  onToggleValue,
  placeholder,
  variant = "default",
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  inputPrefix,
  inputSuffix,
  minLabel,
  maxLabel,
  multi = false,
}: FilterDropdownProps) {
  const selectedLabel = useMemo(() => {
    if (multi && selectedValues.length > 0) {
      return `${label} (${selectedValues.length})`;
    }
    const found = options.find((option) => option.value === selected);
    return found ? found.label : "";
  }, [options, selected, selectedValues, multi, label]);

  const isInputVariant = variant !== "default";
  const isActive = isInputVariant
    ? Boolean(minPrice || maxPrice)
    : multi
      ? selectedValues.length > 0
      : Boolean(selected);
  const buttonLabel = isInputVariant ? label : isActive ? selectedLabel || label : label;

  const isPrice = variant === "price";
  const isRange = variant === "range";
  const isNumber = variant === "number";
  const isInput = isPrice || isRange || isNumber;
  const showMax = !isNumber;
  const prefix = isPrice ? "€" : inputPrefix ?? "";
  const suffix = inputSuffix ?? "";
  const minTitle = minLabel ?? "Minimum";
  const maxTitle = maxLabel ?? "Maximum";

  return (
    <div className="relative z-[120] w-full sm:w-auto" data-no-reveal="true">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={`inline-flex w-full items-center justify-between gap-2 rounded-full px-4 py-2 text-xs transition sm:w-auto sm:justify-start ${
          isActive ? "bg-pr_w text-pr_dg" : "bg-sr_dg text-pr_w"
        }`}
      >
        <span>{buttonLabel}</span>
        <span className={`text-[10px] transition ${open ? "rotate-180" : ""}`}>
          ⌄
        </span>
      </button>

      <div
        className={`z-[130] mt-2 w-full rounded-2xl bg-sr_dg p-3 text-xs text-pr_w shadow-lg sm:absolute sm:left-0 sm:origin-top-left sm:transition ${
          isInput ? "sm:w-64" : "sm:w-44"
        } ${
          open
            ? "block scale-100 opacity-100"
            : "hidden sm:block sm:pointer-events-none sm:scale-95 sm:opacity-0"
        }`}
      >
        {isInput ? (
          <div className={`grid gap-4 ${showMax ? "grid-cols-2" : "grid-cols-1"}`}>
            <div>
              <p className="text-xs text-pr_w/80">{minTitle}</p>
              <div className="mt-2 flex items-center rounded-full bg-pr_w px-3 py-2">
                {prefix ? (
                  <span className="text-sm font-semibold text-pr_dg">{prefix}</span>
                ) : null}
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
                {suffix ? (
                  <span className="text-sm font-semibold text-pr_dg">{suffix}</span>
                ) : null}
              </div>
            </div>
            {showMax ? (
              <div>
                <p className="text-xs text-pr_w/80">{maxTitle}</p>
                <div className="mt-2 flex items-center rounded-full bg-pr_w px-3 py-2">
                  {prefix ? (
                    <span className="text-sm font-semibold text-pr_dg">{prefix}</span>
                  ) : null}
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
                  {suffix ? (
                    <span className="text-sm font-semibold text-pr_dg">{suffix}</span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            {!multi ? (
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-pr_w/70 hover:bg-pr_w/10"
                onClick={() => onSelect(id, "")}
              >
                {placeholder ?? "Any"}
              </button>
            ) : null}
            {options.map((option) => {
              const isSelected = multi
                ? selectedValues.includes(option.value)
                : option.value === selected;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                    isSelected ? "bg-pr_w/15" : "hover:bg-pr_w/10"
                  }`}
                  onClick={() =>
                    multi
                      ? onToggleValue?.(id, option.value)
                      : onSelect(id, option.value)
                  }
                >
                  <span>{option.label}</span>
                  {multi && isSelected ? <span>✓</span> : null}
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
