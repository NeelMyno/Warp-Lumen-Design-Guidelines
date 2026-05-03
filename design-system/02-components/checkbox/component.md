---
name: Checkbox
type: component
status: stable
version: 0.6.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [RadioGroup, Switch, Field, Form]
spec: ./component.json
last_updated: 2026-05-03
---

# Checkbox

> Independent boolean. Square 16 px box at default size. Built on Radix Checkbox primitive; visual via the `.lumen-checkbox` shell in globals.css.

## When to use
- Independent booleans where any combination can be checked.
- Toggling agreement (Terms, marketing opt-in).
- "Select all" + per-row selection in tables.

## When NOT to use
- Mutually exclusive options → `RadioGroup`.
- Immediate-action toggle (setting takes effect now, no submit) → `Switch`.

## States
Rest, hover, focus-visible, checked, indeterminate, disabled, error.

## Accessibility
- Always paired with a label or `aria-label`.
- Touch target extends to the label — clickable area ≥ 44 × 44 px.
- Indeterminate state via Radix's `data-state="indeterminate"` for "some children checked" rows.

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.7, 2.5.8, 4.1.2.

## Do
- Write labels that read as a sentence with the box checked.
- Group related checkboxes in a `<fieldset>` with a visible `<legend>`.

## Don't
- Don't use Checkbox for mutually exclusive options.
- Don't use Checkbox for instant-effect toggles — use Switch.

## Code
- [Web React](../../../audit-dashboard/src/components/ui/checkbox.tsx)

## Changelog
- 0.6.0 — Initial release. Adopts `.lumen-checkbox` shell. Bug fix: replaced `rounded-[4px]` Tailwind arbitrary value with `--radius-xs` token (lint violation).
