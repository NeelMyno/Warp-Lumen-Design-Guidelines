/**
 * @lumen/live-dot — v0.13 Phase 2 canonical implementation (preserves v0.12 behavior).
 * ----------------------------------------------------------------------------
 * SIGNATURE primitive. Filled dot + 1.5px ring that pulses outward on a 3s loop.
 * Honors prefers-reduced-motion (ring becomes static).
 */
import * as React from "react";

export function LiveDot({
  label,
  color = "var(--color-accent)",
  size = 8,
  hideLabel = false,
}: {
  label?: string;
  color?: string;
  size?: number;
  hideLabel?: boolean;
}) {
  return (
    <span data-slot="live-dot" className="inline-flex items-center gap-2 align-middle">
      <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
        <span className="absolute inset-0 rounded-full" style={{ background: color }} />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full lumen-live-dot-pulse"
          style={{ border: `1.5px solid ${color}` }}
        />
      </span>
      {label && !hideLabel && (
        <span className="text-[length:var(--type-11)] text-[color:var(--text-secondary)] font-semibold whitespace-nowrap tracking-[var(--tracking-wider)] uppercase">
          {label}
        </span>
      )}
      <style>{`
        @keyframes lumen-live-dot {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        .lumen-live-dot-pulse {
          animation: lumen-live-dot 3s cubic-bezier(0,0,0.2,1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .lumen-live-dot-pulse { animation: none; }
        }
      `}</style>
    </span>
  );
}
