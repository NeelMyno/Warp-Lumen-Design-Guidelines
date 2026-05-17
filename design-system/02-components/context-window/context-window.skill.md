---
name: lumen-context
description: Token usage / context window display. Composition of Stat (tokens used / limit) + progress meter. Color shifts to amber at 80%, lumen-red at 95%. Mirrors Vercel AI Elements `Context`. Install with `npx ai-elements@latest add context`. Status: stable.
---

# Lumen Context

Token usage / context window display. Composition of Stat (tokens used / limit) + progress meter. Color shifts to amber at 80%, lumen-red at 95%.

## Use when

- Long-running chat where context window utilization matters (the user is approaching the limit).
- Developer-facing surface where token cost matters.
- Operator surface — dispatcher chat that runs all day, where context-window awareness prevents surprise truncation.

## NEVER

- NEVER show Context in chrome where the user can't take action. Display Context only where the user can clear / archive / branch the conversation.
- NEVER use exact token counts without a humanized format ('12.5K of 200K' not '12492 of 200000').
- NEVER apply Spring Green to the warning thresholds. Amber and lumen-red are the warning + danger tokens.

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

1. `Context` — Root composition.
2. `ContextStat` — Stat-style display of tokens used / limit.
3. `ContextMeter` — Horizontal progress meter; color shifts at 80% and 95%.

## API

Props: `tokensUsed: number`, `tokensLimit: number`, `format?: 'compact' | 'detailed'`, `onClear?: () => void` (clears conversation when shown as actionable).

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add context
import { Context } from "@/components/ai-elements/context";

export function Example() {
  return <Context />;
}
```

## Related

- Stat (Phase 2 primitive)
- Progress (Phase 2 primitive)
- Conversation (Context belongs alongside Conversation chrome)
