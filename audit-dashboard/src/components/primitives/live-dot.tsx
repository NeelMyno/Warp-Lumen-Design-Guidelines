/**
 * LiveDot — Warp signature primitive.
 * Filled dot + 1.5 px ring that pulses outward on a 3s loop.
 * The ring fades and scales 1 → 2.4 over 3 s with ease-out — slow enough
 * to never trigger flash thresholds, fast enough to read as "alive".
 *
 * Honors prefers-reduced-motion (ring becomes static).
 */
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
    <span className="inline-flex items-center gap-2 align-middle">
      <span
        className="relative inline-block shrink-0"
        style={{ width: size, height: size }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: color }}
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full lumen-live-dot-pulse"
          style={{
            border: `1.5px solid ${color}`,
          }}
        />
      </span>
      {label && !hideLabel && (
        <span className="text-[var(--type-11)] uppercase tracking-[var(--tracking-widest)] text-[var(--text-secondary)] font-semibold whitespace-nowrap">
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
