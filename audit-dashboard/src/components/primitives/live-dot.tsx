/**
 * LiveDot — Warp's signature pulsing dot. Green by default; pass color to override.
 * Renders an 8px filled dot with a 2px ring that pulses outward on a 3s loop.
 */
export function LiveDot({
  label,
  color = "var(--accent-500)",
  size = 8,
}: {
  label?: string;
  color?: string;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="relative inline-block"
        style={{ width: size, height: size }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: color }}
        />
        <span
          className="absolute inset-0 rounded-full live-dot-pulse"
          style={{
            border: `1.5px solid ${color}`,
          }}
          aria-hidden
        />
      </span>
      {label && (
        <span className="text-[var(--type-12)] uppercase tracking-[var(--tracking-widest)] text-[var(--text-secondary)] font-medium">
          {label}
        </span>
      )}
      <style>{`
        @keyframes live-dot-pulse-kf {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        .live-dot-pulse {
          animation: live-dot-pulse-kf 3s cubic-bezier(0,0,0.2,1) infinite;
        }
      `}</style>
    </span>
  );
}
