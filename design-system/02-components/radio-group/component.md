---
name: RadioGroup
type: component
status: stable
version: 0.6.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Checkbox, Select, Segmented, Switch, Field]
spec: ./component.json
last_updated: 2026-05-03
---

# RadioGroup

> Mutually exclusive single choice from 2+ visible options. Round 16 px ring at default size. Built on Radix RadioGroup; visual via the `.lumen-radio` shell.

## When to use
- Mutually exclusive options where all should be visible at once.
- 2–6 options. Beyond that, prefer Select.

## When NOT to use
- Boolean → Switch.
- Many independent flags → Checkbox group.
- 2–3 options that fit one row → Segmented.
- 7+ options → Select / Combobox.

## States
Rest, hover, focus-visible, checked, disabled, error.

## Accessibility
- Wrap the group in a `<fieldset>` with a visible `<legend>`.
- Tab moves to the group; arrow keys navigate within.
- Touch target ≥ 44 × 44 px — extend the clickable area to the label.

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.7, 2.5.8, 4.1.2.

## Do
- Always provide a label per option.
- Default to no preselection unless there's a clear safe default.

## Don't
- Don't preselect an option that costs the user money.
- Don't ship 7+ radios in a vertical stack — use Select.

## Code
- [Web React](../../../audit-dashboard/src/components/ui/radio-group.tsx)

## Changelog
- 0.6.0 — Initial release. Adopts `.lumen-radio` shell. Replaces v0.5 dual-implementation drift (DIY radio in inputs.tsx vs unused shadcn Radix radio-group).
