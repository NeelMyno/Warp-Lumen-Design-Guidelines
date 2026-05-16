// Lumen Trend — Web React example. Polarity-aware delta chip.

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

type Polarity = "positive-is-good" | "negative-is-good" | "neutral";
type Size = "xs" | "sm" | "md";

const SIZE: Record<Size, { type: string; icon: number; gap: string }> = {
  xs: { type: "text-[11px]", icon: 10, gap: "gap-0.5" },
  sm: { type: "text-[var(--type-label-sm)]", icon: 12, gap: "gap-1" },
  md: { type: "text-[var(--type-label-md)]", icon: 14, gap: "gap-1" },
};

export type TrendProps = {
  delta: number;
  suffix?: string;
  polarity?: Polarity;
  size?: Size;
  compact?: boolean;
  showArrow?: boolean;
  precision?: number;
  ariaPeriod?: string;
};

export function Trend({
  delta,
  suffix = "%",
  polarity = "positive-is-good",
  size = "sm",
  compact = false,
  showArrow = true,
  precision = 1,
  ariaPeriod,
}: TrendProps) {
  const sign = delta > 0 ? 1 : delta < 0 ? -1 : 0;
  const direction: "up" | "down" | "flat" = sign > 0 ? "up" : sign < 0 ? "down" : "flat";
  const good =
    polarity === "neutral"
      ? null
      : polarity === "positive-is-good"
      ? sign > 0
      : sign < 0;

  const tone =
    polarity === "neutral"
      ? "text-[var(--color-text-tertiary)]"
      : good
      ? "text-[var(--color-text-accent)]"
      : sign === 0
      ? "text-[var(--color-text-tertiary)]"
      : "text-[var(--color-text-error)]";

  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  const value = `${sign >= 0 ? "+" : "−"}${Math.abs(delta).toFixed(precision)}${compact ? "" : suffix}`;
  const srLabel = `${direction === "up" ? "Up" : direction === "down" ? "Down" : "Unchanged"} ${Math.abs(delta).toFixed(precision)}${suffix}${ariaPeriod ? ` versus ${ariaPeriod}` : ""}`;

  return (
    <span
      role="img"
      aria-label={srLabel}
      className={["lumen-tnum inline-flex items-center font-medium align-middle", SIZE[size].type, SIZE[size].gap, tone].join(" ")}
    >
      {showArrow && <Icon size={SIZE[size].icon} aria-hidden />}
      <span>{value}</span>
    </span>
  );
}
