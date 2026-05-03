import { ReactNode } from "react";

type Padding = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "hero";
type Elevation = "flat" | "card" | "lifted" | "popover" | "glass" | "glow";

const PAD: Record<Padding, string> = {
  none: "",
  xs:   "p-2",
  sm:   "p-3",
  md:   "p-4",
  lg:   "p-6",
  xl:   "p-8",
  hero: "p-10 md:p-12",
};

/* Elevation
 * flat     · hairline only — content blocks
 * card     · default — hairline + shadow.sm
 * lifted   · hover — hairline + shadow.md
 * popover  · floating — subtle border + shadow.popover
 * glass    · v0.4 — glass surface with backdrop-blur (floating shells)
 * glow     · v0.4 — accent halo for hero CTAs / brand moments
 */
const ELEV: Record<Elevation, string> = {
  flat:    "bg-[var(--surface-raised)] border border-[var(--border-hairline)]",
  card:    "bg-[var(--surface-raised)] border border-[var(--border-hairline)] shadow-[var(--shadow-sm)]",
  lifted:  "bg-[var(--surface-raised)] border border-[var(--border-hairline)] shadow-[var(--shadow-md)]",
  popover: "bg-[var(--surface-popover)] border border-[var(--border-subtle)] shadow-[var(--shadow-popover)]",
  glass:   "lumen-glass",
  glow:    "bg-[var(--surface-raised)] border border-[var(--border-accent)] shadow-[var(--shadow-glow-accent-strong)]",
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
    <div
      className={[
        "rounded-[var(--radius-xl)]",
        ELEV[elevation],
        PAD[padding],
        className,
      ].join(" ")}
    >
      {children}
    </div>
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
    <div className="flex items-start justify-between gap-4 mb-4">
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
