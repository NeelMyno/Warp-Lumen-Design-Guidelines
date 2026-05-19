// Lumen AIBadge — Web React example. Four kinds.

// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

import { Sparkles } from "lucide-react";

type Kind = "generated" | "summary" | "confidence" | "thinking";
type Size = "xs" | "sm";

const SIZE: Record<Size, { box: string; icon: number; type: string }> = {
  xs: { box: "h-4 px-1.5", icon: 10, type: "text-[10px]" },
  sm: { box: "h-5 px-2",   icon: 11, type: "text-[var(--type-eyebrow-mono)]" },
};

export function AIBadge({
  kind = "generated",
  score,
  label,
  size = "sm",
}: {
  kind?: Kind;
  score?: number;
  label?: string;
  size?: Size;
}) {
  const text =
    label
      ?? (kind === "generated"  ? "AI generated"
        : kind === "summary"    ? "AI summary"
        : kind === "thinking"   ? "AI thinking"
        : kind === "confidence" ? `${Math.round(score ?? 0)}% confidence`
        : "AI");
  const aria = kind === "confidence" ? `AI generated content, ${Math.round(score ?? 0)}% confidence` : `AI ${kind} content`;
  return (
    <span
      role="img"
      aria-label={aria}
      className={[
        "inline-flex items-center gap-1 align-middle",
        SIZE[size].box,
        SIZE[size].type,
        "uppercase tracking-wider rounded-[var(--radius-pill)]",
        "bg-[var(--color-surface-tint-accent)] text-[var(--color-text-accent)]",
        kind === "thinking" ? "shadow-[var(--shadow-button-ai-shimmer)] motion-reduce:shadow-none" : "",
      ].join(" ")}
    >
      <Sparkles size={SIZE[size].icon} aria-hidden />
      <span>{text}</span>
      {kind === "thinking" && (
        <span aria-hidden className="inline-flex gap-0.5">
          <span className="size-1 rounded-full bg-current animate-pulse motion-reduce:animate-none" />
          <span className="size-1 rounded-full bg-current animate-pulse motion-reduce:animate-none" style={{ animationDelay: "100ms" }} />
          <span className="size-1 rounded-full bg-current animate-pulse motion-reduce:animate-none" style={{ animationDelay: "200ms" }} />
        </span>
      )}
    </span>
  );
}
