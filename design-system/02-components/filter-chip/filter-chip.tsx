/**
 * @lumen/filter-chip — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Applied-filter chip — {field} {operator} {value} with optional edit + dismiss.
 * Sits above DataTable / list to show what's filtering the current view.
 */
import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export type FilterChipProps = {
  field: string;
  operator: string;
  value: string;
  onRemove?: () => void;
  onEdit?: () => void;
  className?: string;
  status?: "neutral" | "accent";
};

export function FilterChip({
  field,
  operator,
  value,
  onRemove,
  onEdit,
  className,
  status = "neutral",
}: FilterChipProps) {
  const palette =
    status === "accent"
      ? "bg-[var(--pill-accent-bg)] text-[var(--pill-accent-fg)] border-[var(--pill-accent-border)]"
      : "bg-[var(--pill-neutral-bg)] text-[var(--pill-neutral-fg)] border-[var(--pill-neutral-border)]";

  const ariaLabel = `Filter: ${field} ${operator} ${value}`;

  return (
    <span
      data-slot="filter-chip"
      data-status={status}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center h-6 pl-2 rounded-[var(--radius-full)] text-[length:var(--type-11)] font-medium tracking-[var(--tracking-tight)] gap-1 border align-middle whitespace-nowrap",
        palette,
        className,
      )}
    >
      <span className="opacity-70">{field}</span>
      <span className="opacity-50">{operator}</span>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="font-semibold hover:underline focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-[var(--radius-xs)]"
          aria-label={`Edit ${ariaLabel}`}
        >
          {value}
        </button>
      ) : (
        <span className="font-semibold">{value}</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${ariaLabel}`}
          className="ml-0.5 mr-0.5 rounded-[var(--radius-full)] p-0.5 opacity-70 hover:opacity-100 hover:bg-[var(--surface-sunken)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          <X size={12} aria-hidden />
        </button>
      )}
    </span>
  );
}
