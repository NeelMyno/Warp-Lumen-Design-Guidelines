---
name: lumen-confirmation
description: Approval gate for destructive tool calls. Brutalist hairline frame + slow-down-and-repeat-the-noun copy. Mirrors Vercel AI Elements `Confirmation`. Install with `npx ai-elements@latest add confirmation`. Status: stable.
---

# Lumen Confirmation

Approval gate for destructive tool calls. Brutalist hairline frame + slow-down-and-repeat-the-noun copy.

## Use when

- An assistant is about to invoke a destructive tool (book a shipment, send an email, delete a record).
- The action cannot be undone without consequence (financial commitment, external system mutation).
- User explicit consent matters legally or commercially.

## NEVER

- NEVER auto-approve. The user clicks confirm; the model does not assume.
- NEVER use chirpy or pleading copy ('Are you sure you want to delete?'). Use the destructive-confirmation voice from voice-and-tone.md: 'Cancel order WRP-9824? This cannot be undone.'
- NEVER apply Spring Green to the confirm button when the action is destructive. The confirm intent is danger; the cancel intent is the default secondary.
- NEVER include a 'Don't ask again' option — every destructive action gets its own explicit gate.

## Tokens consumed

- color.surface.canvas
- color.surface.raised
- color.text.primary
- color.text.secondary
- color.text.accent
- color.border.hairline
- color.border.frame
- space.3, space.4, space.6
- radius.md, radius.lg
- motion.duration.fast, motion.duration.base
- motion.easing.standard

## Anatomy

1. `Confirmation` — Root frame + state machine (pending / approved / rejected).
2. `ConfirmationTitle` — Repeats the noun being acted on ('Cancel order WRP-9824?').
3. `ConfirmationDescription` — One-sentence consequence ('This cannot be undone.').
4. `ConfirmationActions` — Confirm (danger) + Cancel (secondary) buttons.

## API

Confirmation wraps in a brutalist hairline frame (border-frame token, sharper corners than a default card). Copy slot accepts the destructive-voice template. Confirm + Cancel buttons; on confirm, fires the wrapped onApprove callback which resumes the Tool execution.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add confirmation
import { Confirmation } from "@/components/ai-elements/confirmation";

export function Example() {
  return <Confirmation />;
}
```

## Related

- Tool (Confirmation wraps the Tool call before execution)
- Dialog (Confirmation is a Dialog with brand-specific chrome)
- 03-patterns/agent-approval-flow.md (canonical pattern)
