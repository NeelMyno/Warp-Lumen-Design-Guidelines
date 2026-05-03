import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Card as ShadcnCard } from "@/components/ui/card";

/**
 * Lumen Card — wraps the shadcn Card and adds Lumen's `padding` and
 * `elevation` shorthand props. Preserves the prior Lumen API; consumer
 * pages use `<Card padding="lg" elevation="card">` exactly as before.
 */

type Padding = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "hero";
type Elevation = "flat" | "card" | "lifted" | "popover" | "glass" | "glow";

const PAD: Record<Padding, string> = {
  none: "py-0 [&>*]:px-0",
  xs:   "p-2 [&_[data-slot=card-header]]:px-2 [&_[data-slot=card-content]]:px-2 [&_[data-slot=card-footer]]:px-2",
  sm:   "p-3 [&_[data-slot=card-header]]:px-3 [&_[data-slot=card-content]]:px-3 [&_[data-slot=card-footer]]:px-3",
  md:   "p-4 [&_[data-slot=card-header]]:px-4 [&_[data-slot=card-content]]:px-4 [&_[data-slot=card-footer]]:px-4",
  lg:   "p-6 [&_[data-slot=card-header]]:px-6 [&_[data-slot=card-content]]:px-6 [&_[data-slot=card-footer]]:px-6",
  xl:   "p-8 [&_[data-slot=card-header]]:px-8 [&_[data-slot=card-content]]:px-8 [&_[data-slot=card-footer]]:px-8",
  hero: "p-10 md:p-12 [&_[data-slot=card-header]]:px-10 md:[&_[data-slot=card-header]]:px-12 [&_[data-slot=card-content]]:px-10 md:[&_[data-slot=card-content]]:px-12 [&_[data-slot=card-footer]]:px-10 md:[&_[data-slot=card-footer]]:px-12",
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
      <div className="flex flex-col gap-0.5 min-w-0">
        {eyebrow && <div className="lumen-eyebrow mb-1">{eyebrow}</div>}
        <div className="text-[var(--type-15)] font-semibold tracking-[var(--tracking-tight)] text-[var(--text-primary)]">
          {title}
        </div>
        {description && (
          <div className="text-[var(--type-13)] text-[var(--text-tertiary)] leading-[var(--leading-snug)]">
            {description}
          </div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
