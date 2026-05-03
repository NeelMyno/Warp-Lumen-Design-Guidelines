---
name: Input
type: component
status: stable
version: 0.1.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Field, Select, Textarea, Toggle]
spec: ./component.json
last_updated: 2026-05-02
---

# Input

> A single-line text input. The base of every text-entry form control. Wraps in a `Field` for label, helper text, and error state.

## When to use
- Single-line text entry: name, email, ZIP, lane code, weight value.
- Search inputs (consider `Search` variant which adds a leading icon).

## When NOT to use
- Multi-line text → use `Textarea`.
- Constrained options → use `Select` or `Combobox`.
- Boolean → use `Toggle` or `Checkbox`.
- Numeric increments → use `NumberInput`.

## Anatomy
1. Container (`radius.control.md`, `border.default`, `surface.raised`)
2. Leading icon (optional)
3. Value text (`type.body.md`)
4. Trailing affordance (clear button, unit suffix, etc.)
5. Focus ring (`shadow.focus`)

## Variants
| Prop | Values | Default |
|---|---|---|
| `size` | `sm` / `md` / `lg` | `md` |
| `mono` | boolean | `false` (set true for ZIPs, codes, IDs) |
| `error` | boolean | `false` |
| `disabled` | boolean | `false` |
| `readOnly` | boolean | `false` |
| `leadingIcon` | icon | — |
| `trailingIcon` | icon | — |

## States
Rest, hover, focus, filled, disabled, read-only, error.

## Accessibility
- Always wrapped in a `Field` (which provides `<label for>`) OR carries `aria-label`.
- Errors announced via `aria-describedby` pointing to the helper element with `role="alert"`.
- Required marked via `aria-required="true"` AND a visual indicator.
- Validation fires on blur, not on every keystroke.
- Submit failure moves focus to the first invalid field.

WCAG: 1.3.1, 1.4.3, 2.4.6, 3.3.1, 3.3.2, 4.1.2.

## Do
- Pair every Input with a visible label (or visually-hidden `aria-label`).
- Use `mono` for IDs, ZIPs, codes — anything that needs character alignment.
- Set `inputMode` and `autoComplete` for known input types.

## Don't
- Don't use placeholder as the only label.
- Don't validate inline on every keystroke.
- Don't suppress browser autofill.

## Code
- [Web React](./examples/primary.tsx)

## Changelog
- 0.1.0 — Initial.
