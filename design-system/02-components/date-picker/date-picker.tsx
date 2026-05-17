"use client";

/**
 * @lumen/date-picker — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Input + popover-calendar composite. Single date or range. date-fns format.
 */
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "../calendar/calendar";

export type DatePickerValue = Date | DateRange | undefined;

export type DatePickerProps = {
  value?: DatePickerValue;
  onChange?: (v: DatePickerValue) => void;
  mode?: "single" | "range";
  formatStr?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function DatePicker({
  value,
  onChange,
  mode = "single",
  formatStr,
  placeholder = "Select date",
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const display = React.useMemo(() => {
    if (!value) return null;
    if (mode === "single" && value instanceof Date) {
      return format(value, formatStr ?? "PP");
    }
    if (mode === "range" && value && typeof value === "object" && "from" in value) {
      const r = value as DateRange;
      if (!r.from) return null;
      if (!r.to) return format(r.from, formatStr ?? "PP");
      return `${format(r.from, formatStr ?? "PP")} – ${format(r.to, formatStr ?? "PP")}`;
    }
    return null;
  }, [value, mode, formatStr]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        data-slot="date-picker-trigger"
        disabled={disabled}
        className={cn(
          "flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-input-rest)] px-3 text-[length:var(--type-14)] text-[color:var(--text-primary)] outline-none",
          "shadow-[var(--shadow-input-lit-edge)]",
          "transition-[color,box-shadow,border-color,background-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
          "hover:border-[var(--border-strong)]",
          "data-[state=open]:border-[var(--border-focus)] data-[state=open]:shadow-[var(--shadow-input-focus)]",
          "focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-input-focus)]",
          "disabled:cursor-not-allowed disabled:bg-[var(--surface-input-disabled)] disabled:text-[color:var(--text-disabled)] disabled:border-[var(--border-input-disabled)]",
          className,
        )}
      >
        <span
          className={cn(
            "truncate text-left flex-1",
            !display && "text-[color:var(--text-placeholder)]",
          )}
        >
          {display ?? placeholder}
        </span>
        <CalendarIcon size={16} aria-hidden className="opacity-60 shrink-0" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className="z-[var(--z-overlay)] bg-[var(--surface-popover)] rounded-[var(--radius-lg)] border border-[var(--border-default)] shadow-[var(--shadow-popover)] outline-none p-0"
        >
          {mode === "single" ? (
            <Calendar
              mode="single"
              selected={value as Date | undefined}
              onSelect={(d) => {
                onChange?.(d);
                if (d) setOpen(false);
              }}
              initialFocus
            />
          ) : (
            <Calendar
              mode="range"
              selected={value as DateRange | undefined}
              onSelect={(r) => {
                onChange?.(r);
              }}
              initialFocus
            />
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
