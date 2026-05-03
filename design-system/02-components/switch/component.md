---
name: Switch
type: component
status: stable
version: 0.6.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Toggle, Checkbox, RadioGroup, Field]
spec: ./component.json
last_updated: 2026-05-03
---

# Switch

> Binary toggle for **immediate-effect** settings. 36 × 20 pill track + 16 px thumb. Built on Radix Switch primitive; visual via `.lumen-switch` shell.

## When to use
- Settings that take effect the moment the user toggles (notifications, dark mode, autosave).
- Per-row "active / paused" pills inside tables (with care — see § Don't).

## When NOT to use
- Form-submission booleans → Checkbox.
- Mutually exclusive options → RadioGroup or Segmented.
- Button-style on/off (filter chips, toolbar buttons) → Toggle.

## States
Rest, hover, focus-visible, checked, disabled, error.

## Accessibility
- Always paired with a visible label.
- Touch target ≥ 44 × 44 px (label included).
- Switch state takes effect immediately — confirm destructive toggles via a brief description ("Disabled — emails will stop within 24h").

WCAG: 1.3.1, 1.4.3, 2.1.1, 2.4.7, 2.5.8, 4.1.2.

## Do
- Pair with a description when the side effect is non-obvious.
- Show a brief confirmation toast for destructive toggles.
- Use the lime-on track color (`--lumen-accent-4`) — never a second hue.

## Don't
- Don't use for "Save / Cancel" — that's a Button group.
- Don't use for booleans tied to a form submit — use Checkbox.

## Code
- [Web React](../../../audit-dashboard/src/components/ui/switch.tsx)

## Changelog
- 0.6.0 — Initial dedicated contract. Adopts `.lumen-switch` shell. Switch was previously conflated with the Toggle contract; v0.6 separates them — Toggle is reserved for button-style on/off (filter chips), Switch for the pill toggle.
