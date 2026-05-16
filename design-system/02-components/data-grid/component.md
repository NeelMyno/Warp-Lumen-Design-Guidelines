---
name: DataGrid
type: component
status: beta
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Table, FilterBar, Drawer]
spec: ./component.json
last_updated: 2026-05-16
---

# DataGrid

> Power-user tabular surface built on Table. Column reorder / resize / freeze, inline edit, multi-select, group, expand.

## When to use

- Operator tables with > 50 rows + power users.
- Data-engineering surfaces.
- Admin consoles with column-management needs.

## When NOT to use

- < 50 rows, read-only — **Table**.
- Hierarchical — **TreeView**.
- Kanban-style — **Kanban**.

## Accessibility

- `role="grid"`, `role="row"`, `role="gridcell"`, `role="columnheader"`.
- Sortable headers `aria-sort`.
- Selection: `aria-label` + bulk count via `aria-live`.
- Keyboard: Arrows + Home/End + Ctrl+A + F2/Enter for edit.

## Do

- Persist user prefs in localStorage.
- Virtualize past 1000 rows.
- Tabular-nums on numeric columns.

## Don't

- Don't use for < 50 rows.
- Don't lime-fill selected rows.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release (beta).
