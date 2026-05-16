---
name: Calendar
type: component
status: beta
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [DatePicker, TimePicker, Popover]
spec: ./component.json
last_updated: 2026-05-16
---

# Calendar

> Standalone calendar surface. Month / week / agenda views.

## When to use

- Scheduling / availability surfaces.
- Resource booking.
- Event view next to a list.

## When NOT to use

- Single-value input — **DatePicker**.
- Time-of-day only — **TimePicker**.

## Views

`month` (default grid) / `week` (7-column day-rows) / `agenda` (event-grouped list).

## Accessibility

- `role="grid"`, `role="row"`, `role="gridcell"`.
- Full `aria-label` per cell.
- `aria-current="date"` on today.
- `aria-selected` on selected.
- Keyboard: arrows, PageUp/Down, Home/End, T = today.

## Do

- Tabular-nums for day numbers.
- 2 px accent ring on today.
- Event dot indicators (up to 3 + "+N").

## Don't

- Don't solid-lime selected.
- Don't drop weekday headers.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release (beta).
