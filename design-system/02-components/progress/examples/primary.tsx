// Lumen Progress — Web React example.
// Linear (default) + circular shapes. Determinate when value is provided,
// indeterminate (sweep animation) when value is undefined.

type Shape = "linear" | "circular";
type Tone = "accent" | "neutral" | "success" | "warning" | "danger";
type Thickness = "xs" | "sm" | "md";
type CircSize = "sm" | "md" | "lg" | "xl";

const TONE_FG: Record<Tone, string> = {
  accent:  "bg-[var(--color-accent-500)] text-[var(--color-text-accent)]",
  neutral: "bg-[var(--color-text-primary)] text-[var(--color-text-primary)]",
  success: "bg-[var(--color-status-success-500)] text-[var(--color-text-success)]",
  warning: "bg-[var(--color-status-warning-500)] text-[var(--color-text-warning)]",
  danger:  "bg-[var(--color-status-danger-500)]  text-[var(--color-text-error)]",
};

const THICKNESS: Record<Thickness, string> = {
  xs: "h-0.5",
  sm: "h-1",
  md: "h-2",
};

const RING_SIZE: Record<CircSize, { size: number; stroke: number }> = {
  sm: { size: 20, stroke: 2 },
  md: { size: 32, stroke: 3 },
  lg: { size: 48, stroke: 4 },
  xl: { size: 72, stroke: 6 },
};

export type ProgressProps = {
  value?: number;
  max?: number;
  shape?: Shape;
  tone?: Tone;
  thickness?: Thickness;
  size?: CircSize;
  label?: string;
  valueLabel?: string;
  showValue?: boolean;
  className?: string;
};

export function Progress({
  value,
  max = 100,
  shape = "linear",
  tone = "accent",
  thickness = "sm",
  size = "md",
  label,
  valueLabel,
  showValue,
  className,
}: ProgressProps) {
  const indeterminate = value === undefined || value === null;
  const pct = indeterminate ? null : Math.min(100, Math.max(0, ((value as number) / max) * 100));
  const derivedValueLabel = valueLabel ?? (showValue && !indeterminate ? `${Math.round(pct as number)}%` : undefined);

  if (shape === "circular") {
    const { size: d, stroke } = RING_SIZE[size];
    const r = (d - stroke) / 2;
    const circumference = 2 * Math.PI * r;
    const dash = indeterminate ? `${circumference / 3} ${circumference}` : `${(pct as number) / 100 * circumference} ${circumference}`;
    const t = TONE_FG[tone];
    const stroke_color = t.split(" ")[0].replace("bg-", "stroke-");
    return (
      <span
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? "Progress"}
        className={["inline-flex items-center justify-center", className ?? ""].join(" ")}
        style={{ width: d, height: d }}
      >
        <svg viewBox={`0 0 ${d} ${d}`} className={[indeterminate ? "animate-spin" : "", "motion-reduce:animate-none"].join(" ")} style={{ animationDuration: "1.2s" }}>
          <circle cx={d/2} cy={d/2} r={r} fill="none" stroke="var(--color-surface-sunken)" strokeWidth={stroke} />
          <circle
            cx={d/2} cy={d/2} r={r}
            fill="none"
            className={stroke_color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={dash}
            transform={`rotate(-90 ${d/2} ${d/2})`}
            style={{ transition: "stroke-dasharray var(--motion-duration-base, 240ms) cubic-bezier(0.2, 0, 0, 1)" }}
          />
        </svg>
      </span>
    );
  }

  return (
    <div className={["w-full flex flex-col gap-[var(--space-stack-xs)]", className ?? ""].join(" ")}>
      {(label || derivedValueLabel) && (
        <div className="flex items-center justify-between text-[var(--type-label-sm)]">
          {label && <span className="text-[var(--color-text-secondary)]">{label}</span>}
          {derivedValueLabel && <span className="lumen-tnum text-[var(--color-text-tertiary)]">{derivedValueLabel}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? "Progress"}
        className={[
          "w-full rounded-[var(--radius-pill)] bg-[var(--color-surface-sunken)] overflow-hidden",
          THICKNESS[thickness],
        ].join(" ")}
      >
        <div
          className={[
            "h-full rounded-[var(--radius-pill)]",
            TONE_FG[tone].split(" ")[0],
            indeterminate ? "w-1/3 animate-[lumen-prog-sweep_1.2s_ease-in-out_infinite] motion-reduce:animate-none" : "",
          ].join(" ")}
          style={
            indeterminate
              ? undefined
              : {
                  width: `${pct}%`,
                  transition: "width var(--motion-duration-base, 240ms) cubic-bezier(0.2, 0, 0, 1)",
                }
          }
        />
      </div>
      <style>{`@keyframes lumen-prog-sweep { 0% { transform: translateX(-100%);} 100% { transform: translateX(300%);} } @media (prefers-reduced-motion: reduce) { [style*="lumen-prog-sweep"] { animation: none !important } *[style*="transition"] { transition: none !important } }`}</style>
    </div>
  );
}
