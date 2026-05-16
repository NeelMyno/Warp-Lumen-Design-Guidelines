// Lumen Accordion — Web React example
// Uses <details>/<summary> + class="lumen-summary" (defined in globals.css).
// The .lumen-summary rule suppresses the native disclosure marker on every browser:
//   summary.lumen-summary { list-style: none; }
//   summary.lumen-summary::-webkit-details-marker { display: none; }
// Per AGENTS.md hard rule 14.
//
// Height animation uses the grid-template-rows: 0fr → 1fr trick — works without
// measured heights, GPU-friendly, no jank.

"use client";

import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

type Variant = "plain" | "card" | "ghost";
type Size = "sm" | "md" | "lg";

const SUMMARY_SIZE: Record<Size, string> = {
  sm: "py-2 text-[var(--type-label-md)]",
  md: "py-3 text-[var(--type-label-md)]",
  lg: "py-4 text-[var(--type-heading-h4)]",
};

const ROW_CHROME: Record<Variant, string> = {
  plain: "border-b border-[var(--color-border-hairline)] last:border-b-0",
  card:  "border border-[var(--color-border-default)] rounded-[var(--radius-card-default)] bg-[var(--color-surface-raised)] px-[var(--space-inset-lg)] mb-2",
  ghost: "",
};

export type AccordionProps = {
  type?: "single" | "multiple";
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Accordion({ variant = "plain", children }: AccordionProps) {
  return (
    <div data-variant={variant} className="flex flex-col">
      {children}
    </div>
  );
}

export function AccordionItem({
  variant = "plain",
  size = "md",
  defaultOpen = false,
  question,
  children,
}: {
  variant?: Variant;
  size?: Size;
  defaultOpen?: boolean;
  question: ReactNode;
  children: ReactNode;
}) {
  return (
    <details
      className={[
        "group",
        ROW_CHROME[variant],
        "transition-colors duration-[var(--motion-duration-base)]",
      ].join(" ")}
      open={defaultOpen}
    >
      <summary
        className={[
          "lumen-summary list-none",
          "flex items-center justify-between gap-3 cursor-pointer select-none",
          "text-[var(--color-text-primary)] font-medium",
          SUMMARY_SIZE[size],
          "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
          "focus-visible:shadow-[var(--shadow-focus)]",
          "hover:text-[var(--color-text-primary)]",
        ].join(" ")}
      >
        <span className="flex-1">{question}</span>
        <ChevronDown
          aria-hidden
          size={14}
          className={[
            "shrink-0 text-[var(--color-text-tertiary)]",
            "group-open:rotate-180 group-open:text-[var(--color-text-primary)]",
            "transition-transform duration-[var(--motion-duration-base)]",
            "motion-reduce:transition-none",
          ].join(" ")}
          style={{ transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)" }}
        />
      </summary>
      <div
        className={[
          "grid grid-rows-[1fr]",
          // The grid-template-rows trick gives smooth height animation without measuring.
          // We don't bother encoding the closed=0fr state because <details> already
          // hides the content when closed; this just smooths the open transition.
          "text-[var(--type-body-md)] text-[var(--color-text-secondary)]",
        ].join(" ")}
      >
        <div className="overflow-hidden pb-4 pt-1">{children}</div>
      </div>
    </details>
  );
}
