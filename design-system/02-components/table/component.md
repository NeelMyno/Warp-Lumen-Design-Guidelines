---
name: Table
type: component
status: stable
version: 0.1.0
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Stat, Badge, EmptyState]
spec: ./component.json
last_updated: 2026-05-02
---

# Table

> Lumen's killer surface. Operator-density by default. Hairline row dividers, no column dividers, sticky header, tabular monospace numerics. The shipments table is the page where operators live.

## When to use
- Lists with multiple data columns where alignment matters.
- Anywhere users will scan many rows quickly.
- Numbers, IDs, ETAs, money — anything that benefits from column alignment.

## When NOT to use
- 1–3 columns of pure text — use a definition list (`<dl>`) or simple stack.
- Visual records with images — use `Card` grid.
- Forms — use a vertical stack of `Field`s.

## Anatomy
1. Container (Card with `padding=none`)
2. Header strip (title + Filter + secondary actions)
3. `<table>`: thead with `<th scope="col">`, tbody with hairline row dividers
4. Optional sticky-header behavior on overflow
5. Footer (pagination or empty state hint)

## Variants
| Prop | Values | Default |
|---|---|---|
| `density` | `compact` (32 px rows) / `regular` (40 px) / `cozy` (48 px) | `regular` |
| `stickyHeader` | boolean | `true` |
| `zebra` | boolean | `false` (off by default — hairlines do the work) |

## Accessibility
- `<table>` with proper `<thead>` / `<tbody>` / `<tfoot>`.
- `<th scope="col">` on header cells; `<th scope="row">` on row headers (if any).
- Sortable columns expose `aria-sort="ascending" | "descending" | "none"`.
- Selectable rows expose `aria-selected="true" | "false"`.
- Tabular numerics use `font-feature-settings: "tnum"` — visual alignment, NOT a substitute for `<th scope>`.
- Sticky header: `<thead>` keeps focus order intact; do not use CSS `position: sticky` on the body alone.

## Do
- Right-align numeric columns. Use `dash-mono` + `dash-tnum` so digits align.
- Use status `Badge`s in a Status column.
- Sticky the header for tables with > 12 rows.
- Use compact density for shipments / records lists.

## Don't
- Don't use column dividers. Hairline row dividers + alignment do the work.
- Don't put primary actions inside table cells. Use a row hover affordance or a context menu.
- Don't rely on row color alone to communicate status. Add a `Badge` or icon.

## Code
- [Web React](./examples/primary.tsx)
