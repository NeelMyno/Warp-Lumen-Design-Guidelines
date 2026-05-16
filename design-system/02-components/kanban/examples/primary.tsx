// Lumen Kanban — Web React example.
// Static skeleton. Production: integrate with react-aria's useDrag/useDrop +
// dnd-kit for the gesture, AND maintain keyboard Arrow/Space drag-equivalents.

"use client";

import { ReactNode } from "react";

export type KanbanColumn = { id: string; title: string; count?: number; wipLimit?: number };
export type KanbanCard = {
  id: string;
  columnId: string;
  title: ReactNode;
  body?: ReactNode;
  meta?: ReactNode;
  severity?: "low" | "med" | "high" | "critical";
};

export function Kanban({
  columns,
  cards,
  onCardClick,
  ariaLabel = "Kanban board",
}: {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onCardClick?: (id: string) => void;
  ariaLabel?: string;
}) {
  return (
    <div role="region" aria-label={ariaLabel} className="flex gap-3 overflow-x-auto pb-2">
      {columns.map((col) => {
        const colCards = cards.filter((c) => c.columnId === col.id);
        const overWip = col.wipLimit !== undefined && colCards.length > col.wipLimit;
        return (
          <section
            key={col.id}
            aria-label={`${col.title}, ${colCards.length} cards`}
            className="shrink-0 w-[280px] flex flex-col bg-[var(--color-surface-sunken)] rounded-[var(--radius-card-default)] border border-[var(--color-border-hairline)]"
          >
            <header className="flex items-center justify-between gap-2 px-3 h-10 border-b border-[var(--color-border-hairline)]">
              <span className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)] truncate">
                {col.title}
              </span>
              <span className={[
                "lumen-tnum text-[var(--type-eyebrow-mono)]",
                overWip ? "text-[var(--color-status-danger-fg)]" : "text-[var(--color-text-tertiary)]",
              ].join(" ")}>
                {colCards.length}{col.wipLimit !== undefined ? ` / ${col.wipLimit}` : ""}
              </span>
            </header>
            <ol role="list" className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
              {colCards.map((card) => (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => onCardClick?.(card.id)}
                    className={[
                      "block w-full text-left rounded-[var(--radius-popover)] bg-[var(--color-surface-raised)] border border-[var(--color-border-hairline)]",
                      "p-[var(--space-inset-md)]",
                      "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
                      "hover:shadow-[var(--shadow-elevation-md)] hover:border-[var(--color-border-default)]",
                      "transition-shadow duration-[var(--motion-duration-base)]",
                    ].join(" ")}
                  >
                    <p className="text-[var(--type-label-md)] font-medium text-[var(--color-text-primary)] mb-1">{card.title}</p>
                    {card.body && <p className="text-[var(--type-body-sm)] text-[var(--color-text-secondary)] line-clamp-2">{card.body}</p>}
                    {card.meta && <div className="mt-2 flex items-center gap-2 text-[var(--type-body-sm)] text-[var(--color-text-tertiary)]">{card.meta}</div>}
                  </button>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
