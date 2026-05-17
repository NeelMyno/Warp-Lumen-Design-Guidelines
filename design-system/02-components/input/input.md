---
name: Input
category: form
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.input.rest
  - surface.input.disabled
  - border.default
  - border.strong
  - border.focus
  - border.error
  - border.input.disabled
  - text.primary
  - text.placeholder
  - text.disabled
  - shadow.input.lit-edge
  - shadow.input.focus
  - shadow.input.error
  - radius.md
  - motion.duration.fast
  - motion.easing.standard
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Textarea", "Field", "ValidationMessage", "NumberInput", "PasswordInput", "SearchField", "Combobox"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/input"
---

# Input

Standard single-line text input. v0.6 adopts the field-shell visual contract — standalone, this input paints its own border, bg, and focus halo. Inside <Field>, the wrapper paints; the input renders bare via .lumen-field globals (no double ring). Body type is text-body-md (14px).

## When to use

- Any single-line text entry — email, name, lane code, weight, search query.
- Inside <Field> (the v0.6 form shell) — pair with <Label> and optional <ValidationMessage>.
- Standalone — for inline filter chips or quick-search boxes.

## Anatomy

1. Hairline border (--border-default at rest)
2. Surface bg (--surface-input-rest)
3. Placeholder text (--text-placeholder)
4. Focus halo (--shadow-input-focus + --border-focus on :focus-visible)
5. Error halo (--shadow-input-error + --border-error on aria-invalid)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Pair with <Label htmlFor> in <Field>, or supply aria-label / aria-labelledby standalone.
- Use aria-describedby when paired with a ValidationMessage.
- aria-invalid triggers the error halo + ring; pair with descriptive ValidationMessage.

## Tokens consumed

- `surface.input.rest`
- `surface.input.disabled`
- `border.default`
- `border.strong`
- `border.focus`
- `border.error`
- `border.input.disabled`
- `text.primary`
- `text.placeholder`
- `text.disabled`
- `shadow.input.lit-edge`
- `shadow.input.focus`
- `shadow.input.error`
- `radius.md`
- `motion.duration.fast`
- `motion.easing.standard`

## Do

- Pair with <Label> via <Field>.
- Use semantic type=email / type=tel for mobile keyboard hints.
- Surface validation errors with <ValidationMessage> + aria-describedby.

## Don't

- Don't use as a multi-line input — use <Textarea>.
- Don't put a button inside an <Input>; wrap both in a <Field> shell.

## Related

- Textarea
- Field
- ValidationMessage
- NumberInput
- PasswordInput
- SearchField
- Combobox

## Code

```tsx
import { Input } from "@/components/ui/input";

export function Example() {
  return <Input placeholder="LAX → SFO" />;
}
```
