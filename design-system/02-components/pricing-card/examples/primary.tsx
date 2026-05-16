// Lumen PricingCard — Web React example. Highlight variant uses v0.12.5 peak-end lift.

import { Check, X } from "lucide-react";
import { ReactNode, useId } from "react";

export type PricingFeature = { label: ReactNode; included?: boolean };

export function PricingCard({
  name,
  price,
  cadence,
  subline,
  description,
  features,
  cta,
  highlight = false,
  badge,
}: {
  name: string;
  price: ReactNode;
  cadence?: string;
  subline?: ReactNode;
  description?: ReactNode;
  features: PricingFeature[];
  cta: ReactNode;
  highlight?: boolean;
  badge?: ReactNode;
}) {
  const titleId = useId();
  return (
    <article
      aria-labelledby={titleId}
      data-highlight={highlight}
      className={[
        "relative rounded-[var(--radius-card-hero)] border bg-[var(--color-surface-raised)]",
        "p-[var(--space-inset-xl)] flex flex-col gap-[var(--space-stack-md)]",
        highlight
          ? "border-[var(--color-border-accent)] shadow-[var(--shadow-glow-accent)] hover:-translate-y-[1px]"
          : "border-[var(--color-border-default)] hover:shadow-[var(--shadow-elevation-md)] hover:-translate-y-[1px]",
        "transition-[box-shadow,transform] duration-[var(--motion-duration-base)] motion-reduce:transition-none",
      ].join(" ")}
    >
      {highlight && <span className="sr-only">Recommended plan</span>}
      {badge && (
        <span className="absolute -top-2 right-4 rounded-[var(--radius-pill)] bg-[var(--color-accent-500)] text-[var(--color-action-primary-fg)] px-2 py-0.5 text-[var(--type-eyebrow-mono)] uppercase tracking-wider">
          {badge}
        </span>
      )}
      <header>
        <h3 id={titleId} className="text-[var(--type-heading-h3)] font-medium tracking-tight text-[var(--color-text-primary)]">{name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="lumen-tnum text-[var(--type-heading-h1)] font-semibold tracking-tight text-[var(--color-text-primary)]">{price}</span>
          {cadence && <span className="text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]">{cadence}</span>}
        </div>
        {subline && <p className="mt-1 text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]">{subline}</p>}
        {description && <p className="mt-3 text-[var(--type-body-md)] text-[var(--color-text-secondary)]">{description}</p>}
      </header>
      <ul role="list" className="flex flex-col gap-1.5">
        {features.map((f, i) => {
          const inc = f.included !== false;
          return (
            <li key={i} className="flex items-start gap-2 text-[var(--type-body-md)]">
              {inc
                ? <Check aria-label="Included" size={14} className="mt-0.5 shrink-0 text-[var(--color-text-accent)]" />
                : <X aria-label="Not included" size={14} className="mt-0.5 shrink-0 text-[var(--color-text-tertiary)]" />
              }
              <span className={inc ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-tertiary)] line-through"}>{f.label}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-2">{cta}</div>
    </article>
  );
}
