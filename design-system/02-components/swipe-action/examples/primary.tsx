// Lumen SwipeAction — Web React example.
// Simplified swipe handler — production code should integrate with @use-gesture
// or framer-motion for true rubberband + velocity. The non-drag fallback (long-press
// → ActionSheet) is the consumer's responsibility per WCAG 2.5.7.

"use client";

import { ReactNode, useRef, useState, PointerEvent } from "react";

export type SwipeItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  tone?: "neutral" | "danger";
  onSelect: () => void;
  fullSwipe?: boolean;
};

export function SwipeAction({
  trailing = [],
  leading = [],
  snapDistance = 80,
  children,
}: {
  trailing?: SwipeItem[];
  leading?: SwipeItem[];
  snapDistance?: number;
  children: ReactNode;
}) {
  const [offset, setOffset] = useState(0);
  const startX = useRef<number | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX - offset;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const next = e.clientX - startX.current;
    // Clamp: left-only when trailing present; right-only when leading present.
    const min = trailing.length ? -snapDistance * Math.min(trailing.length, 3) : 0;
    const max = leading.length ? snapDistance * Math.min(leading.length, 3) : 0;
    setOffset(Math.min(max, Math.max(min, next)));
  };
  const onPointerUp = () => {
    startX.current = null;
    // Snap to the nearest multiple of snapDistance
    const k = Math.round(offset / snapDistance);
    setOffset(k * snapDistance);
  };
  const close = () => setOffset(0);

  return (
    <div role="group" className="relative overflow-hidden">
      {/* Trailing actions (revealed on swipe-left). */}
      <div
        aria-hidden={offset >= 0}
        className="absolute inset-y-0 right-0 flex"
      >
        {trailing.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => { it.onSelect(); close(); }}
            aria-label={it.label}
            className={[
              "h-full flex flex-col items-center justify-center gap-1",
              "text-[var(--type-label-sm)] font-medium",
              it.tone === "danger"
                ? "bg-[var(--color-action-danger-bg-rest)] text-[var(--color-action-danger-fg)]"
                : "bg-[var(--color-action-secondary-bg-rest)] text-[var(--color-action-secondary-fg)]",
            ].join(" ")}
            style={{ width: snapDistance }}
          >
            {it.icon}
            {it.label}
          </button>
        ))}
      </div>
      {/* Leading actions (revealed on swipe-right). */}
      <div
        aria-hidden={offset <= 0}
        className="absolute inset-y-0 left-0 flex"
      >
        {leading.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => { it.onSelect(); close(); }}
            aria-label={it.label}
            className={[
              "h-full flex flex-col items-center justify-center gap-1",
              "text-[var(--type-label-sm)] font-medium",
              it.tone === "danger"
                ? "bg-[var(--color-action-danger-bg-rest)] text-[var(--color-action-danger-fg)]"
                : "bg-[var(--color-action-secondary-bg-rest)] text-[var(--color-action-secondary-fg)]",
            ].join(" ")}
            style={{ width: snapDistance }}
          >
            {it.icon}
            {it.label}
          </button>
        ))}
      </div>
      {/* Row content — moves with the pointer */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={[
          "relative bg-[var(--color-surface-raised)] border-b border-[var(--color-border-hairline)]",
          "touch-pan-y select-none cursor-grab active:cursor-grabbing",
          "motion-reduce:transition-none",
        ].join(" ")}
        style={{
          transform: `translateX(${offset}px)`,
          transition: startX.current === null
            ? "transform var(--motion-duration-base, 240ms) cubic-bezier(0.2, 0, 0, 1)"
            : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
