// Lumen List + ListItem — Web React example.
// <ul> / <ol> / <dl> semantic root. Three variants. Three densities.

// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

"use client";

import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

type Kind = "unordered" | "ordered" | "description";
type Variant = "plain" | "structured" | "interactive";
type Density = "compact" | "regular" | "comfortable";
type DividerMode = "none" | "hairline" | "subtle" | "inset";

const DENSITY: Record<Density, string> = {
  compact:     "min-h-[32px] py-1",
  regular:     "min-h-[44px] py-2",
  comfortable: "min-h-[56px] py-3",
};

const DIVIDER: Record<DividerMode, string> = {
  none:     "",
  hairline: "[&>li]:border-b [&>li]:border-[var(--color-border-hairline)] [&>li:last-child]:border-b-0",
  subtle:   "[&>li]:border-b [&>li]:border-[var(--color-border-subtle)] [&>li:last-child]:border-b-0",
  inset:    "[&>li]:border-b [&>li]:border-[var(--color-border-hairline)] [&>li:last-child]:border-b-0 [&>li]:relative",
};

export type ListProps = {
  kind?: Kind;
  variant?: Variant;
  density?: Density;
  divider?: DividerMode;
  border?: "none" | "card";
  children: ReactNode;
  className?: string;
};

export function List({
  kind = "unordered",
  variant = "structured",
  density = "regular",
  divider = "hairline",
  border = "none",
  children,
  className,
}: ListProps) {
  const Tag = kind === "ordered" ? "ol" : kind === "description" ? "dl" : "ul";
  const cardWrap = border === "card"
    ? "rounded-[var(--radius-card-default)] border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] overflow-hidden"
    : "";
  const plainList = variant === "plain"
    ? (kind === "ordered" ? "list-decimal pl-6 marker:text-[var(--color-text-tertiary)]" : "list-disc pl-6 marker:text-[var(--color-text-tertiary)]")
    : "list-none p-0";

  return (
    <Tag
      role="list"
      data-variant={variant}
      data-density={density}
      className={[plainList, DIVIDER[divider], cardWrap, className ?? ""].join(" ")}
    >
      {children}
    </Tag>
  );
}

export type ListItemProps = {
  leading?: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
  density?: Density;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  asLink?: string;
  className?: string;
};

export function ListItem({
  leading,
  label,
  description,
  trailing,
  density = "regular",
  interactive = false,
  selected = false,
  onClick,
  asLink,
  className,
}: ListItemProps) {
  const inner = (
    <span
      className={[
        "flex w-full items-center gap-[var(--space-inline-md)]",
        "px-[var(--space-inset-lg)]",
        DENSITY[density],
        selected ? "bg-[var(--color-action-selected-bg)]" : "",
        interactive ? "hover:bg-[var(--color-action-ghost-bg-hover)] transition-colors duration-[var(--motion-duration-fast)]" : "",
      ].join(" ")}
    >
      {leading && <span className="shrink-0 text-[var(--color-text-tertiary)]">{leading}</span>}
      <span className="min-w-0 flex-1 flex flex-col">
        <span className="text-[var(--type-label-md)] text-[var(--color-text-primary)] truncate">{label}</span>
        {description && (
          <span className="text-[var(--type-body-sm)] text-[var(--color-text-tertiary)] truncate">{description}</span>
        )}
      </span>
      {trailing && <span className="shrink-0 text-[var(--color-text-secondary)]">{trailing}</span>}
      {interactive && !trailing && <ChevronRight size={14} aria-hidden className="shrink-0 text-[var(--color-text-tertiary)]" />}
    </span>
  );

  if (asLink) {
    return (
      <li>
        <a
          href={asLink}
          className={[
            "block outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:shadow-[var(--shadow-focus)]",
            className ?? "",
          ].join(" ")}
        >
          {inner}
        </a>
      </li>
    );
  }
  if (interactive) {
    return (
      <li>
        <button
          type="button"
          onClick={onClick}
          aria-pressed={selected || undefined}
          className={[
            "block w-full text-left outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:shadow-[var(--shadow-focus)]",
            className ?? "",
          ].join(" ")}
        >
          {inner}
        </button>
      </li>
    );
  }
  return <li className={className ?? ""}>{inner}</li>;
}
