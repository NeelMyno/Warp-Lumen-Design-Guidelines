// Lumen DatePicker — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/date-picker.tsx.
// Tokens come from dist/tailwind/lumen.css which you import in your global css.
//
// NOTE — v0.7 ships the SHELL + a scaffold calendar. For production selection
// logic, locale-aware formatting, and range-picker support, compose
// `react-day-picker` (recommended) inside the popover. The Lumen contract
// owns the trigger field-shell and the day-cell styling.

"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

const cn = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

export type DatePickerProps = {
  value?: string; // ISO 8601 YYYY-MM-DD
  onChange?: (iso: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  min?: string;
  max?: string;
  locale?: string;
  name?: string;
  "aria-label"?: string;
};

function formatLocale(iso: string | undefined, locale?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  size = "md",
  disabled,
  min,
  max,
  locale,
  name,
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div
        className="lumen-field"
        data-mono="true"
        data-size={size === "md" ? undefined : size}
        data-disabled={disabled ? "true" : undefined}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <span
          data-slot="leading"
          aria-hidden
          style={{ color: "var(--color-text-tertiary)" }}
        >
          <CalendarIcon size={14} />
        </span>
        <input
          readOnly
          value={formatLocale(value, locale)}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          aria-haspopup="dialog"
          aria-expanded={open}
          {...rest}
        />
        {value && name && (
          <input type="hidden" name={`${name}__iso`} value={value} />
        )}
      </div>

      {open && !disabled && (
        <div
          role="dialog"
          aria-label="Calendar"
          className="absolute z-50 mt-1"
          style={{ left: 0 }}
        >
          <DatePickerCalendar
            value={value}
            onChange={(iso) => {
              onChange?.(iso);
              setOpen(false);
            }}
            min={min}
            max={max}
          />
        </div>
      )}
    </div>
  );
}

/* ---------- The calendar scaffold ----------
 * Static rendering of the current month. Replace with react-day-picker for
 * real navigation, range support, locale weeks. The day-cell styling tokens
 * stay the same. */

type CalendarProps = {
  value?: string;
  onChange?: (iso: string) => void;
  min?: string;
  max?: string;
};

export function DatePickerCalendar({ value, onChange, min, max }: CalendarProps) {
  const today = new Date();
  const target = value ? new Date(value) : today;
  const year = target.getFullYear();
  const month = target.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [];
  // Lead with placeholders so day-1 lands under the right weekday (Mon-first).
  const leadBlanks = (firstDow + 6) % 7;
  for (let i = 0; i < leadBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  function isSelected(d: number | null) {
    if (!d || !value) return false;
    const sel = new Date(value);
    return (
      sel.getFullYear() === year &&
      sel.getMonth() === month &&
      sel.getDate() === d
    );
  }
  function isToday(d: number | null) {
    if (!d) return false;
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === d
    );
  }

  function pick(d: number) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (min && iso < min) return;
    if (max && iso > max) return;
    onChange?.(iso);
  }

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  return (
    <div
      className="inline-block p-3"
      style={{
        background: "var(--color-surface-popover)",
        border: "1px solid var(--color-border-default)",
        borderRadius: "var(--radius-popover)",
        boxShadow: "var(--shadow-popover)",
        width: 256,
      }}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <span
          className="text-label-md"
          style={{
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          {monthLabel}
        </span>
        <div className="flex gap-1" style={{ color: "var(--color-text-tertiary)" }}>
          <button
            className="h-7 w-7 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-sunken)]"
            aria-label="Previous month"
            type="button"
          >
            ‹
          </button>
          <button
            className="h-7 w-7 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-sunken)]"
            aria-label="Next month"
            type="button"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 mb-2">
        {days.map((d) => (
          <span
            key={d}
            className="text-center text-overline"
            style={{
              color: "var(--color-text-tertiary)",
            }}
          >
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => (
          <button
            key={i}
            disabled={!d}
            type="button"
            onClick={d ? () => pick(d) : undefined}
            aria-pressed={isSelected(d)}
            aria-label={d ? `Day ${d}` : undefined}
            className={cn(
              "h-7 rounded-[var(--radius-sm)] transition-colors text-body-xs [font-variant-numeric:tabular-nums_lining-nums]",
              !d && "opacity-0 pointer-events-none",
            )}
            style={{
              fontVariantNumeric: "tabular-nums",
              background: isSelected(d)
                ? "var(--color-accent-400)"
                : "transparent",
              color: isSelected(d)
                ? "var(--color-accent-fg)"
                : "var(--color-text-secondary)",
              fontWeight: isSelected(d) ? 600 : undefined,
              border:
                isToday(d) && !isSelected(d)
                  ? "1px solid var(--color-border-strong)"
                  : undefined,
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
