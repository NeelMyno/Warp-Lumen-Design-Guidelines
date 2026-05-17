---
name: lumen-data-table
description: Use for any tabular data set ≥ 200 rows where virtualization matters. The consumer brings TanStack Table state (columns + data + sorting + selection); Lumen brings sticky header, lime hover, hairline borders, mono-numerics. For static <200 rows, use the simpler @lumen/table.
---

# Lumen DataTable

Virtualized data table — consumer brings the data (TanStack Table model); Lumen brings the visual contract. Sticky header, lime-tinted hover, brutalist hairlines, mono-numeric numerics. Composed sub-components: DataTable, DataTableHeader, DataTableHeaderCell, DataTableBody, DataTableRow, DataTableCell.

## Use when

- Tabular data ≥ 200 rows (virtualize).
- Operator dashboards (lane lists, shipment lists, carrier scorecards).
- Any table that needs sticky header + scroll-area composition.

## NEVER

- NEVER hardcode column widths — use TanStack column sizing.
- NEVER skip sticky header on tall tables (>10 rows visible).
- NEVER use mixed numeric fonts — every numeric cell gets .lumen-tnum.

## Tokens consumed

- surface.raised
- surface.sunken
- surface.tint-accent
- text.primary
- text.secondary
- text.tertiary
- border.hairline
- border.default
- tracking.tight
- tracking.wider
- type.13
- type.12

## Anatomy

1. DataTable root — wraps a TanStack table instance
2. DataTableHeader — sticky top-0
3. DataTableHeaderCell — sortable label + chevron when sortable
4. DataTableBody — scrollable region
5. DataTableRow — lime-tinted hover, selected state via aria-selected
6. DataTableCell — padding + alignment

## API

- Composition over props — wrap a TanStack `table` instance.
- `density` — sm | md | lg via the parent DataTable className.
- `sticky` — boolean (default true) for sticky header.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Renders proper <table><thead><tbody><tr><th><td> semantics.
- Sortable headers are <button> children with aria-sort.
- Selected rows have aria-selected=true (consumer manages selection state via TanStack).

## Code (canonical)

```tsx
import { DataTable, DataTableHeader, DataTableHeaderCell, DataTableBody, DataTableRow, DataTableCell } from "@/components/ui/data-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

export function Example() {
  const table = useReactTable({ data: [], columns: [], getCoreRowModel: getCoreRowModel() });
  return (
    <DataTable table={table}>
      <DataTableHeader>
        <tr><DataTableHeaderCell>Lane</DataTableHeaderCell></tr>
      </DataTableHeader>
      <DataTableBody>
        <DataTableRow><DataTableCell>LAX → SFO</DataTableCell></DataTableRow>
      </DataTableBody>
    </DataTable>
  );
}
```

## Related

- table
- filter-builder
- filter-chip
- saved-view
- pagination
