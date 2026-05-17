---
name: lumen-input
description: Use when generating a standard text input in a Lumen-themed React app. Returns a token-driven input with hairline border, lime focus halo, error variant via aria-invalid, and the field-shell visual contract. Composes inside <Field> without double-rings.
---

# Lumen Input

Standard single-line text input. v0.6 adopts the field-shell visual contract — standalone, this input paints its own border, bg, and focus halo. Inside <Field>, the wrapper paints; the input renders bare via .lumen-field globals (no double ring). Body type is text-body-md (14px).

## Use when

- Any single-line text entry — email, name, lane code, weight, search query.
- Inside <Field> (the v0.6 form shell) — pair with <Label> and optional <ValidationMessage>.
- Standalone — for inline filter chips or quick-search boxes.

## NEVER

- NEVER hardcode color / spacing / radius. Tokens only.
- NEVER use type=password — install PasswordInput (it has the reveal toggle + caps-lock affordance).
- NEVER nest <Input> directly inside another input.
- NEVER strip the focus ring.

## Tokens consumed

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

## Anatomy

1. Hairline border (--border-default at rest)
2. Surface bg (--surface-input-rest)
3. Placeholder text (--text-placeholder)
4. Focus halo (--shadow-input-focus + --border-focus on :focus-visible)
5. Error halo (--shadow-input-error + --border-error on aria-invalid)

## API

- Standard `<input>` HTML attributes pass through.
- `type` — text | email | password | search | tel | url | number (use NumberInput for numerics with steppers).
- `aria-invalid` — flips to error styling.
- `disabled` / `readonly` — distinct visual states.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Pair with <Label htmlFor> in <Field>, or supply aria-label / aria-labelledby standalone.
- Use aria-describedby when paired with a ValidationMessage.
- aria-invalid triggers the error halo + ring; pair with descriptive ValidationMessage.

## Code (canonical)

```tsx
import { Input } from "@/components/ui/input";

export function Example() {
  return <Input placeholder="LAX → SFO" />;
}
```

## Related

- Textarea
- Field
- ValidationMessage
- NumberInput
- PasswordInput
- SearchField
- Combobox
