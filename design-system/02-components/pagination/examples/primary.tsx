// Lumen Pagination — Web React example
// Numeric layout with siblings/boundaries collapse. Cursor layout via
// layout="cursor" + hasNext/hasPrev (when pageCount is unknown).

"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type Size = "sm" | "md";
type Layout = "numeric" | "cursor";

const SIZE: Record<Size, string> = {
  sm: "h-7 min-w-7 text-[var(--type-label-sm)]",
  md: "h-9 min-w-9 text-[var(--type-label-md)]",
};

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  layout?: Layout;
  siblings?: number;
  boundaries?: number;
  showFirstLast?: boolean;
  size?: Size;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export function Pagination({
  page,
  pageCount,
  onPageChange,
  layout = "numeric",
  siblings = 1,
  boundaries = 1,
  showFirstLast = false,
  size = "sm",
  hasNext,
  hasPrev,
}: PaginationProps) {
  const canPrev = hasPrev ?? page > 1;
  const canNext = hasNext ?? page < pageCount;

  if (layout === "cursor") {
    return (
      <nav aria-label="Pagination" className="flex items-center gap-[var(--space-inline-sm)]">
        <PaginationButton size={size} label="Previous page" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={14} aria-hidden />
        </PaginationButton>
        <span className={["lumen-tnum text-[var(--color-text-secondary)]", SIZE[size]].join(" ")}>
          Page <span className="text-[var(--color-text-primary)] font-medium">{page}</span> of {pageCount || "…"}
        </span>
        <PaginationButton size={size} label="Next page" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
          <ChevronRight size={14} aria-hidden />
        </PaginationButton>
      </nav>
    );
  }

  const items = buildItems({ page, pageCount, siblings, boundaries });

  return (
    <nav aria-label="Pagination" className="flex items-center gap-[var(--space-inline-xs)]">
      {showFirstLast && (
        <PaginationButton size={size} label="First page" disabled={!canPrev} onClick={() => onPageChange(1)}>
          <ChevronsLeft size={14} aria-hidden />
        </PaginationButton>
      )}
      <PaginationButton size={size} label="Previous page" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={14} aria-hidden />
      </PaginationButton>
      {items.map((it, i) =>
        it === "ellipsis" ? (
          <span key={`e-${i}`} aria-hidden className={[SIZE[size], "inline-flex items-center justify-center text-[var(--color-text-tertiary)]"].join(" ")}>
            …
          </span>
        ) : (
          <PaginationAnchor
            key={it}
            size={size}
            active={it === page}
            onClick={() => onPageChange(it)}
          >
            {it}
          </PaginationAnchor>
        ),
      )}
      <PaginationButton size={size} label="Next page" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
        <ChevronRight size={14} aria-hidden />
      </PaginationButton>
      {showFirstLast && (
        <PaginationButton size={size} label="Last page" disabled={!canNext} onClick={() => onPageChange(pageCount)}>
          <ChevronsRight size={14} aria-hidden />
        </PaginationButton>
      )}
    </nav>
  );
}

function PaginationButton({
  children,
  size,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  size: Size;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onClick}
      className={[
        SIZE[size],
        "inline-flex items-center justify-center rounded-[var(--radius-control-md)]",
        "text-[var(--color-text-secondary)]",
        "hover:text-[var(--color-text-primary)] hover:bg-[var(--color-action-ghost-bg-hover)]",
        "transition-colors duration-[var(--motion-duration-fast)]",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
        "focus-visible:shadow-[var(--shadow-focus)]",
        "aria-disabled:opacity-40 aria-disabled:pointer-events-none",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function PaginationAnchor({
  children,
  size,
  active,
  onClick,
}: {
  children: React.ReactNode;
  size: Size;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={[
        SIZE[size],
        "lumen-tnum inline-flex items-center justify-center rounded-[var(--radius-control-md)] px-2",
        "transition-colors duration-[var(--motion-duration-fast)]",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
        "focus-visible:shadow-[var(--shadow-focus)]",
        active
          ? "bg-[var(--color-action-selected-bg)] text-[var(--color-text-accent)] border border-[var(--color-action-selected-border)]"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-action-ghost-bg-hover)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function buildItems({
  page,
  pageCount,
  siblings,
  boundaries,
}: {
  page: number;
  pageCount: number;
  siblings: number;
  boundaries: number;
}): (number | "ellipsis")[] {
  if (pageCount <= 0) return [];
  const total = boundaries + siblings + 1 + siblings + boundaries + 2; // start + leftEllipsis + middle + rightEllipsis + end
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);

  const startPages = Array.from({ length: boundaries }, (_, i) => i + 1);
  const endPages = Array.from({ length: boundaries }, (_, i) => pageCount - boundaries + i + 1);

  const leftSibling = Math.max(page - siblings, boundaries + 2);
  const rightSibling = Math.min(page + siblings, pageCount - boundaries - 1);

  const middle: number[] = [];
  for (let i = leftSibling; i <= rightSibling; i++) middle.push(i);

  const items: (number | "ellipsis")[] = [...startPages];
  if (leftSibling > boundaries + 1) items.push("ellipsis");
  else if (leftSibling === boundaries + 1) items.push(boundaries + 1);
  items.push(...middle);
  if (rightSibling < pageCount - boundaries) items.push("ellipsis");
  else if (rightSibling === pageCount - boundaries - 1) items.push(pageCount - boundaries);
  items.push(...endPages);
  return items;
}
