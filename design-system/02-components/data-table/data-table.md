---
name: DataTable
category: data
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["table", "filter-builder", "filter-chip", "saved-view", "pagination"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/data-table"
---

# DataTable

Virtualized data table — consumer brings the data (TanStack Table model); Lumen brings the visual contract. Sticky header, lime-tinted hover, brutalist hairlines, mono-numeric numerics. Composed sub-components: DataTable, DataTableHeader, DataTableHeaderCell, DataTableBody, DataTableRow, DataTableCell.

## When to use

- Tabular data ≥ 200 rows (virtualize).
- Operator dashboards (lane lists, shipment lists, carrier scorecards).
- Any table that needs sticky header + scroll-area composition.

## Anatomy

1. DataTable root — wraps a TanStack table instance
2. DataTableHeader — sticky top-0
3. DataTableHeaderCell — sortable label + chevron when sortable
4. DataTableBody — scrollable region
5. DataTableRow — lime-tinted hover, selected state via aria-selected
6. DataTableCell — padding + alignment

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Renders proper <table><thead><tbody><tr><th><td> semantics.
- Sortable headers are <button> children with aria-sort.
- Selected rows have aria-selected=true (consumer manages selection state via TanStack).

## Tokens consumed

- `surface.raised`
- `surface.sunken`
- `surface.tint-accent`
- `text.primary`
- `text.secondary`
- `text.tertiary`
- `border.hairline`
- `border.default`
- `tracking.tight`
- `tracking.wider`
- `type.13`
- `type.12`

## Do

- Bring your own TanStack Table.
- Use sticky header.
- Apply .lumen-tnum to numerics.

## Don't

- Don't roll a custom virtualizer when TanStack Virtual exists.
- Don't disable sticky header.

## Related

- table
- filter-builder
- filter-chip
- saved-view
- pagination

## Code

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
