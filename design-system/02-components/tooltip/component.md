---
name: Tooltip
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Popover, IconButton, Kbd]
spec: ./component.json
last_updated: 2026-05-16
---

# Tooltip

> A small portaled bubble that names a control or clarifies a value. Informational only — no actions inside.

## When to use

- Icon-only buttons (the IconButton's accessible name).
- Truncated table column headers.
- Keyboard shortcut reveal on hover ("Save ⌘S").
- A small value disambiguation (date format, currency code).

## When NOT to use

- Anything interactive in the bubble — use **Popover**.
- More than 2 lines of prose — use **Popover**.
- Touch surfaces — long-press is not a tooltip.
- Critical UI text that must be visible to all users — render it inline.

## Anatomy

1. **Trigger** — any focusable element.
2. **Content** — `role="tooltip"`, portaled to `document.body` (hard rule 10).
3. **Arrow** — 6 px chevron pointing at the trigger (optional).

## Timing

- **Show delay** — 700 ms hover-intent. Matches Apple HIG.
- **Hide delay** — 100 ms after pointer leaves.
- **Focus** — show on `:focus-visible` immediately; hide on blur immediately.
- **Escape** — hides immediately.

## Accessibility

- WCAG 1.4.13 — dismissible (Escape), hoverable (you can mouse onto the bubble), persistent (doesn't auto-disappear).
- Wire `aria-labelledby={tooltipId}` on icon-only triggers — SR users get the label without hovering.
- Portaled to `document.body`.

## Do

- One sentence-case line.
- Pair with Kbd for shortcut reveal: "Save  ⌘S".
- Show on focus, not just hover.

## Don't

- Don't put buttons or links in the bubble.
- Don't show on touch.
- Don't auto-show without user intent.
- Don't render inline — portal.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release. Radix Tooltip wrapper.
