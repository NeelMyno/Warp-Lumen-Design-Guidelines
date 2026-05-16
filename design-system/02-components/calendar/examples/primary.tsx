// Lumen Calendar — Web React example. Month view skeleton (most common).
// Production code: integrate with date-fns + react-aria for full keyboard + locale + range selection.

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export function Calendar({
  value,
  onValueChange,
  weekStart = "mon",
  ariaLabel = "Calendar",
}: {
  value?: string;
  onValueChange?: (iso: string) => void;
  weekStart?: "sun" | "mon";
  ariaLabel?: string;
}) {
  const today = useMemo(() => new Date(), []);
  const initial = value ? new Date(value) : today;
  const [cursor, setCursor] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [focused, setFocused] = useState<string>(initial.toISOString().slice(0, 10));

  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });
  const dayHeaders = (weekStart === "mon"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  );

  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const firstWeekday = (first.getDay() - (weekStart === "mon" ? 1 : 0) + 7) % 7;
    const out: { date: Date; outside: boolean }[] = [];
    for (let i = 0; i < firstWeekday; i++) {
      const d = new Date(cursor.getFullYear(), cursor.getMonth(), -firstWeekday + i + 1);
      out.push({ date: d, outside: true });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      out.push({ date: new Date(cursor.getFullYear(), cursor.getMonth(), d), outside: false });
    }
    const remain = (7 - (out.length % 7)) % 7;
    for (let i = 1; i <= remain; i++) {
      out.push({ date: new Date(cursor.getFullYear(), cursor.getMonth() + 1, i), outside: true });
    }
    return out;
  }, [cursor, weekStart]);

  const onSelect = (iso: string) => {
    setFocused(iso);
    onValueChange?.(iso);
  };

  return (
    <div role="application" aria-label={ariaLabel} className="rounded-[var(--radius-card-default)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)] p-[var(--space-inset-md)]">
      <header className="flex items-center justify-between mb-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-control-md)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]"
        >
          <ChevronLeft size={14} aria-hidden />
        </button>
        <h3 className="text-[var(--type-label-md)] font-medium text-[var(--color-text-primary)]">{monthLabel}</h3>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-control-md)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]"
        >
          <ChevronRight size={14} aria-hidden />
        </button>
      </header>
      <div role="grid" aria-label={monthLabel}>
        <div role="row" className="grid grid-cols-7 text-center mb-1">
          {dayHeaders.map((d) => (
            <span key={d} role="columnheader" className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map(({ date, outside }) => {
            const iso = date.toISOString().slice(0, 10);
            const isToday = iso === today.toISOString().slice(0, 10);
            const isSelected = iso === focused;
            return (
              <button
                key={iso}
                type="button"
                role="gridcell"
                aria-label={date.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                aria-current={isToday ? "date" : undefined}
                aria-selected={isSelected}
                onClick={() => onSelect(iso)}
                className={[
                  "lumen-tnum h-8 inline-flex items-center justify-center rounded-[var(--radius-control-sm)] text-[var(--type-label-sm)]",
                  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
                  "transition-colors duration-[var(--motion-duration-fast)]",
                  outside ? "text-[var(--color-text-tertiary)] opacity-50" : "text-[var(--color-text-primary)]",
                  isSelected
                    ? "bg-[var(--color-action-selected-bg)] border border-[var(--color-action-selected-border)] text-[var(--color-text-accent)]"
                    : "hover:bg-[var(--color-action-ghost-bg-hover)]",
                  isToday && !isSelected ? "ring-2 ring-[var(--color-accent-500)]" : "",
                ].join(" ")}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
