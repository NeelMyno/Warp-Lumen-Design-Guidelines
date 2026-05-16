// Lumen PullToRefresh — Web React example. Arrow indicator. Reduced-motion safe.

"use client";

import { ArrowDown } from "lucide-react";
import { ReactNode, useRef, useState, PointerEvent } from "react";

export function PullToRefresh({
  onRefresh,
  threshold = 72,
  indicator = "arrow",
  label,
  children,
}: {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  indicator?: "arrow" | "spinner";
  label?: ReactNode;
  children: ReactNode;
}) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const committed = pull >= threshold;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (refreshing) return;
    if ((scrollRef.current?.scrollTop ?? 0) > 0) return;
    startY.current = e.clientY;
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    const delta = Math.max(0, e.clientY - startY.current);
    setPull(Math.min(threshold * 1.5, delta));
  };
  const onPointerUp = async () => {
    startY.current = null;
    if (committed) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  };

  const status = refreshing
    ? "Refreshing"
    : committed
    ? "Release to refresh"
    : pull > 0
    ? "Pull to refresh"
    : "";

  return (
    <div
      role="group"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative h-full w-full"
    >
      <div
        aria-live="polite"
        aria-atomic
        className="absolute inset-x-0 top-0 z-10 flex flex-col items-center justify-end overflow-hidden text-[var(--color-text-tertiary)]"
        style={{
          height: refreshing ? threshold : pull,
          transition: startY.current === null
            ? "height var(--motion-duration-base) cubic-bezier(0.2,0,0,1)"
            : "none",
        }}
      >
        {indicator === "arrow" ? (
          <ArrowDown
            size={16}
            aria-hidden
            style={{ transform: `rotate(${committed || refreshing ? 180 : 0}deg)` }}
            className={[
              "mb-1 transition-transform duration-[var(--motion-duration-base)]",
              "motion-reduce:transition-none",
              refreshing ? "animate-spin" : "",
            ].join(" ")}
          />
        ) : (
          <span className="mb-1 inline-block size-3 rounded-full border-2 border-current border-r-transparent animate-spin motion-reduce:animate-none" />
        )}
        <span className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider mb-1">{label ?? status}</span>
      </div>
      <div
        ref={scrollRef}
        className="h-full w-full overflow-y-auto"
        style={{
          transform: `translateY(${refreshing ? threshold : pull}px)`,
          transition: startY.current === null
            ? "transform var(--motion-duration-base) cubic-bezier(0.2,0,0,1)"
            : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
