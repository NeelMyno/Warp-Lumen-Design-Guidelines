---
name: Toggle
type: component
status: stable
version: 0.1.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Checkbox, Switch, Button]
spec: ./component.json
last_updated: 2026-05-02
---

# Toggle

> A switch for binary on/off settings. Use for instant-effect changes (autosave on/off, accessorial selected/not). For form fields where the change is committed on submit, use `Checkbox` instead.

## When to use
- Settings that take effect immediately (notification preferences, dark mode).
- Configurable accessorials in a quote builder.
- Feature flags in a developer tool.

## When NOT to use
- Multi-state choices — use `RadioGroup`.
- Form fields submitted in batch — use `Checkbox`.
- Triggering an action — use `Button`.

## Anatomy
1. Track (`36 × 20 px`, `radius.full`, color `border-strong` off / `accent.500` on)
2. Knob (`16 × 16 px`, `radius.full`, white, `shadow.xs`, slides 16 px on toggle)
3. Optional label, right of the toggle

## Variants
| Prop | Values | Default |
|---|---|---|
| `checked` | boolean | `false` |
| `disabled` | boolean | `false` |
| `size` | `sm` / `md` | `md` |

## States
Off, on, off-disabled, on-disabled, focus-visible.

## Motion
- Knob translate: `motion.fast` + `easing.standard`.

## Accessibility
- `role="switch"` (NOT `checkbox`, NOT `button`).
- `aria-checked="true" | "false"`.
- Disabled uses `aria-disabled` (not the `disabled` attribute when in a form).
- Label is programmatically associated via `<label for>` or `aria-labelledby`.
- Activated by `Space` and `Enter`.

## Do
- Use a noun label: "Auto-save" not "Save automatically".
- Place label to the right of the switch.
- Pair with a one-line description below the label when behavior needs explanation.

## Don't
- Don't use a Toggle for a form field that's only committed on submit.
- Don't change the knob color. The accent is on the track.
- Don't omit the label.

## Code
- [Web React](./examples/primary.tsx)
