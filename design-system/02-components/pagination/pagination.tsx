"use client";

/**
 * @lumen/pagination — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Page numbers + first / prev / next / last + ellipsis truncation.
 * Active page gets lime accent. Mono-numerics. Mode-agnostic.
 */
import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

function paginate(current: number, total: number, sibling = 1): Array<number | "ellipsis"> {
  const first = 1;
  const last = total;
  const left = Math.max(first, current - sibling);
  const right = Math.min(last, current + sibling);
  const showLeftEllipsis = left > first + 1;
  const showRightEllipsis = right < last - 1;

  const items: Array<number | "ellipsis"> = [];
  items.push(first);
  if (showLeftEllipsis) items.push("ellipsis");
  for (const p of range(left, right)) {
    if (p !== first && p !== last) items.push(p);
  }
  if (showRightEllipsis) items.push("ellipsis");
  if (last !== first) items.push(last);
  return items;
}

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (p: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className,
}: PaginationProps) {
  const items = React.useMemo(
    () => paginate(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount],
  );

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const navBtn = (
    label: string,
    icon: React.ReactNode,
    disabled: boolean,
    onClick: () => void,
  ) => (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && onClick()}
      className={cn(
        "h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-xs)] text-[color:var(--text-tertiary)] hover:bg-[var(--surface-tint-accent)] hover:text-[color:var(--text-primary)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none disabled:opacity-30 disabled:pointer-events-none",
      )}
    >
      {icon}
    </button>
  );

  return (
    <nav
      data-slot="pagination"
      aria-label="Pagination"
      className={cn("inline-flex items-center gap-1 lumen-tnum", className)}
    >
      {showFirstLast && navBtn("First page", <ChevronsLeft size={14} aria-hidden />, !canPrev, () => onPageChange?.(1))}
      {navBtn("Previous page", <ChevronLeft size={14} aria-hidden />, !canPrev, () => onPageChange?.(currentPage - 1))}
      {items.map((it, i) =>
        it === "ellipsis" ? (
          <span
            key={`e-${i}`}
            role="presentation"
            aria-hidden
            className="h-8 w-8 inline-flex items-center justify-center text-[color:var(--text-tertiary)]"
          >
            <MoreHorizontal size={14} />
          </span>
        ) : (
          <button
            key={it}
            type="button"
            aria-label={`Page ${it}`}
            aria-current={it === currentPage ? "page" : undefined}
            onClick={() => onPageChange?.(it)}
            className={cn(
              "h-8 min-w-8 px-2 inline-flex items-center justify-center rounded-[var(--radius-xs)] text-[length:var(--type-13)] text-[color:var(--text-tertiary)] hover:bg-[var(--surface-tint-accent)] hover:text-[color:var(--text-primary)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none",
              it === currentPage &&
                "bg-[var(--surface-tint-accent)] text-[color:var(--text-accent)] font-medium",
            )}
          >
            {it}
          </button>
        ),
      )}
      {navBtn("Next page", <ChevronRight size={14} aria-hidden />, !canNext, () => onPageChange?.(currentPage + 1))}
      {showFirstLast &&
        navBtn("Last page", <ChevronsRight size={14} aria-hidden />, !canNext, () => onPageChange?.(totalPages))}
    </nav>
  );
}
