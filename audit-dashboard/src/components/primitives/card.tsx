import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Card as ShadcnCard } from "@/components/ui/card";

/**
 * Lumen Card — wraps the shadcn Card and adds Lumen's `padding` and
 * `elevation` shorthand props. Preserves the prior Lumen API; consumer
 * pages use `<Card padding="lg" elevation="card">` exactly as before.
 *
 * v0.10.1 — ALIGNMENT CONTRACT.
 * The shadcn ui/card.tsx primitive ships its slots (CardHeader, CardContent,
 * CardFooter) with their own `px-6`. The original Lumen wrapper added an
 * `[&_[data-slot=card-SLOT]]:px-N` arbitrary variant in lockstep with the
 * Card's outer `p-N` (where SLOT is one of header / content / footer).
 * Result: descendant-variant CSS specificity beat the inner slot's `px-0`,
 * so slot content sat inset by `p-N + px-N` while bare-`<p>` siblings of the
 * slot sat at only `p-N` — visible as a 24-px misaligned column on every
 * Card that mixed `<CardHeader />` with bare body text (foundations 'Card
 * variants', any place a paragraph followed a header inside a Card).
 *
 * Fix: the OUTER Card owns inline padding via `p-N`; slots are zeroed out
 * via the SLOT_PX_ZERO triple below — three concrete classes, one per slot.
 * Slots and bare children both inset to the same x = `p-N` from the card
 * edge. Don't reintroduce slot px here unless you also remove `p-N` from
 * the same row — pick one source of inline padding, not two.
 *
 * v0.11.17 — keep this comment free of `{` `}` placeholder braces (and any
 * literal `[&_…]:` arbitrary-variant string with a brace inside). Tailwind
 * v4's content scanner pattern-matches arbitrary variants from comments AND
 * code; a `{slot}` literal here gets compiled into invalid CSS and breaks
 * the build (`Unexpected token CurlyBracketBlock` at globals.css:4130).
 */

type Padding = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "hero";
type Elevation = "flat" | "card" | "lifted" | "popover" | "glass" | "glow";

const SLOT_PX_ZERO = "[&_[data-slot=card-header]]:px-0 [&_[data-slot=card-content]]:px-0 [&_[data-slot=card-footer]]:px-0";

const PAD: Record<Padding, string> = {
  none: "py-0 [&>*]:px-0",
  xs:   `p-2 ${SLOT_PX_ZERO}`,
  sm:   `p-3 ${SLOT_PX_ZERO}`,
  md:   `p-4 ${SLOT_PX_ZERO}`,
  lg:   `p-6 ${SLOT_PX_ZERO}`,
  xl:   `p-8 ${SLOT_PX_ZERO}`,
  hero: `p-10 md:p-12 ${SLOT_PX_ZERO}`,
};

const ELEV: Record<Elevation, string> = {
  flat:    "shadow-none border-[var(--border-hairline)]",
  card:    "shadow-[var(--shadow-sm)] border-[var(--border-hairline)]",
  lifted:  "shadow-[var(--shadow-md)] border-[var(--border-hairline)]",
  popover: "shadow-[var(--shadow-popover)] border-[var(--border-subtle)]",
  glass:   "lumen-glass border-transparent",
  glow:    "shadow-[var(--shadow-glow-accent-strong)] border-[var(--border-accent)]",
};

export function Card({
  children,
  padding = "md",
  elevation = "card",
  className = "",
}: {
  children: ReactNode;
  padding?: Padding;
  elevation?: Elevation;
  className?: string;
}) {
  return (
    <ShadcnCard
      className={cn(
        // shadcn Card defaults to py-6 + gap-6; padding tokens reset/extend that
        "gap-0",
        PAD[padding],
        ELEV[elevation],
        className,
      )}
    >
      {children}
    </ShadcnCard>
  );
}

export function CardHeader({
  title,
  description,
  action,
  eyebrow,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <div data-slot="card-header" className="flex items-start justify-between gap-4 mb-4 px-0">
      <div className="flex flex-col gap-1 min-w-0">
        {eyebrow && <div className="lumen-eyebrow mb-1">{eyebrow}</div>}
        <div className="text-heading-h5 text-[color:var(--text-primary)]">
          {title}
        </div>
        {description && (
          <div className="text-body-xs text-[color:var(--text-tertiary)] leading-[var(--leading-snug)]">
            {description}
          </div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
