---
name: Textarea
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
related: ["Input", "Field", "ValidationMessage", "AIPromptInput"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/textarea"
---

# Textarea

Multi-line text input. Adopts the v0.6 field-shell contract — paints its own border, bg, focus halo standalone; renders bare inside <Field>. Auto-grows via `field-sizing: content`; cap via min-height / max-height in consumer style.

## When to use

- Multi-line entry — comments, descriptions, special instructions.
- Inside <Field> shell with a <Label> and optional <ValidationMessage>.
- Long-form input where height should grow with content.

## Anatomy

1. Hairline border + surface bg (matches Input)
2. Min-height 22 (5.5rem) by default; consumer can override via style.height or className
3. Placeholder text (--text-placeholder)
4. Focus + error halos identical to Input

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Pair with <Label htmlFor> in <Field>, or supply aria-label / aria-labelledby.
- Use aria-describedby when paired with a ValidationMessage.
- aria-invalid triggers the error halo.

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

- Pair with <Field> for the label + validation chain.
- Let it auto-grow; do not force fixed height unless necessary.

## Don't

- Don't use for single-line input — use <Input>.
- Don't disable field-sizing without strong reason.

## Related

- Input
- Field
- ValidationMessage
- AIPromptInput

## Code

```tsx
import { Textarea } from "@/components/ui/textarea";

export function Example() {
  return <Textarea placeholder="Pickup notes…" />;
}
```
