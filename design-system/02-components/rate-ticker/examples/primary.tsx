// Lumen RateTicker — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/rate-ticker.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.
//
// Warp signature primitive. Horizontal marquee of freight lane rates. Pure-CSS
// animation, edge-fade gradients give the "windowed view onto a stream" feel.
// Honors prefers-reduced-motion (track becomes static).

import { HTMLAttributes } from "react";

export type Rate = {
  from: string;
  to: string;
  price: string;
  trend?: "up" | "down";
};

export type RateTickerProps = HTMLAttributes<HTMLDivElement> & {
  rates?: Rate[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
};

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
  direction = "left",
  className,
  ...props
}: RateTickerProps) {
  // Doubled track lets translateX(-50%) loop seamlessly.
  const repeated = [...rates, ...rates];
  const dur = speed === "slow" ? "90s" : speed === "fast" ? "40s" : "60s";
  const animationName =
    direction === "left" ? "lumen-ticker-left" : "lumen-ticker-right";

  return (
    <div
      {...props}
      role="region"
      aria-label={props["aria-label"] ?? "Live freight rates"}
      className={[
        "relative overflow-hidden",
        "border-y border-[var(--color-border-subtle)]",
        "bg-[var(--color-surface-sunken)]",
        className ?? "",
      ].join(" ")}
    >
      <div
        className="lumen-ticker-track flex gap-10 whitespace-nowrap py-3"
        style={{
          animation: `${animationName} ${dur} linear infinite`,
          width: "max-content",
        }}
      >
        {repeated.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-2 font-[var(--font-mono)] [font-variant-numeric:tabular-nums_lining-nums_slashed-zero] text-[var(--type-data-sm)]"
          >
            <span className="text-[var(--color-text-secondary)]">{r.from}</span>
            <span aria-hidden className="text-[var(--color-text-tertiary)]">
              →
            </span>
            <span className="text-[var(--color-text-secondary)]">{r.to}</span>
            <span className="text-[var(--color-text-primary)] font-medium">
              {r.price}
            </span>
            {r.trend && (
              <span
                aria-hidden
                className={[
                  "text-[var(--type-eyebrow-mono)] leading-none",
                  r.trend === "up"
                    ? "text-[var(--color-status-success-fg)]"
                    : "text-[var(--color-status-danger-fg)]",
                ].join(" ")}
              >
                {r.trend === "up" ? "▲" : "▼"}
              </span>
            )}
            <span aria-hidden className="text-[var(--color-text-tertiary)] mx-1">
              ·
            </span>
          </div>
        ))}
      </div>

      {/* Edge fade gradients — Apple-style "windowed stream". */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-12"
        style={{
          background:
            "linear-gradient(to right, var(--color-surface-sunken), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-12"
        style={{
          background:
            "linear-gradient(to left, var(--color-surface-sunken), transparent)",
        }}
      />

      <style>{`
        @keyframes lumen-ticker-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes lumen-ticker-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lumen-ticker-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
