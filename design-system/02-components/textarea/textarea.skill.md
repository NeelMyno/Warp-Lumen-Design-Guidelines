---
name: lumen-textarea
description: Use when generating a multi-line text input — long notes, descriptions, comments, AI prompt input. Auto-grows with content; honors the v0.6 field-shell visual contract. For AI prompts specifically, prefer @lumen/ai-prompt-input.
---

# Lumen Textarea

Multi-line text input. Adopts the v0.6 field-shell contract — paints its own border, bg, focus halo standalone; renders bare inside <Field>. Auto-grows via `field-sizing: content`; cap via min-height / max-height in consumer style.

## Use when

- Multi-line entry — comments, descriptions, special instructions.
- Inside <Field> shell with a <Label> and optional <ValidationMessage>.
- Long-form input where height should grow with content.

## NEVER

- NEVER hardcode color / spacing / radius.
- NEVER pair with type=password (textarea has no type attribute).
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

1. Hairline border + surface bg (matches Input)
2. Min-height 22 (5.5rem) by default; consumer can override via style.height or className
3. Placeholder text (--text-placeholder)
4. Focus + error halos identical to Input

## API

- Standard `<textarea>` attributes pass through.
- `field-sizing: content` is default — height grows with content.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Pair with <Label htmlFor> in <Field>, or supply aria-label / aria-labelledby.
- Use aria-describedby when paired with a ValidationMessage.
- aria-invalid triggers the error halo.

## Code (canonical)

```tsx
import { Textarea } from "@/components/ui/textarea";

export function Example() {
  return <Textarea placeholder="Pickup notes…" />;
}
```

## Related

- Input
- Field
- ValidationMessage
- AIPromptInput
