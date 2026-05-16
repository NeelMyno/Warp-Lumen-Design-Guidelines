// Lumen CopyButton — Web React example. Three variants, three sizes.

"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type Variant = "ghost" | "pill" | "inline";
type Size = "xs" | "sm" | "md";

const SIZE: Record<Size, { box: string; icon: number; type: string }> = {
  xs: { box: "h-5 px-1",   icon: 10, type: "text-[var(--type-eyebrow-mono)]" },
  sm: { box: "h-6 px-1.5", icon: 12, type: "text-[var(--type-eyebrow-mono)]" },
  md: { box: "h-8 px-3",   icon: 14, type: "text-[var(--type-label-sm)]" },
};

export type CopyButtonProps = {
  value: string;
  variant?: Variant;
  size?: Size;
  label?: string;
  successLabel?: string;
  onCopied?: () => void;
  ariaLabel?: string;
};

export function CopyButton({
  value,
  variant = "ghost",
  size = "sm",
  label = "Copy",
  successLabel = "Copied",
  onCopied,
  ariaLabel,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const s = SIZE[size];

  const onClick = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCopied?.();
    setTimeout(() => setCopied(false), 1600);
  };

  const chrome = variant === "pill"
    ? "border border-[var(--color-border-hairline)] rounded-[var(--radius-pill)]"
    : "rounded-[var(--radius-control-sm)]";
  const inner =
    variant === "ghost" ? (
      <>{copied ? <Check size={s.icon} aria-hidden /> : <Copy size={s.icon} aria-hidden />}</>
    ) : (
      <>
        {copied ? <Check size={s.icon} aria-hidden /> : <Copy size={s.icon} aria-hidden />}
        <span>{copied ? successLabel : label}</span>
      </>
    );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? (variant === "ghost" ? "Copy" : undefined)}
      aria-live="polite"
      className={[
        "inline-flex items-center gap-1",
        s.box,
        s.type,
        chrome,
        "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        "hover:bg-[var(--color-action-ghost-bg-hover)]",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
        "transition-colors duration-[var(--motion-duration-fast)]",
        copied ? "text-[var(--color-text-accent)]" : "",
      ].join(" ")}
    >
      {inner}
    </button>
  );
}
