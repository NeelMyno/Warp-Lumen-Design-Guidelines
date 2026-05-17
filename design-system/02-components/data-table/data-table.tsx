"use client";

/**
 * @lumen/data-table — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Visual contract over TanStack Table. Consumer brings state (data, columns,
 * sorting, selection); Lumen brings sticky header, lime hover, hairline borders,
 * mono numerics. Virtualize via TanStack Virtual (consumer wires it).
 *
 * Sub-components compose semantically — use the real `<table><thead><tbody>`
 * tags so screen readers, browser table tools, and consumer CSS all work.
 */
import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

type Density = "sm" | "md" | "lg";

const DENSITY_CELL: Record<Density, string> = {
  sm: "h-9 px-3 text-[length:var(--type-13)]",
  md: "h-11 px-4 text-[length:var(--type-13)]",
  lg: "h-13 px-4 text-[length:var(--type-14)]",
};

export type DataTableProps<TData> = React.HTMLAttributes<HTMLTableElement> & {
  table?: Table<TData>;
  density?: Density;
  sticky?: boolean;
};

function DataTable<TData>({
  className,
  density = "md",
  sticky = true,
  children,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      data-slot="data-table-root"
      data-density={density}
      data-sticky={sticky || undefined}
      className={cn(
        "w-full overflow-auto rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)]",
        className,
      )}
    >
      <table
        data-slot="data-table"
        className="w-full caption-bottom border-collapse text-[color:var(--text-primary)]"
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

function DataTableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      data-slot="data-table-header"
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] bg-[var(--surface-sunken)] text-[color:var(--text-tertiary)]",
        "lumen-mono-cap text-[length:var(--type-11)] tracking-[var(--tracking-wider)]",
        className,
      )}
      {...props}
    />
  );
}

function DataTableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody data-slot="data-table-body" className={cn(className)} {...props} />;
}

function DataTableRow({
  className,
  selected,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) {
  return (
    <tr
      data-slot="data-table-row"
      data-selected={selected || undefined}
      aria-selected={selected || undefined}
      className={cn(
        "border-b border-[var(--border-hairline)] last:border-b-0",
        "transition-colors duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
        "hover:bg-[var(--surface-tint-accent)]",
        "data-[selected=true]:bg-[var(--surface-tint-accent)]",
        className,
      )}
      {...props}
    />
  );
}

type SortDir = false | "asc" | "desc";

function DataTableHeaderCell({
  className,
  children,
  sortable,
  sortDir = false,
  onSort,
  align = "left",
  density = "md",
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & {
  sortable?: boolean;
  sortDir?: SortDir;
  onSort?: () => void;
  align?: "left" | "right" | "center";
  density?: Density;
}) {
  const ariaSort =
    sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none";
  return (
    <th
      data-slot="data-table-header-cell"
      aria-sort={ariaSort}
      className={cn(
        "font-medium whitespace-nowrap text-left",
        DENSITY_CELL[density],
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          {children}
          {sortDir === "asc" ? (
            <ChevronUp className="size-3" aria-hidden />
          ) : sortDir === "desc" ? (
            <ChevronDown className="size-3" aria-hidden />
          ) : null}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

function DataTableCell({
  className,
  align = "left",
  density = "md",
  numeric,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "right" | "center";
  density?: Density;
  numeric?: boolean;
}) {
  return (
    <td
      data-slot="data-table-cell"
      data-numeric={numeric || undefined}
      className={cn(
        DENSITY_CELL[density],
        "align-middle",
        align === "right" && "text-right",
        align === "center" && "text-center",
        numeric && "lumen-tnum lumen-mono",
        className,
      )}
      {...props}
    />
  );
}

export {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHeaderCell,
  DataTableCell,
};
