// Lumen AISuggestion — Web React example.

"use client";

import { Sparkles, Check, X } from "lucide-react";
import { ReactNode } from "react";

export function AISuggestion({
  title,
  body,
  onAccept,
  onReject,
  acceptLabel = "Accept",
  rejectLabel = "Dismiss",
  compact,
}: {
  title?: string;
  body: ReactNode;
  onAccept?: () => void;
  onReject?: () => void;
  acceptLabel?: string;
  rejectLabel?: string;
  compact?: boolean;
}) {
  return (
    <aside
      role="complementary"
      aria-label="AI suggestion"
      className={[
        "relative rounded-[var(--radius-card-default)] border border-[var(--color-border-hairline)]",
        "bg-[var(--color-surface-tint-accent)]",
        compact ? "p-[var(--space-inset-md)]" : "p-[var(--space-inset-lg)]",
        "before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:rounded-r-full before:bg-[var(--color-text-accent)]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <Sparkles aria-hidden size={14} className="shrink-0 mt-0.5 text-[var(--color-text-accent)]" />
        <div className="min-w-0 flex-1">
          <span className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-accent)]">AI suggestion</span>
          {title && <p className="mt-0.5 text-[var(--type-label-md)] font-medium text-[var(--color-text-primary)]">{title}</p>}
          <div className="mt-1 text-[var(--type-body-sm)] text-[var(--color-text-secondary)]">{body}</div>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          {onReject && (
            <button
              type="button"
              onClick={onReject}
              aria-label={rejectLabel}
              className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-control-md)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]"
            >
              <X size={12} aria-hidden />
            </button>
          )}
          {onAccept && (
            <button
              type="button"
              onClick={onAccept}
              aria-label={acceptLabel}
              className="inline-flex h-7 px-2.5 items-center gap-1 rounded-[var(--radius-control-md)] bg-[var(--color-action-ai-bg-rest)] text-[var(--color-action-ai-fg)] text-[var(--type-label-sm)] font-medium hover:opacity-90"
            >
              <Check size={12} aria-hidden />
              {acceptLabel}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
