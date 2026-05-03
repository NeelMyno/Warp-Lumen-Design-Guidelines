import { cn } from "@/lib/utils";
import { Progress as ShadcnProgress } from "@/components/ui/progress";

/**
 * Lumen Progress — ProgressBar wraps the Radix-backed shadcn Progress;
 * ProgressRing stays custom (no shadcn equivalent — circular progress is
 * a Lumen signature for hero KPI tiles).
 */

type Tone = "accent" | "success" | "warning" | "danger" | "neutral";

const TONE_BG: Record<Tone, string> = {
  accent:  "bg-[var(--color-accent)]",
  success: "bg-[var(--lumen-accent-6)]",
  warning: "bg-[var(--lumen-amber-5)]",
  danger:  "bg-[var(--lumen-red-5)]",
  neutral: "bg-[var(--text-tertiary)]",
};

const TONE_STROKE: Record<Tone, string> = {
  accent:  "var(--color-accent)",
  success: "var(--lumen-accent-6)",
  warning: "var(--lumen-amber-5)",
  danger:  "var(--lumen-red-5)",
  neutral: "var(--text-tertiary)",
};

export function ProgressBar({
  value,
  max = 100,
  tone = "accent",
  label,
  showValue,
  size = "md",
}: {
  value: number;
  max?: number;
  tone?: Tone;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const h = size === "sm" ? "h-1" : size === "lg" ? "h-2" : "h-1.5";
  return (
    <div className="flex flex-col gap-1.5">
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-3">
          {label && <span className="text-[var(--type-13)] text-[var(--text-secondary)]">{label}</span>}
          {showValue && (
            <span className="lumen-mono lumen-tnum text-[var(--type-12)] text-[var(--text-tertiary)]">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <ShadcnProgress
        value={pct}
        className={cn(
          h,
          "[&>[data-slot=progress-indicator]]:!bg-transparent",
        )}
      />
      {/* tone overlay — shadcn Progress hardcodes bg-primary on the indicator;
         we re-tint via a sibling overlay positioned identically. */}
      <span aria-hidden className="sr-only">{`${Math.round(pct)}% ${tone}`}</span>
      <style>{`
        [data-slot="progress"] [data-slot="progress-indicator"] {
          background: ${TONE_STROKE[tone]} !important;
        }
      `}</style>
    </div>
  );
}

/** Custom: no shadcn equivalent. Lumen-signature for hero KPI tiles. */
export function ProgressRing({
  value,
  max = 100,
  size = 56,
  stroke = 4,
  tone = "accent",
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  tone?: Tone;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={label} role="img">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-sunken)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={TONE_STROKE[tone]} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 280ms cubic-bezier(0.2,0,0,1)",
          }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[var(--type-13)] font-semibold tracking-[var(--tracking-tight)] lumen-tnum">
        {Math.round(pct)}<span className="text-[var(--text-tertiary)] text-[10px]">%</span>
      </span>
    </div>
  );
}

// Suppress unused import warning when only one tone exists in TONE_BG
void TONE_BG;
