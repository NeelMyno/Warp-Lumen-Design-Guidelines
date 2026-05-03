---
name: Textarea
type: component
status: stable
version: 0.6.0
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Field, Input, Form]
spec: ./component.json
last_updated: 2026-05-03
---

# Textarea

> Multi-line text input. Same field shell as Input; differs in min-height, vertical padding, and the resize handle.

## When to use
- Comments, notes, addresses, descriptions, freight special-instructions.
- Any text that may run more than one line.

## When NOT to use
- Single-line text → Input.
- Rich-text editing (bold, lists, links) → a dedicated editor (out of v0.6 scope).
- Code editing → a code editor primitive (Monaco / CodeMirror, out of scope).

## Anatomy
Same as Input: shell + value. No leading/trailing slots by default. A character counter, when present, lives in the helper row beneath the field — not in the shell.

## Variants

| Prop | Values | Default | Notes |
|---|---|---|---|
| `size` | `sm` / `md` / `lg` | `md` | Drives min-height (64 / 80 / 128 px) |
| `rows` | number | `4` | Initial rows; auto-grows past this with `field-sizing: content` |
| `autoResize` | boolean | `true` | Set false for a fixed-height textarea |
| `disabled` | boolean | `false` | Same as Input |
| `readOnly` | boolean | `false` | Full contrast, no caret, in tab order |

## Accessibility

- Always paired with a visible label via `Field`.
- Errors announced via `aria-describedby` + `role="alert"` on the error message.
- Resize handle is vertical-only by default; honor `prefers-reduced-motion` (no animation on auto-grow).

WCAG: 1.3.1, 1.4.3, 2.4.7, 3.3.1, 3.3.2, 4.1.2.

## Do

- Use `field-sizing: content` when supported; fall back to the user resize handle.
- Cap auto-grow with `max-height` so a runaway textarea doesn't push everything off-screen.
- Pair `maxLength` with a visible character counter in the helper row.

## Don't

- Don't allow horizontal resize in a multi-column form — it breaks rhythm.
- Don't disable the resize handle without enabling auto-grow.

## Code

- [Web React](../../../audit-dashboard/src/components/ui/textarea.tsx)

## Changelog
- 0.6.0 — Initial release. Adopts the field shell, removes `text-base md:text-sm` font-size override that fought the 14 px body floor.
