// Lumen Spinner — Web React example.
// Pure CSS rotating arc. prefers-reduced-motion pauses the spin and shows a dim ring.

type Size = "xs" | "sm" | "md" | "lg";
type Tone = "default" | "accent" | "on-action" | "subtle";

const SIZE: Record<Size, { box: string; stroke: number }> = {
  xs: { box: "size-3",  stroke: 2 },
  sm: { box: "size-3.5", stroke: 2 },
  md: { box: "size-4",  stroke: 2 },
  lg: { box: "size-5",  stroke: 2 },
};

const TONE: Record<Tone, string> = {
  default:   "text-[var(--color-text-primary)]",
  accent:    "text-[var(--color-text-accent)]",
  "on-action": "text-[var(--color-action-primary-fg)]",
  subtle:    "text-[var(--color-text-tertiary)]",
};

export type SpinnerProps = {
  size?: Size;
  tone?: Tone;
  label?: string;
  inline?: boolean;
};

export function Spinner({ size = "md", tone = "default", label, inline = false }: SpinnerProps) {
  const s = SIZE[size];
  return (
    <span
      role="status"
      aria-label={label ?? "Loading"}
      className={[
        inline ? "inline-flex" : "flex",
        "items-center justify-center",
        TONE[tone],
      ].join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className={[s.box, "animate-spin motion-reduce:animate-none motion-reduce:opacity-50"].join(" ")}
        style={{ animationDuration: "var(--motion-duration-spin, 700ms)" }}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth={s.stroke} />
        <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth={s.stroke} strokeLinecap="round" />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
