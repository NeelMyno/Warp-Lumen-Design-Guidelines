/**
 * RateTicker — horizontal marquee of freight rate quotes. Pure CSS animation.
 * Recreates Warp's signature scrolling lane-rate ticker.
 */
export function RateTicker({
  rates = DEFAULT_RATES,
}: {
  rates?: Array<{ from: string; to: string; price: string }>;
}) {
  const repeated = [...rates, ...rates];
  return (
    <div
      className="overflow-hidden border-y border-[var(--border-subtle)] py-2 bg-[var(--surface-sunken)]"
      aria-label="Live freight rates"
    >
      <div className="flex gap-8 whitespace-nowrap rate-ticker-track">
        {repeated.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-2 dash-mono text-[var(--type-13)] text-[var(--text-secondary)]"
          >
            <span>{r.from}</span>
            <span className="text-[var(--text-tertiary)]">→</span>
            <span>{r.to}</span>
            <span className="text-[var(--accent-700)] font-medium">
              {r.price}
            </span>
            <span className="text-[var(--text-tertiary)]">·</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes rate-ticker-kf {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .rate-ticker-track {
          animation: rate-ticker-kf 60s linear infinite;
          width: max-content;
        }
        @media (prefers-reduced-motion: reduce) {
          .rate-ticker-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

const DEFAULT_RATES = [
  { from: "LAX", to: "SFO", price: "$262" },
  { from: "ORD", to: "ATL", price: "$485" },
  { from: "DFW", to: "PHX", price: "$390" },
  { from: "SEA", to: "DEN", price: "$612" },
  { from: "MIA", to: "JFK", price: "$724" },
  { from: "LAX", to: "ORD", price: "$1,230" },
  { from: "BOS", to: "CLT", price: "$540" },
  { from: "SAN", to: "SLC", price: "$455" },
  { from: "MSP", to: "MCI", price: "$280" },
  { from: "PHL", to: "RDU", price: "$370" },
];
