// Lumen CoachMark — Web React example. Skeleton implementation; production code
// should integrate with a Popper / Floating UI library for collision-aware positioning.

// lumen-allow-file: layout-width
// Lumen library example — component-specific layout widths (modal, drawer, card, etc.). The audit-tokens.ts hard gate (excludes examples/ + audit-dashboard/) enforces the strict rule on shipped library source.
"use client";

import { ReactNode, RefObject, useId, useLayoutEffect, useState } from "react";

export function CoachMark({
  anchor,
  title,
  description,
  stepIndex,
  stepCount,
  primaryLabel = "Next",
  skipLabel = "Skip tour",
  onPrimary,
  onSkip,
  side = "bottom",
}: {
  anchor: RefObject<HTMLElement>;
  title?: string;
  description: ReactNode;
  stepIndex?: number;
  stepCount?: number;
  primaryLabel?: string;
  skipLabel?: string;
  onPrimary: () => void;
  onSkip?: () => void;
  side?: "top" | "right" | "bottom" | "left" | "auto";
}) {
  const titleId = useId();
  const descId = useId();
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      if (anchor.current) setRect(anchor.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchor]);

  if (!rect) return null;
  const cutout = { top: rect.top - 8, left: rect.left - 8, w: rect.width + 16, h: rect.height + 16 };
  const bubbleSide = side === "auto" ? "bottom" : side;
  const bubblePos =
    bubbleSide === "bottom"
      ? { top: cutout.top + cutout.h + 12, left: cutout.left }
      : bubbleSide === "top"
      ? { top: cutout.top - 12 - 160, left: cutout.left }
      : bubbleSide === "right"
      ? { top: cutout.top, left: cutout.left + cutout.w + 12 }
      : { top: cutout.top, left: cutout.left - 300 - 12 };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 z-[var(--z-modal,50)] pointer-events-none"
    >
      {/* Scrim with cut-out via SVG mask */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto" aria-hidden>
        <defs>
          <mask id="lumen-coach-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={cutout.left} y={cutout.top} width={cutout.w} height={cutout.h}
              rx="12" fill="black"
            />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="var(--color-surface-scrim)" mask="url(#lumen-coach-mask)" />
        <rect
          x={cutout.left} y={cutout.top} width={cutout.w} height={cutout.h}
          rx="12" fill="none"
          stroke="var(--color-text-accent)" strokeWidth="2"
        />
      </svg>
      <div
        className="absolute w-[300px] rounded-[var(--radius-card-default)] border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-modal)] p-[var(--space-inset-lg)] pointer-events-auto"
        style={bubblePos}
      >
        {title && (
          <h3 id={titleId} className="text-[var(--type-heading-h4)] font-medium tracking-tight text-[var(--color-text-primary)] mb-[var(--space-stack-sm)]">
            {title}
          </h3>
        )}
        <p id={descId} className="text-[var(--type-body-sm)] text-[var(--color-text-secondary)]">{description}</p>
        <div className="mt-[var(--space-stack-md)] flex items-center justify-between gap-2">
          <span className="lumen-tnum text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">
            {stepIndex && stepCount ? `${stepIndex} of ${stepCount}` : ""}
          </span>
          <span className="flex items-center gap-1">
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="h-8 px-3 rounded-[var(--radius-control-md)] text-[var(--color-action-tertiary-fg)] hover:bg-[var(--color-action-tertiary-bg-hover)] text-[var(--type-body-sm)]"
              >
                {skipLabel}
              </button>
            )}
            <button
              type="button"
              onClick={onPrimary}
              className="h-8 px-3 rounded-[var(--radius-control-md)] bg-[var(--color-action-primary-bg-rest)] text-[var(--color-action-primary-fg)] text-[var(--type-body-sm)] font-medium"
            >
              {primaryLabel}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
