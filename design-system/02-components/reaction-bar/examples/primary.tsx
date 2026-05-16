// Lumen ReactionBar — Web React example.

"use client";

import { Plus } from "lucide-react";

export type Reaction = { emoji: string; count: number; mine?: boolean };

export function ReactionBar({
  reactions,
  onToggle,
  onAdd,
  size = "sm",
}: {
  reactions: Reaction[];
  onToggle: (emoji: string) => void;
  onAdd?: () => void;
  size?: "xs" | "sm";
}) {
  const h = size === "xs" ? "h-5" : "h-6";
  const text = size === "xs" ? "text-[10px]" : "text-[var(--type-label-sm)]";
  return (
    <div role="group" aria-label="Reactions" className="inline-flex flex-wrap items-center gap-1">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          type="button"
          aria-pressed={r.mine || undefined}
          aria-label={`${r.emoji}, ${r.count} reactions${r.mine ? ", you reacted" : ""}`}
          onClick={() => onToggle(r.emoji)}
          className={[
            "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2",
            h, text,
            r.mine
              ? "bg-[var(--color-action-selected-bg)] border border-[var(--color-action-selected-border)] text-[var(--color-text-accent)]"
              : "border border-[var(--color-border-hairline)] bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]",
            "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
            "transition-colors duration-[var(--motion-duration-fast)]",
          ].join(" ")}
        >
          <span aria-hidden>{r.emoji}</span>
          <span className="lumen-tnum">{r.count}</span>
        </button>
      ))}
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add reaction"
          className={[
            "inline-flex items-center justify-center rounded-[var(--radius-pill)] w-6",
            h,
            "border border-[var(--color-border-hairline)] bg-transparent text-[var(--color-text-tertiary)] hover:bg-[var(--color-action-ghost-bg-hover)] hover:text-[var(--color-text-primary)]",
            "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
          ].join(" ")}
        >
          <Plus size={10} aria-hidden />
        </button>
      )}
    </div>
  );
}
