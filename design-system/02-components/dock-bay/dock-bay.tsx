/**
 * @lumen/dock-bay — v0.13 Phase 2 freight-domain composite.
 * ----------------------------------------------------------------------------
 * Grid of dock-bay cards. State-coded via PILL tones.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type BayState = "open" | "occupied" | "reserved" | "out-of-service";

export type Bay = {
  id: string;
  number: number;
  state: BayState;
  carrier?: string;
  eta?: string;
};

const STATE_LABEL: Record<BayState, string> = {
  open: "Open",
  occupied: "Occupied",
  reserved: "Reserved",
  "out-of-service": "Out of service",
};

const STATE_PILL: Record<BayState, string> = {
  open: "bg-[var(--pill-success-bg)] text-[var(--pill-success-fg)] border-[var(--pill-success-border)]",
  occupied: "bg-[var(--pill-neutral-bg)] text-[var(--pill-neutral-fg)] border-[var(--pill-neutral-border)]",
  reserved: "bg-[var(--pill-info-bg)] text-[var(--pill-info-fg)] border-[var(--pill-info-border)]",
  "out-of-service": "bg-[var(--pill-danger-bg)] text-[var(--pill-danger-fg)] border-[var(--pill-danger-border)]",
};

export type DockBayProps = {
  bays: Bay[];
  cols?: number;
  onSelect?: (id: string) => void;
  className?: string;
};

export function DockBay({ bays, cols = 6, onSelect, className }: DockBayProps) {
  return (
    <div
      data-slot="dock-bay-grid"
      role="grid"
      aria-label="Dock bays"
      className={cn("grid gap-2", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {bays.map((b) => (
        <button
          key={b.id}
          type="button"
          role="gridcell"
          onClick={() => onSelect?.(b.id)}
          aria-label={`Bay ${b.number}, ${STATE_LABEL[b.state]}${b.carrier ? `, carrier ${b.carrier}` : ""}${b.eta ? `, ETA ${b.eta}` : ""}`}
          className={cn(
            "flex flex-col items-stretch gap-1 p-2 rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] text-left",
            "hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
            "transition-colors duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
          )}
        >
          <div className="flex items-baseline justify-between gap-1">
            <span className="lumen-mono-cap text-[length:var(--type-10)] tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)]">
              Bay
            </span>
            <span className="lumen-mono lumen-tnum text-[length:var(--type-18)] font-bold text-[color:var(--text-primary)] leading-none">
              {b.number}
            </span>
          </div>
          <span
            className={cn(
              "inline-flex items-center justify-center h-5 px-1.5 rounded-[var(--radius-full)] text-[length:var(--type-10)] font-medium border w-fit",
              STATE_PILL[b.state],
            )}
          >
            {STATE_LABEL[b.state]}
          </span>
          {(b.carrier || b.eta) && (
            <div className="mt-0.5 flex items-baseline justify-between gap-1 text-[length:var(--type-10)] text-[color:var(--text-tertiary)] lumen-mono">
              {b.carrier && <span className="truncate">{b.carrier}</span>}
              {b.eta && (
                <span className="lumen-tnum text-[color:var(--text-secondary)] shrink-0">{b.eta}</span>
              )}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
