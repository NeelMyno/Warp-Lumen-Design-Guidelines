---
name: Field
type: component
status: stable
version: 0.6.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Input, Form, Textarea, Select, Combobox, ValidationMessage]
spec: ./component.json
last_updated: 2026-05-03
---

# Field

> Composition wrapper that bundles a label, description, control shell, and hint/error message into one vertical group. The shell is the **single focus surface** for the control; slots (leading icon, trailing icon, addon) bond under one focus ring.

## When to use
- Every text-entry control should be wrapped in a Field unless it carries `aria-label`.
- Composing custom controls (NumberInput, Combobox) — Field handles the surrounding label / hint / error orchestration; the custom control replaces the inner shell via `children`.

## Anatomy

```
┌─ lumen-form-field ──────────────────────────┐
│  Pickup ZIP  [optional]                     │ ← lumen-form-field__label
│  Description text below the label           │ ← lumen-form-field__description
│  ┌─ lumen-field ──────────────────────────┐ │
│  │ ⓘ  90045                          [STD]│ │ ← shell (border, focus surface)
│  └────────────────────────────────────────┘ │
│  Hint or error message                      │ ← lumen-form-field__hint / __error
└─────────────────────────────────────────────┘
```

The shell:
- Owns the focus ring via `:has(:focus-visible)` (modern) with `:focus-within` fallback.
- Owns the border, background, and inset lit-edge.
- Houses leading slot, value (bare `<input>`), trailing slot, trailing addon as siblings.
- All slots inside the shell are inside the same focus boundary by construction.

## States

Rest, hover, focus-visible, filled, error, success, disabled, read-only.

| State | Visual | Markup |
|---|---|---|
| Rest | Default border, lit-edge inset | — |
| Hover | Border swaps to `--border-strong` | — |
| Focus | Border swaps to `--border-focus`, lime halo | `:has(:focus-visible)` on shell |
| Error | Border red, lime halo flips to red on focus | `data-invalid="true"` |
| Success | Border lime, no halo until focus | `data-valid="true"` |
| Disabled | Muted bg, dim text, cursor not-allowed | `data-disabled="true"` |
| Read-only | Same bg as rest, no caret, copyable | `aria-readonly="true"` |

## Accessibility

- Label associated to control via `htmlFor` / `id`.
- Description rendered as `<p class="lumen-form-field__description">` immediately under the label, above the control.
- Hint and error IDs concatenated into `aria-describedby` (space-separated).
- Error sets `role="alert"` + `aria-invalid="true"`.
- Required: `aria-required="true"` + visible asterisk.
- Click on the shell (anywhere) focuses the inner control.
- All slot icons are `aria-hidden` by default; interactive slot children (clear, password reveal) set `data-interactive` and have their own contained focus indicator.

WCAG: 1.3.1, 1.4.3, 1.4.11, 1.4.13, 2.4.7, 2.5.8, 3.3.1, 3.3.2, 3.3.3, 4.1.2.

## Validation timing

- **Don't validate during first typing.** Pre-touch state has no inline validation.
- **Validate on blur** after first interaction.
- Once an error is shown, switch to **onChange** validation for that field — clear the error as soon as the value is fixed.
- **On submit**, validate everything; focus the first invalid field via `field.focus({ preventScroll: false })`.
- Server validation surfaces via `aria-live="polite"` region; map 4xx error codes to specific field errors.

## Do

- Wrap every text-entry control unless it carries `aria-label`.
- Set `hint` to teach format (`12345 or 12345-6789`) before the user is wrong.
- Set `error` only after submit or blur validation has fired.
- Use `mono` for codes / IDs / weights.
- Use `optional` (NN/g recommendation) over the required-asterisk pattern when only a few fields are required.
- Use `required` + visible asterisk when most fields are optional.

## Don't

- Don't paint borders on the inner control — the wrapper owns chrome.
- Don't render leading/trailing icons in their own wrapper div — pass them as `leadingIcon` / `trailingIcon` props so they bond.
- Don't render the trailing unit chip ("lb", "STD") outside the shell — pass via `trailingAddon`.
- Don't render two adjacent Fields without labels.

## Code

- [Web React](../../../audit-dashboard/src/components/primitives/field.tsx)

## Changelog
- 0.6.0 — Initial release. Single-shell focus pattern with slot bonding via `:has(:focus-visible)` (with `:focus-within` fallback). Replaces the v0.5 wrapper + bare `<input>` composition that painted two halos.
