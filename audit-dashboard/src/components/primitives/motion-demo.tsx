// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

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
      <div className="relative h-control-cozy w-full rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)] overflow-hidden">
        <button
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onClick={() => setActive((a) => !a)}
          aria-label={`Replay ${token}`}
          /* v0.5: arbitrary-value type — review for semantic preset (12 bold play button) */
          className="absolute top-1 left-1 h-7 w-7 rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-[color:var(--text-on-accent)] font-bold text-[length:var(--type-12)] flex items-center justify-center shadow-[var(--shadow-glow-accent)]"
          style={{
            transform: active ? "translateX(calc(100% + 12px))" : "translateX(0)",
            transition: `transform var(--motion-${token}) var(--easing-standard)`,
          }}
        >
          ▸
        </button>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        {/* v0.5: arbitrary-value type — review for semantic preset (mono regular at 11) */}
        <code className="lumen-mono text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">
          motion.{token}
        </code>
        {/* v0.5: arbitrary-value type — review for semantic preset (mono tabular at 11) */}
        <span className="lumen-mono lumen-tnum text-[length:var(--type-11)] text-[color:var(--text-secondary)]">
          {ms}
        </span>
      </div>
    </div>
  );
}
