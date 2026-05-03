import { ReactNode } from "react";

/**
 * Stat — Warp's signature primitive. Big bold numeric + small label.
 * Numbers always render in tabular monospace so columns align.
 */
export function Stat({
  label,
  value,
  unit,
  delta,
  trend,
  size = "md",
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeMap = {
    sm: "text-[var(--type-25)]",
    md: "text-[var(--type-31)]",
    lg: "text-[var(--type-39)]",
    xl: "text-[var(--type-49)]",
  } as const;
  const trendColor =
    trend === "up"
      ? "text-[var(--status-success-fg)]"
      : trend === "down"
        ? "text-[var(--status-danger-fg)]"
        : "text-[var(--text-tertiary)]";
  return (
    <div className="flex flex-col gap-1">
      <div className="dash-eyebrow">{label}</div>
      <div className="flex items-baseline gap-2">
        <span
          className={`${sizeMap[size]} font-bold tracking-[var(--tracking-tighter)] dash-tnum text-[var(--text-primary)]`}
        >
          {value}
        </span>
        {unit && (
          <span className="dash-mono text-[var(--type-13)] text-[var(--text-tertiary)]">
            {unit}
          </span>
        )}
      </div>
      {delta && (
        <div className={`flex items-center gap-1 text-[var(--type-13)] ${trendColor}`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          <span className="dash-mono">{delta}</span>
        </div>
      )}
    </div>
  );
}

export function StatGrid({
  children,
  cols = 4,
}: {
  children: ReactNode;
  cols?: 2 | 3 | 4;
}) {
  const colClass =
    cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return <div className={`grid gap-6 grid-cols-1 ${colClass}`}>{children}</div>;
}
