// Lumen Breadcrumbs — Web React example
// Truncate-to-menu pattern: middle items collapse into an ellipsis that opens
// a DropdownMenu listing the hidden links. Always wrap in <nav aria-label="Breadcrumb">.

"use client";

import { ChevronRight, MoreHorizontal } from "lucide-react";
import { Children, isValidElement, ReactNode, useMemo } from "react";

type Size = "sm" | "md";

const SIZE: Record<Size, { type: string; gap: string }> = {
  sm: { type: "text-[var(--type-label-sm)]", gap: "gap-[var(--space-inline-xs)]" },
  md: { type: "text-[var(--type-label-md)]", gap: "gap-[var(--space-inline-sm)]" },
};

export type BreadcrumbsProps = {
  children: ReactNode;
  maxItems?: number;
  size?: Size;
  separator?: ReactNode;
};

export function Breadcrumbs({ children, maxItems = 4, size = "sm", separator }: BreadcrumbsProps) {
  const items = Children.toArray(children).filter(isValidElement);
  const Sep = separator ?? <ChevronRight aria-hidden size={size === "sm" ? 12 : 14} className="text-[var(--color-text-tertiary)]" />;

  const visible = useMemo(() => {
    if (items.length <= maxItems) return items.map((item) => ({ kind: "item" as const, item }));
    // Show first + ellipsis + last (maxItems - 2) items.
    const tailCount = maxItems - 2;
    const hidden = items.slice(1, items.length - tailCount);
    return [
      { kind: "item" as const, item: items[0] },
      { kind: "ellipsis" as const, hidden },
      ...items.slice(items.length - tailCount).map((item) => ({ kind: "item" as const, item })),
    ];
  }, [items, maxItems]);

  return (
    <nav aria-label="Breadcrumb" className={SIZE[size].type}>
      <ol className={["flex flex-wrap items-center", SIZE[size].gap].join(" ")}>
        {visible.map((node, i) => (
          <li key={i} className={["flex items-center", SIZE[size].gap].join(" ")}>
            {node.kind === "item" ? node.item : <BreadcrumbEllipsis hidden={node.hidden} />}
            {i < visible.length - 1 && <span aria-hidden>{Sep}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function BreadcrumbLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={[
        "rounded-[var(--radius-control-sm)] px-1 -mx-1",
        "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        "transition-colors duration-[var(--motion-duration-fast)]",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
        "focus-visible:shadow-[var(--shadow-focus)]",
      ].join(" ")}
    >
      {children}
    </a>
  );
}

export function BreadcrumbCurrent({ children }: { children: ReactNode }) {
  return (
    <span aria-current="page" className="text-[var(--color-text-primary)] font-medium">
      {children}
    </span>
  );
}

function BreadcrumbEllipsis({ hidden }: { hidden: ReactNode[] }) {
  // In production wire this to the Lumen DropdownMenu. The skeleton keeps the
  // hidden-link references on the button for SR via aria-label.
  const labels = hidden
    .map((node) => (isValidElement(node) && typeof (node.props as { children?: ReactNode }).children === "string"
      ? ((node.props as { children: string }).children)
      : ""))
    .filter(Boolean)
    .join(", ");
  return (
    <button
      type="button"
      aria-label={`Show more pages${labels ? ` (${labels})` : ""}`}
      className={[
        "inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-control-sm)]",
        "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]",
        "hover:bg-[var(--color-action-ghost-bg-hover)]",
        "transition-colors duration-[var(--motion-duration-fast)]",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
        "focus-visible:shadow-[var(--shadow-focus)]",
      ].join(" ")}
    >
      <MoreHorizontal aria-hidden size={14} />
    </button>
  );
}
