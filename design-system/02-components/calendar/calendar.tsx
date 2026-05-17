"use client";

/**
 * @lumen/calendar — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * react-day-picker v9 with Lumen day cell + nav styling. All upstream props
 * pass through; we override the classNames map for token-driven styling.
 */
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DayPicker,
  type DayPickerProps,
} from "react-day-picker";

import { cn } from "@/lib/utils";

const lumenClassNames = {
  months: "flex flex-col sm:flex-row gap-4",
  month: "space-y-2",
  caption: "flex justify-center pt-1 relative items-center text-[length:var(--type-14)] font-medium",
  caption_label: "text-[color:var(--text-primary)] tracking-[var(--tracking-tight)]",
  nav: "space-x-1 flex items-center",
  nav_button:
    "h-7 w-7 inline-flex items-center justify-center rounded-[var(--radius-xs)] bg-transparent hover:bg-[var(--surface-sunken)] text-[color:var(--text-secondary)]",
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-y-1",
  head_row: "flex",
  head_cell:
    "text-[color:var(--text-tertiary)] rounded-md w-9 font-normal text-[length:var(--type-11)] lumen-mono-cap tracking-[var(--tracking-wider)]",
  row: "flex w-full mt-2",
  cell: "h-9 w-9 text-center text-[length:var(--type-13)] p-0 relative focus-within:relative focus-within:z-20",
  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center rounded-[var(--radius-xs)] hover:bg-[var(--surface-tint-accent)] focus:bg-[var(--surface-tint-accent)] focus:outline-none lumen-tnum",
  day_selected:
    "bg-[var(--color-action-primary-bg-rest)] text-[color:var(--color-action-primary-fg)] hover:bg-[var(--color-action-primary-bg-rest)] focus:bg-[var(--color-action-primary-bg-rest)]",
  day_today: "text-[color:var(--text-accent)] font-semibold",
  day_outside: "text-[color:var(--text-tertiary)] opacity-50",
  day_disabled: "text-[color:var(--text-tertiary)] opacity-30 cursor-not-allowed",
  day_range_middle: "aria-selected:bg-[var(--surface-tint-accent)] aria-selected:text-[color:var(--text-primary)]",
  day_hidden: "invisible",
};

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-[var(--surface-raised)] rounded-[var(--radius-md)] border border-[var(--border-hairline)]", className)}
      classNames={{ ...lumenClassNames, ...classNames }}
      components={{
        IconLeft: (p: { className?: string }) => <ChevronLeft className={cn("size-4", p.className)} />,
        IconRight: (p: { className?: string }) => <ChevronRight className={cn("size-4", p.className)} />,
      }}
      {...props}
    />
  );
}
