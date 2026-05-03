// Lumen LiveDot — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/live-dot.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.
//
// Warp signature primitive. Filled dot + 1.5px ring that pulses outward on a
// 3-second loop. Slow enough to never trigger flash thresholds, fast enough
// to read as "alive". Honors prefers-reduced-motion (ring becomes static).

import { HTMLAttributes } from "react";

export type LiveDotProps = HTMLAttributes<HTMLSpanElement> & {
  /** Optional uppercase label rendered to the right of the dot. */
  label?: string;
  /**
   * CSS color value for the dot and ring.
   * Default: var(--color-accent-500). Override with var(--color-status-warning-fg)
   * for degraded or var(--color-status-danger-fg) for offline.
   */
  color?: string;
  /** Visual diameter of the dot in pixels. Default 8. */
  size?: number;
  /** Hide the visible label but keep it available to screen readers. */
  hideLabel?: boolean;
};

export function LiveDot({
  label,
  color = "var(--color-accent-500)",
  size = 8,
  hideLabel = false,
  className,
  ...props
}: LiveDotProps) {
  return (
    <span
      {...props}
      className={["inline-flex items-center gap-2 align-middle", className ?? ""].join(" ")}
    >
      <span
        className="relative inline-block shrink-0"
        style={{ width: size, height: size }}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ background: color }}
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full lumen-live-dot-pulse"
          style={{ border: `1.5px solid ${color}` }}
        />
      </span>
      {label && !hideLabel && (
        <span className="text-[var(--type-eyebrow-mono)] uppercase tracking-[var(--tracking-wider)] font-semibold text-[var(--color-text-secondary)] whitespace-nowrap">
          {label}
        </span>
      )}
      {label && hideLabel && <span className="sr-only">{label}</span>}
      <style>{`
        @keyframes lumen-live-dot {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        .lumen-live-dot-pulse {
          animation: lumen-live-dot var(--motion-duration-slower, 3s)
            var(--motion-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .lumen-live-dot-pulse { animation: none; }
        }
      `}</style>
    </span>
  );
}
