"use client";

/**
 * @lumen/filter-builder — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Query-DSL editor — operator/field/value chip rows. Each row is a triple.
 * Built from Lumen primitives (no external deps beyond lucide).
 */
import * as React from "react";
import { Plus, X, Filter as FilterIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type FilterFieldType = "text" | "number" | "date" | "select";

export type FilterField = {
  value: string;
  label: string;
  type: FilterFieldType;
  options?: { value: string; label: string }[];
};

export type FilterOperator =
  | "equals"
  | "not-equals"
  | "contains"
  | "starts-with"
  | "ends-with"
  | "gt"
  | "lt"
  | "between"
  | "in"
  | "before"
  | "after";

export type FilterRow = {
  id: string;
  field?: string;
  operator?: FilterOperator;
  value?: string;
};

const OPERATORS_BY_TYPE: Record<FilterFieldType, FilterOperator[]> = {
  text: ["equals", "not-equals", "contains", "starts-with", "ends-with"],
  number: ["equals", "not-equals", "gt", "lt", "between"],
  date: ["equals", "before", "after", "between"],
  select: ["equals", "not-equals", "in"],
};

const OPERATOR_LABEL: Record<FilterOperator, string> = {
  equals: "is",
  "not-equals": "is not",
  contains: "contains",
  "starts-with": "starts with",
  "ends-with": "ends with",
  gt: "greater than",
  lt: "less than",
  between: "between",
  in: "is one of",
  before: "before",
  after: "after",
};

export type FilterBuilderProps = {
  fields: FilterField[];
  value?: FilterRow[];
  onChange?: (v: FilterRow[]) => void;
  className?: string;
  emptyMessage?: string;
};

function newRow(): FilterRow {
  return { id: Math.random().toString(36).slice(2, 9) };
}

export function FilterBuilder({
  fields,
  value,
  onChange,
  className,
  emptyMessage = "No filters yet.",
}: FilterBuilderProps) {
  const [internal, setInternal] = React.useState<FilterRow[]>(value ?? []);
  const rows = value ?? internal;
  const setRows = (next: FilterRow[]) => {
    if (!value) setInternal(next);
    onChange?.(next);
  };

  const update = (id: string, patch: Partial<FilterRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: string) => setRows(rows.filter((r) => r.id !== id));
  const add = () => setRows([...rows, newRow()]);

  return (
    <div
      data-slot="filter-builder"
      role="group"
      aria-label="Filter builder"
      className={cn(
        "flex flex-col gap-2 p-3 rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--surface-raised)]",
        className,
      )}
    >
      {rows.length === 0 && (
        <p className="text-[length:var(--type-13)] text-[color:var(--text-tertiary)] text-center py-2">
          {emptyMessage}
        </p>
      )}
      {rows.map((row, i) => {
        const fieldDef = fields.find((f) => f.value === row.field);
        const operators = fieldDef ? OPERATORS_BY_TYPE[fieldDef.type] : [];
        return (
          <div
            key={row.id}
            role="group"
            aria-label={`Filter row ${i + 1}`}
            className="flex items-center gap-2 flex-wrap"
          >
            {i > 0 && (
              <span className="lumen-mono-cap text-[length:var(--type-10)] tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)] shrink-0 mr-1">
                AND
              </span>
            )}

            <select
              aria-label="Field"
              value={row.field ?? ""}
              onChange={(e) => update(row.id, { field: e.target.value, operator: undefined, value: "" })}
              className="h-8 px-2 rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface-input-rest)] text-[length:var(--type-13)] text-[color:var(--text-primary)] outline-none focus-visible:border-[var(--border-focus)]"
            >
              <option value="">Field…</option>
              {fields.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Operator"
              value={row.operator ?? ""}
              disabled={!fieldDef}
              onChange={(e) => update(row.id, { operator: e.target.value as FilterOperator })}
              className="h-8 px-2 rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface-input-rest)] text-[length:var(--type-13)] text-[color:var(--text-primary)] outline-none focus-visible:border-[var(--border-focus)] disabled:opacity-50"
            >
              <option value="">Operator…</option>
              {operators.map((op) => (
                <option key={op} value={op}>
                  {OPERATOR_LABEL[op]}
                </option>
              ))}
            </select>

            {fieldDef?.type === "select" && fieldDef.options ? (
              <select
                aria-label="Value"
                value={row.value ?? ""}
                onChange={(e) => update(row.id, { value: e.target.value })}
                className="h-8 px-2 rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface-input-rest)] text-[length:var(--type-13)] text-[color:var(--text-primary)] outline-none focus-visible:border-[var(--border-focus)]"
              >
                <option value="">Value…</option>
                {fieldDef.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                aria-label="Value"
                type={fieldDef?.type === "number" ? "number" : fieldDef?.type === "date" ? "date" : "text"}
                value={row.value ?? ""}
                onChange={(e) => update(row.id, { value: e.target.value })}
                placeholder="Value"
                disabled={!row.operator}
                className="h-8 px-2 min-w-[140px] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface-input-rest)] text-[length:var(--type-13)] text-[color:var(--text-primary)] outline-none focus-visible:border-[var(--border-focus)] disabled:opacity-50"
              />
            )}

            <button
              type="button"
              onClick={() => remove(row.id)}
              aria-label={`Remove filter ${i + 1}`}
              className="h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-xs)] text-[color:var(--text-tertiary)] hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-primary)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
            >
              <X size={14} aria-hidden />
            </button>
          </div>
        );
      })}

      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={add}
          className="lumen-btn lumen-btn-ghost lumen-btn-sm inline-flex items-center gap-2"
        >
          <Plus size={14} aria-hidden />
          Add filter
        </button>
        {rows.length > 0 && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-[length:var(--type-12)] text-[color:var(--text-tertiary)]">
            <FilterIcon size={12} aria-hidden />
            {rows.length} filter{rows.length === 1 ? "" : "s"}
          </span>
        )}
      </div>
    </div>
  );
}
