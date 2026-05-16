// Lumen KpiCard — Web React example. Composes label + value + Trend + Sparkline.

import { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  valueSuffix,
  delta,
  deltaSuffix = "%",
  polarity = "positive-is-good",
  deltaPeriod,
  sparkline,
  context,
  tone = "default",
  loading,
  onClick,
}: {
  label: string;
  value: ReactNode;
  valueSuffix?: ReactNode;
  delta?: number;
  deltaSuffix?: string;
  polarity?: "positive-is-good" | "negative-is-good" | "neutral";
  deltaPeriod?: string;
  sparkline?: ReactNode;
  context?: ReactNode;
  tone?: "default" | "accent";
  loading?: boolean;
  onClick?: () => void;
}) {
  const ariaLabel = `${label}, ${typeof value === "string" || typeof value === "number" ? value : ""}${valueSuffix ? "" : ""}${delta !== undefined ? `, ${delta > 0 ? "up" : delta < 0 ? "down" : "unchanged"} ${Math.abs(delta)}${deltaSuffix}${deltaPeriod ? ` versus ${deltaPeriod}` : ""}` : ""}`;

  const Tag = onClick ? "button" : "article";
  return (
    <Tag
      role={onClick ? undefined : "region"}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={[
        "text-left w-full",
        "rounded-[var(--radius-card-default)] border border-[var(--color-border-hairline)]",
        "bg-[var(--color-surface-raised)] p-[var(--space-inset-lg)]",
        "flex flex-col gap-[var(--space-stack-sm)]",
        onClick ? "hover:shadow-[var(--shadow-elevation-sm)] hover:border-[var(--color-border-default)] cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)] transition-shadow duration-[var(--motion-duration-fast)]" : "",
      ].join(" ")}
    >
      <span className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={[
          "lumen-tnum text-[var(--type-heading-h2)] font-semibold tracking-tight",
          tone === "accent" ? "text-[var(--color-text-accent)]" : "text-[var(--color-text-primary)]",
        ].join(" ")}>
          {loading ? "—" : value}
        </span>
        {valueSuffix && <span className="text-[var(--type-label-sm)] text-[var(--color-text-tertiary)]">{valueSuffix}</span>}
      </div>
      <div className="flex items-center justify-between gap-2">
        {delta !== undefined && !loading && (
          <span className="text-[var(--type-body-sm)]">
            <DeltaInline delta={delta} suffix={deltaSuffix} polarity={polarity} />
            {deltaPeriod && <span className="ml-1 text-[var(--color-text-tertiary)]">vs {deltaPeriod}</span>}
          </span>
        )}
        {sparkline && <span className="ml-auto">{sparkline}</span>}
      </div>
      {context && <p className="text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]">{context}</p>}
    </Tag>
  );
}

function DeltaInline({ delta, suffix, polarity }: { delta: number; suffix: string; polarity: "positive-is-good" | "negative-is-good" | "neutral" }) {
  const sign = delta > 0 ? 1 : delta < 0 ? -1 : 0;
  const good = polarity === "neutral" ? null : polarity === "positive-is-good" ? sign > 0 : sign < 0;
  const tone = polarity === "neutral" ? "text-[var(--color-text-tertiary)]" : good ? "text-[var(--color-text-accent)]" : sign === 0 ? "text-[var(--color-text-tertiary)]" : "text-[var(--color-text-error)]";
  return <span className={["lumen-tnum font-medium", tone].join(" ")}>{sign >= 0 ? "+" : "−"}{Math.abs(delta).toFixed(1)}{suffix}</span>;
}
