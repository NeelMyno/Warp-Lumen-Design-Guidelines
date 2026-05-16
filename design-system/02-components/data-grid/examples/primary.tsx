// Lumen DataGrid — Web React example.
// Skeleton. Production: integrate with @tanstack/react-table for column / sort /
// selection / virtualization state.

"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { ReactNode, useState } from "react";

export type GridColumn<T> = {
  id: string;
  label: string;
  align?: "start" | "end";
  width?: number;
  sortable?: boolean;
  render: (row: T) => ReactNode;
};

export function DataGrid<T extends { id: string }>({
  columns,
  rows,
  ariaLabel,
  density = "regular",
  selectable = "none",
  selectedIds,
  onSelectionChange,
}: {
  columns: GridColumn<T>[];
  rows: T[];
  ariaLabel: string;
  density?: "compact" | "regular" | "comfortable";
  selectable?: "none" | "single" | "multi";
  selectedIds?: Set<string>;
  onSelectionChange?: (next: Set<string>) => void;
}) {
  const [sort, setSort] = useState<{ id: string; dir: "asc" | "desc" } | null>(null);
  const rowH = density === "compact" ? "h-8" : density === "comfortable" ? "h-12" : "h-10";

  const onSortClick = (id: string) => {
    setSort((s) => (s?.id === id ? (s.dir === "asc" ? { id, dir: "desc" } : null) : { id, dir: "asc" }));
  };

  const onSelect = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedIds ?? []);
    if (selectable === "single") { next.clear(); if (checked) next.add(id); }
    else { if (checked) next.add(id); else next.delete(id); }
    onSelectionChange(next);
  };

  return (
    <div role="grid" aria-label={ariaLabel} className="rounded-[var(--radius-control-md)] border border-[var(--color-border-hairline)] overflow-hidden">
      {selectedIds && selectedIds.size > 0 && (
        <div role="status" aria-live="polite" className="px-3 py-2 bg-[var(--color-action-selected-bg)] border-b border-[var(--color-action-selected-border)] text-[var(--type-label-sm)] text-[var(--color-text-accent)]">
          <span className="lumen-tnum">{selectedIds.size}</span> rows selected
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr role="row" className="bg-[var(--color-surface-sunken)] border-b border-[var(--color-border-default)]">
            {selectable !== "none" && (
              <th role="columnheader" className="w-9 text-center">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={selectedIds?.size === rows.length}
                  onChange={(e) => {
                    if (!onSelectionChange) return;
                    onSelectionChange(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set());
                  }}
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sort?.id === col.id;
              const sortLabel = !isSorted ? "none" : sort?.dir === "asc" ? "ascending" : "descending";
              return (
                <th
                  key={col.id}
                  role="columnheader"
                  aria-sort={sortLabel as "ascending" | "descending" | "none"}
                  className={[
                    "px-3 text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]",
                    "select-none",
                    col.align === "end" ? "text-right" : "text-left",
                    "h-9",
                  ].join(" ")}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <button
                    type="button"
                    disabled={!col.sortable}
                    onClick={() => col.sortable && onSortClick(col.id)}
                    className="inline-flex items-center gap-1 hover:text-[var(--color-text-primary)] disabled:cursor-default"
                  >
                    <span>{col.label}</span>
                    {col.sortable && (
                      !isSorted ? <ArrowUpDown size={10} aria-hidden /> :
                      sort?.dir === "asc" ? <ArrowUp size={10} aria-hidden /> : <ArrowDown size={10} aria-hidden />
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isSelected = !!selectedIds?.has(row.id);
            return (
              <tr
                key={row.id}
                role="row"
                aria-selected={isSelected}
                className={[
                  rowH, "border-b border-[var(--color-border-hairline)] last:border-b-0",
                  isSelected ? "bg-[var(--color-action-selected-bg)]" : "hover:bg-[var(--color-action-ghost-bg-hover)]",
                ].join(" ")}
              >
                {selectable !== "none" && (
                  <td role="gridcell" className="w-9 text-center">
                    <input
                      type="checkbox"
                      aria-label={`Select row`}
                      checked={isSelected}
                      onChange={(e) => onSelect(row.id, e.target.checked)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.id}
                    role="gridcell"
                    className={[
                      "px-3 text-[var(--type-label-md)] text-[var(--color-text-primary)]",
                      col.align === "end" ? "text-right lumen-tnum" : "",
                    ].join(" ")}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
