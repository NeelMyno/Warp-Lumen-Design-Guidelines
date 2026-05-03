---
name: Input
type: component
status: stable
version: 0.6.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Field, Form, Textarea, Select, Combobox, ValidationMessage]
spec: ./component.json
last_updated: 2026-05-03
---

# Input

> Single-line text input. The base of every text-entry form control. Composes inside a `Field` shell that owns the focus surface.

## When to use
- Single-line text entry: name, email, ZIP, lane code, weight value.
- Search inputs (`type="search"` — the SearchInput primitive adds the leading icon + ⌘K affordance).
- Numeric entry without stepper controls (`type="number"` — for steppers, use `NumberInput`).

## When NOT to use
- Multi-line text → use `Textarea`.
- Constrained options → use `Select` or `Combobox`.
- Boolean → use `Switch` or `Checkbox`.
- Numeric increments → use `NumberInput`.
- Password with strength meter → `PasswordInput` + `PasswordStrength`.

## Anatomy

The Input itself is bare. The wrapping **`Field`** carries the visual chrome:

1. **Field shell** (`.lumen-field`) — the focusable surface. Owns border, background, lit-edge, focus halo. Single `:has(:focus-visible)` ring (with `:focus-within` fallback).
2. **Leading slot** (`[data-slot="leading"]`) — optional icon, currency, or country code. Decorative by default (`pointer-events: none`).
3. **Value** (`<input>`) — the bare element. Inherits color, font, height from the shell.
4. **Trailing slot** (`[data-slot="trailing"]`) — optional clear button, password reveal, validation icon. Interactive children opt-in via `data-interactive`.
5. **Trailing addon** (`[data-slot="addon"]`) — unit chip (lb / STD / %). Decorative; mono uppercase tracked.

## Variants

| Prop | Values | Default | Notes |
|---|---|---|---|
| `size` | `sm` / `md` / `lg` | `md` | 32 / 40 / 48 px height |
| `type` | `text` / `email` / `tel` / `url` / `search` / `password` / `number` | `text` | Drives `inputMode` and autocomplete heuristics |
| `mono` | boolean | `false` | Set true for ZIPs, IDs, codes, weights, money |
| `disabled` | boolean | `false` | Muted bg + dim text + cursor; not in tab order |
| `readOnly` | boolean | `false` | Full contrast, no caret, in tab order, copyable |

## States

Rest, hover, focus-visible, filled, disabled, read-only, error, success.

`error` and `focus-visible` compose: the border stays red and the halo flips to `--shadow-input-error`. The wrapper paints both — the inner element never paints chrome.

## Accessibility

- Always wrapped in a `Field` (which provides `<label htmlFor>`) OR carries `aria-label`.
- Errors announced via `aria-describedby` pointing to a helper element with `role="alert"`.
- Required marked via `aria-required="true"` AND a visual indicator.
- Validation fires on blur after first interaction; switches to onChange after first error.
- Submit failure moves focus to the first invalid field.
- Touch target ≥ 44 × 44 px on mobile (`size="lg"` or auto-bumped).

WCAG: 1.3.1, 1.4.3, 1.4.11, 1.4.13, 2.4.6, 2.4.7, 2.5.8, 3.3.1, 3.3.2, 3.3.3, 4.1.2.

## Do

- Pair every Input with a visible label (or visually-hidden `aria-label`).
- Use `mono` for IDs, ZIPs, codes — anything that needs character alignment.
- Set `inputMode` and `autoComplete` for known input types (`email`, `tel`, `current-password`, `postal-code`, `cc-number`, etc.).
- Use `type="number"` with `inputMode="numeric"` to keep mobile keyboards correct.
- Compose in a Field for label + helper + error orchestration.

## Don't

- Don't use placeholder as the only label.
- Don't validate inline on every keystroke before first interaction (see [forms-and-inputs.md](../../00-foundations/forms-and-inputs.md) § Validation timing).
- Don't suppress browser autofill — see globals.css for the autofill recipe that preserves the field surface over the Chrome yellow flash.
- Don't paint a focus ring on the inner `<input>` when wrapped in a Field. The wrapper's `:has(:focus-visible)` rule handles it. The CSS rule `.lumen-field :is(input, textarea, select):focus-visible { box-shadow: none !important }` enforces this.

## Code

- [Web React](../../../audit-dashboard/src/components/ui/input.tsx)
- [Field composition](../../../audit-dashboard/src/components/primitives/field.tsx)

## Changelog
- 0.6.0 — Adopts the .lumen-field shell; wrapper paints the single focus ring. Drops the `text-base md:text-sm` font override that fought Lumen's 14 px body floor. Adds `readOnly` distinct from `disabled`, autofill recipe, success/warning border tokens.
- 0.1.0 — Initial.
