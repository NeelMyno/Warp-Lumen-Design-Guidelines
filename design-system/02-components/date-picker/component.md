---
name: DatePicker
type: component
status: beta
version: 0.7.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [TimePicker, Field, Form, Input]
spec: ./component.json
last_updated: 2026-05-03
---

# DatePicker

> Read-only field-shell trigger with a leading calendar glyph. Click opens a portaled calendar popover. v0.7 ships the visual contract and a static calendar scaffold; consumers should compose `react-day-picker` for real selection logic.

## When to use
- Single-date picking (pickup date, due date, departure).
- Date-range picking (compose two DatePickers, or upgrade to a real range picker via `react-day-picker`).
- Forms where the user knows the date but doesn't want to type it.

## When NOT to use
- "When did this happen" timestamps the user can type freely → `Input` with `type="date"` (native).
- Far-future-or-past dates where typing is faster than navigating → free-text `Input` with format hint.
- Time-only entry → `TimePicker`.

## Anatomy

```
┌─ lumen-field (trigger) ─────────────────────┐
│  📅  May 3, 2026                            │
└─────────────────────────────────────────────┘
   ↓ click
┌─ calendar (portaled popover) ───────────────┐
│   May 2026                          ‹  ›    │
│   Mo Tu We Th Fr Sa Su                      │
│    .  .  .  1  2  3  4                      │
│    5  6  7  8  9 10 11                      │
│   12 13 14 15 16 17 18                      │ ← today: 12 (border-only)
│   19 20 21 22 23 24 25                      │ ← selected: 19 (lime fill)
│   26 27 28 29 30 31  .                      │
└─────────────────────────────────────────────┘
```

The trigger is a `.lumen-field` with a leading calendar glyph and a read-only `<input>` showing the formatted date (or a placeholder). The calendar lives in a portaled popover beneath the trigger; the popover uses the same surface + shadow as `Select.listbox`.

## States
Trigger: rest, hover, focus-visible, filled, error, disabled. Day cells: rest, hover, today (border-only), selected (lime fill, dark ink), out-of-month (muted), disabled.

## Accessibility
- Trigger is a real `<button>` (or a read-only `<input>` inside a labeled shell) — never a `<div>`.
- Open calendar via Space / Enter; close via Escape.
- Inside the calendar, day cells are `<button>` elements; arrow keys navigate the grid; PageUp/PageDown changes month.
- Today is marked by border, NOT fill — so it doesn't compete visually with the selected day.
- Honor `prefers-reduced-motion` — the open / close transition collapses to instant.

WCAG: 1.3.1, 1.4.3, 1.4.11, 2.1.1, 2.4.7, 2.5.8, 3.3.1, 4.1.2.

## Do
- Compose `react-day-picker` for real selection, locale, and range-picker logic — Lumen's contract defines the SHELL only.
- Format the displayed date per the user's locale via `Intl.DateTimeFormat`.
- Default the calendar to the selected month, OR to "today" if no selection.
- Use the calendar visual scaffold from `audit-dashboard/src/components/primitives/inputs.tsx#L646` as a starting point.

## Don't
- Don't ship the static calendar from the audit-dashboard scaffold to production — it has no real selection logic.
- Don't lock the user into the calendar — always let them paste / type a date in the trigger if your consumer adds that capability.
- Don't use lime fill for "today" — that competes with selection. Use border-only.

## Roadmap (v0.8)
- **Real picker logic** — first-party `react-day-picker` integration with locale + range support, owned by Lumen instead of left to the consumer.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitives (`DatePicker` + `DatePickerCalendar`) to a contract. Visual shell + scaffold calendar; real selection logic deferred to v0.8.
