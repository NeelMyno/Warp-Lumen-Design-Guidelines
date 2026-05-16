---
name: Pagination
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Table, Select, BottomNav]
spec: ./component.json
last_updated: 2026-05-15
---

# Pagination

> Move between fixed-size pages of a list, table, or feed. Numeric (operator default) and cursor (mobile / unknown-total default) layouts.

## When to use

- Tables and lists with a stable total count.
- Activity feeds where the user wants page anchors.
- Search results.

## When NOT to use

- Infinite-scroll surfaces — pick one model.
- Single-page resources — pagination on 1 page is dead chrome.
- Tabs / sub-navigation — those switch views, not pages of one view.

## Anatomy

1. **`<nav aria-label="Pagination">`** — landmark.
2. **Prev chevron** — disabled at page 1 via `aria-disabled`.
3. **Numeric anchors** — `<a>` (SSR) or `<button>` (CSR). Active anchor has `aria-current="page"`.
4. **Ellipsis** — `<span aria-hidden>…</span>`. Decorative; not interactive.
5. **Next chevron** — disabled at last page via `aria-disabled`.
6. **(Optional)** First / last `<<` `>>` chevrons.

## Variants

| Layout | Used for | Looks like |
|---|---|---|
| `numeric` | Tables, search results | `‹ 1 2 3 … 12 ›` |
| `cursor` | Mobile, activity feeds | `‹ Page 3 of 12 ›` |

## Truncation

`siblings=1, boundaries=1` produces `1 … 4 5 6 … 12` for active = 5 of 12.
`siblings=2, boundaries=1` produces `1 … 3 4 5 6 7 … 12` for active = 5 of 12.
The ellipsis is decorative — clicking it does nothing. (If you want it to open a page-jump menu, use a Combobox above the pagination.)

## Accessibility

- `<nav aria-label="Pagination">`.
- Active anchor: `aria-current="page"`.
- Disabled prev/next: `aria-disabled="true"`, kept in tab order.
- Digits wrapped in `.lumen-tnum` (tabular-nums) so the trail width holds steady as page numbers grow.
- `44x44` touch target floor on mobile (per WCAG 2.5.5 Enhanced).

## Do

- "Showing 41–60 of 248" above the pagination on data-dense surfaces.
- Default to `numeric` on desktop, `cursor` on mobile.
- Pair with a "Rows per page" Select when paginating server-side.
- Keep first + last always visible (`boundaries=1`).

## Don't

- Don't paint active page in lime fill — that's the action accent. Use `action.selected.bg` + `text.accent`.
- Don't remove disabled prev/next — set `aria-disabled`.
- Don't combine with infinite scroll.
- Don't render pagination on a 1-page resource.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
