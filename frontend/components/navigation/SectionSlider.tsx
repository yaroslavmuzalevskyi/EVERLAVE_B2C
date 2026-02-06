import { cn } from "@/lib/utils";
import type { SectionTab } from "@/types/navigation";
import { ChevronDown } from "lucide-react";

type Props = {
  tabs: SectionTab[];
  activeId: string;
  onChange: (tab: SectionTab) => void;
};

export function SectionSlider({ tabs, activeId, onChange }: Props) {
  return (
    <nav className="flex flex-wrap items-center gap-2 rounded-full bg-pr_w/95 p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
              isActive
                ? "bg-pr_dg text-pr_w shadow-sm"
                : "text-sr_g hover:text-pr_dg"
            )}
          >
            <span>{tab.label}</span>
            {tab.hasDropdown && (
              <ChevronDown className="h-4 w-4 text-current" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
