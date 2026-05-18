"use client";

import { ReactNode, useState } from "react";

/**
 * Swatch — colour chip with on-canvas labelling.
 * Click to copy the token path. The swatch itself is generously sized so
 * subtle hue differences across a 10-step ramp are visible at a glance.
 */
export function Swatch({
  name,
  value,
  cssVar,
  role,
  size = "md",
  copyableValue,
}: {
  name: string;
  value?: string;
  cssVar?: string;
  role?: string;
  size?: "sm" | "md" | "lg";
  copyableValue?: string;
}) {
  const [copied, setCopied] = useState(false);

  const dim = size === "sm" ? "h-12" : size === "lg" ? "h-24" : "h-16";
  const display = cssVar ? `var(${cssVar})` : value ?? "transparent";
  const toCopy = copyableValue ?? cssVar ?? value ?? "";

  function copy() {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(toCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    });
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${toCopy}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] text-left transition-[box-shadow,border-color,transform] duration-[var(--motion-fast)] hover:shadow-[var(--shadow-sm)] hover:border-[var(--border-subtle)] active:translate-y-px focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
    >
      <div
        className={[dim, "w-full relative overflow-hidden"].join(" ")}
        style={{ background: display }}
      >
        {copied && (
          /* v0.5: arbitrary-value type — review for semantic preset (11 medium toast) */
          <span className="absolute top-2 right-2 px-[var(--space-1_5)] h-[18px] inline-flex items-center rounded-full bg-[var(--surface-inverse)] text-[color:var(--text-inverse)] text-[length:var(--type-11)] font-medium tracking-[var(--tracking-tight)]">
            Copied
          </span>
        )}
      </div>
      <div className="px-3 py-2 border-t border-[var(--border-hairline)] flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-label-sm text-[color:var(--text-primary)] truncate">
            {name}
          </span>
          {value && (
            /* v0.5: arbitrary-value type — review for semantic preset (mono regular at 11) */
            <code className="lumen-mono text-[length:var(--type-11)] text-[color:var(--text-tertiary)] shrink-0">
              {value}
            </code>
          )}
        </div>
        {role && (
          /* v0.5: arbitrary-value type — review for semantic preset (plain regular at 11) */
          <div className="text-[length:var(--type-11)] text-[color:var(--text-tertiary)] truncate">
            {role}
          </div>
        )}
      </div>
    </button>
  );
}

export function SwatchGrid({
  children,
  cols,
}: {
  children: ReactNode;
  cols?: number;
}) {
  // Default: responsive 2 → 5 columns. Pass cols to override on a single
  // breakpoint (used for ramps that should always fit on one row).
  const cls = cols
    ? `grid gap-stack-sm grid-cols-${Math.min(cols, 12)}`
    : "grid gap-stack-sm grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5";
  return <div className={cls}>{children}</div>;
}

/**
 * Single-row 10-step ramp swatch — purpose-built for showing a Mantine-style
 * 0–9 colour scale at a glance.
 */
export function SwatchRamp({
  prefix,
  family,
  count = 10,
  showHex = false,
}: {
  prefix: string;             // displayed name like "gray", "navy", "accent"
  family: string;             // CSS-var family name like "lumen-gray"
  count?: number;
  showHex?: boolean;
}) {
  return (
    <div className="grid grid-cols-10 gap-0 rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-hairline)]">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          title={`var(--${family}-${i})`}
          onClick={() => navigator.clipboard?.writeText(`var(--${family}-${i})`)}
          className="group relative h-16 flex flex-col items-center justify-end pb-2 transition-[transform] hover:z-10 hover:scale-[1.06] focus-visible:outline-none focus-visible:z-10 focus-visible:scale-[1.06]"
          style={{ background: `var(--${family}-${i})` }}
        >
          <span
            className="text-[10px] font-semibold lumen-tnum opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity px-1 py-px rounded-sm bg-[var(--label-overlay-strong)] text-[color:var(--label-overlay-fg)]"
          >
            {showHex ? `${prefix}.${i}` : i}
          </span>
        </button>
      ))}
    </div>
  );
}
