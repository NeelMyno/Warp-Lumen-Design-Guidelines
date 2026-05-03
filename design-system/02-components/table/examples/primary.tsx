// Lumen Table — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/table.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.
//
// Operator-density data table. Hairline row dividers, no column dividers,
// sticky header, tabular numerics on numeric columns. Uses semantic
// <table>/<thead>/<tbody>/<th scope=…>/<td> per WCAG 1.3.1. Sortable columns
// set aria-sort; selected rows set aria-selected.

import { ReactNode, ThHTMLAttributes, TdHTMLAttributes, TableHTMLAttributes } from "react";

type Density = "compact" | "regular" | "cozy";

const ROW_HEIGHT: Record<Density, string> = {
  compact: "h-9",
  regular: "h-11",
  cozy: "h-12",
};

const CELL_PAD: Record<Density, string> = {
  compact: "px-3",
  regular: "px-4",
  cozy: "px-4",
};

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  density?: Density;
  stickyHeader?: boolean;
  zebra?: boolean;
};

export function Table({
  density = "regular",
  stickyHeader = true,
  zebra = false,
  className,
  children,
  ...props
}: TableProps) {
  return (
    <div
      className={[
        "w-full overflow-auto rounded-[var(--radius-lg)]",
        "border border-[var(--color-border-subtle)]",
        "bg-[var(--color-surface-raised)]",
      ].join(" ")}
    >
      <table
        {...props}
        data-density={density}
        data-zebra={zebra ? "true" : undefined}
        data-sticky={stickyHeader ? "true" : undefined}
        className={[
          "w-full border-collapse text-[var(--type-body-sm)]",
          "text-[var(--color-text-primary)]",
          className ?? "",
        ].join(" ")}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      {...props}
      className={[
        "bg-[var(--color-surface-sunken)]",
        "[[data-sticky=true]_&]:sticky [[data-sticky=true]_&]:top-0 [[data-sticky=true]_&]:z-10",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody {...props} className={className}>
      {children}
    </tbody>
  );
}

export function TableFoot({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      {...props}
      className={[
        "border-t border-[var(--color-border-subtle)]",
        "bg-[var(--color-surface-sunken)]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </tfoot>
  );
}

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  selected?: boolean;
};

export function TableRow({
  selected,
  className,
  children,
  ...props
}: TableRowProps) {
  return (
    <tr
      {...props}
      aria-selected={selected || undefined}
      className={[
        "border-b border-[var(--color-border-subtle)] last:border-0",
        "transition-colors duration-[var(--motion-transition-fast)]",
        "[[data-zebra=true]_tbody_&:nth-child(even)]:bg-[var(--color-surface-sunken)]",
        "hover:bg-[var(--color-surface-sunken)]",
        selected
          ? "bg-[var(--color-surface-tint-accent)]"
          : "",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </tr>
  );
}

type Align = "left" | "right" | "center";
const ALIGN: Record<Align, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export type TableHeadCellProps = ThHTMLAttributes<HTMLTableCellElement> & {
  align?: Align;
  /** Set "ascending", "descending", or "none" on sortable columns. */
  sort?: "ascending" | "descending" | "none";
  /** Numeric columns render in mono with tabular numerics. */
  numeric?: boolean;
};

export function TableHeadCell({
  align = "left",
  sort,
  numeric,
  className,
  children,
  scope = "col",
  ...props
}: TableHeadCellProps) {
  return (
    <th
      {...props}
      scope={scope}
      aria-sort={sort}
      className={[
        // Header cells use eyebrow ramp — uppercase, wider tracking, smaller.
        "h-10 font-medium uppercase",
        "text-[var(--type-eyebrow-mono)] tracking-[var(--tracking-wider)]",
        "text-[var(--color-text-tertiary)]",
        "[[data-density=compact]_&]:h-9",
        "[[data-density=cozy]_&]:h-12",
        ALIGN[align],
        numeric
          ? "[font-variant-numeric:tabular-nums_lining-nums_slashed-zero] [font-feature-settings:'tnum'_1,'lnum'_1,'zero'_1]"
          : "",
        // Density-driven horizontal padding.
        "[[data-density=compact]_&]:px-3",
        "[[data-density=regular]_&]:px-4",
        "[[data-density=cozy]_&]:px-4",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  align?: Align;
  /** Numeric cells right-align and render in mono with tabular numerics. */
  numeric?: boolean;
  /** Render as <th scope="row"> for row-header semantics. */
  header?: boolean;
};

export function TableCell({
  align,
  numeric,
  header,
  className,
  children,
  ...props
}: TableCellProps) {
  const finalAlign: Align = align ?? (numeric ? "right" : "left");
  const Tag = header ? "th" : "td";
  const headerAttrs = header ? { scope: "row" as const } : {};
  return (
    <Tag
      {...(props as TdHTMLAttributes<HTMLTableCellElement>)}
      {...headerAttrs}
      className={[
        ROW_HEIGHT.regular,
        "[[data-density=compact]_&]:" + ROW_HEIGHT.compact,
        "[[data-density=cozy]_&]:" + ROW_HEIGHT.cozy,
        CELL_PAD.regular,
        "[[data-density=compact]_&]:" + CELL_PAD.compact,
        ALIGN[finalAlign],
        "text-[var(--color-text-primary)] align-middle",
        numeric
          ? "[font-variant-numeric:tabular-nums_lining-nums_slashed-zero] [font-feature-settings:'tnum'_1,'lnum'_1,'zero'_1]"
          : "",
        header ? "font-medium text-[var(--color-text-primary)]" : "",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

/**
 * Convenience example: assemble a small shipments table.
 * Consumers typically compose <Table> + the part-components above directly.
 */
export function ExampleShipmentsTable({
  rows,
}: {
  rows: { id: string; lane: string; carrier: string; weight: string; rate: string; status: ReactNode }[];
}) {
  return (
    <Table density="regular" stickyHeader>
      <TableHeader>
        <TableRow>
          <TableHeadCell numeric>ID</TableHeadCell>
          <TableHeadCell>Lane</TableHeadCell>
          <TableHeadCell>Carrier</TableHeadCell>
          <TableHeadCell numeric>Weight</TableHeadCell>
          <TableHeadCell numeric>Rate</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell header numeric>
              {r.id}
            </TableCell>
            <TableCell>{r.lane}</TableCell>
            <TableCell>{r.carrier}</TableCell>
            <TableCell numeric>{r.weight}</TableCell>
            <TableCell numeric>{r.rate}</TableCell>
            <TableCell>{r.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
