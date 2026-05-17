/**
 * @lumen/rate-ticker — v0.13 Phase 2 canonical implementation (preserves v0.12 behavior).
 * ----------------------------------------------------------------------------
 * SIGNATURE primitive. Horizontal lane-rate marquee with edge-fade gradients.
 * Honors prefers-reduced-motion (track becomes static).
 */
import * as React from "react";

type Rate = { from: string; to: string; price: string; trend?: "up" | "down" };

const DEFAULT_RATES: Rate[] = [
  { from: "LAX", to: "SFO", price: "$262", trend: "down" },
  { from: "ORD", to: "ATL", price: "$485", trend: "up" },
  { from: "DFW", to: "PHX", price: "$390" },
  { from: "SEA", to: "DEN", price: "$612", trend: "down" },
  { from: "MIA", to: "JFK", price: "$724", trend: "up" },
  { from: "LAX", to: "ORD", price: "$1,230", trend: "down" },
  { from: "BOS", to: "CLT", price: "$540" },
  { from: "SAN", to: "SLC", price: "$455", trend: "up" },
  { from: "MSP", to: "MCI", price: "$280", trend: "down" },
  { from: "PHL", to: "RDU", price: "$370" },
];

export function RateTicker({
  rates = DEFAULT_RATES,
  speed = "normal",
}: {
  rates?: Rate[];
  speed?: "slow" | "normal" | "fast";
}) {
  const repeated = [...rates, ...rates];
  const dur = speed === "slow" ? "90s" : speed === "fast" ? "40s" : "60s";
  return (
    <div
      data-slot="rate-ticker"
      data-speed={speed}
      className="relative overflow-hidden border-y border-[var(--border-hairline)] bg-[var(--surface-sunken)]"
      aria-label="Live freight rates"
    >
      <div className="lumen-ticker-track flex gap-10 whitespace-nowrap py-3">
        {repeated.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-2 lumen-mono lumen-tnum text-[length:var(--type-13)]"
          >
            <span className="text-[color:var(--text-secondary)]">{r.from}</span>
            <span className="text-[color:var(--text-tertiary)]">→</span>
            <span className="text-[color:var(--text-secondary)]">{r.to}</span>
            <span className="text-[color:var(--text-primary)] font-medium">{r.price}</span>
            {r.trend && (
              <span
                aria-hidden
                className={
                  "text-[length:var(--type-11)] font-medium leading-none ml-[1px] " +
                  (r.trend === "up" ? "text-[var(--status-success-fg)]" : "text-[var(--status-danger-fg)]")
                }
              >
                {r.trend === "up" ? "▲" : "▼"}
              </span>
            )}
            <span aria-hidden className="text-[var(--border-strong)] mx-1">·</span>
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-12"
        style={{ background: "linear-gradient(to right, var(--surface-sunken), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-12"
        style={{ background: "linear-gradient(to left, var(--surface-sunken), transparent)" }}
      />
      <style>{`
        @keyframes lumen-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .lumen-ticker-track {
          animation: lumen-ticker ${dur} linear infinite;
          width: max-content;
        }
        @media (prefers-reduced-motion: reduce) {
          .lumen-ticker-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
