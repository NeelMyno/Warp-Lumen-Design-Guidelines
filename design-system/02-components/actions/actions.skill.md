---
name: lumen-actions
description: Action button strip below an assistant Message: regenerate / copy / like / dislike / share. Mirrors Vercel AI Elements `Actions`. Install with `npx ai-elements@latest add actions`. Status: stable.
---

# Lumen Actions

Action button strip below an assistant Message: regenerate / copy / like / dislike / share.

## Use when

- Below any assistant message in a chat thread.
- Surface needs user feedback signals (like / dislike) for RLHF or QA loop.
- User benefits from explicit regenerate / copy / share affordances.

## NEVER

- NEVER auto-fire any Action on hover or focus. Every action is an explicit click.
- NEVER hide Actions behind a 'more' menu by default — the affordances are part of the message contract.
- NEVER use Spring Green chrome on Actions buttons. They're neutral IconButtons.
- NEVER ship Actions without a regenerate option. Regeneration is the most-used action by far.

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

1. `Actions` — Root strip container.
2. `ActionsButton` — Single action button (uses Lumen IconButton internally).

## API

Composes Lumen IconButton primitives. Each action is opt-in via prop: `onRegenerate?`, `onCopy?`, `onLike?`, `onDislike?`, `onShare?`. The presence of the callback determines whether the icon appears.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add actions
import { Actions } from "@/components/ai-elements/actions";

export function Example() {
  return <Actions />;
}
```

## Related

- Message (lives below assistant messages)
- IconButton (Phase 2 primitive)
- MessageBranch (regenerate triggers a new branch)
