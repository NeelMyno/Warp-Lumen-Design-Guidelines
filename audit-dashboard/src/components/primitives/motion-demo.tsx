"use client";

import { useState } from "react";

/**
 * Live motion swatch — hover or click to fire the transition with the named
 * duration token. Replays so you can compare timings side-by-side.
 */
export function MotionDemo({ token, ms }: { token: string; ms: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-9 w-full rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] overflow-hidden">
        <button
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onClick={() => setActive((a) => !a)}
          aria-label={`Replay ${token}`}
          className="absolute top-1 left-1 h-7 w-7 rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-[var(--text-on-accent)] font-bold text-[var(--type-12)] flex items-center justify-center shadow-[var(--shadow-glow-accent)]"
          style={{
            transform: active ? "translateX(calc(100% + 12px))" : "translateX(0)",
            transition: `transform var(--motion-${token}) var(--easing-standard)`,
          }}
        >
          ▸
        </button>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <code className="lumen-mono text-[var(--type-11)] text-[var(--text-tertiary)]">
          motion.{token}
        </code>
        <span className="lumen-mono lumen-tnum text-[var(--type-11)] text-[var(--text-secondary)]">
          {ms}
        </span>
      </div>
    </div>
  );
}
