---
name: lumen-context
description: Token usage / context window display. Stat + progress meter composition. Mirrors Vercel AI Elements `Context` verbatim per AGENTS.md hard rule 19. Install with `npx ai-elements@latest add context`. Status: stable.
---

# Lumen Context

Token usage / context window display. Stat-style composition showing how much of the model's context budget is consumed.

## Use when

- Inside a Conversation header — pace-the-conversation affordance.
- Inside the Agent surface — warning when context is over 80%.
- Inside settings/debug — per-model context budgets.

## NEVER

- NEVER hide Context — if a user is asking the operator to "summarize and continue", they need the affordance visible.
- NEVER show only a percentage — always include the absolute numbers (used / total tokens).
- NEVER swap the warning color. Spring at 0-80%, warning at 80-100%, danger at over-budget.
- NEVER conflate "context window" with "conversation length" — they are different. Context = current request payload size.

## Tokens consumed

- color.accent.500
- color.status.warning.500
- color.status.danger.500
- color.text.primary
- color.text.secondary
- color.surface.raised
- color.border.hairline
- space.2, space.3, space.4
- radius.full
- motion.duration.base
- motion.easing.standard

## Anatomy

1. `Context` — Root container. Composed of Stat (used/total numeric) + Progress bar + sr-only label.

## API

```ts
interface ContextProps {
  used: number;
  total: number;
  unit?: string;
  showLabel?: boolean;
  warningThreshold?: number;
  className?: string;
}
```

## Modes

- Restrained (default): solid surface, hairline border, neutral progress track.
- Expressive: ambient atmosphere from page chrome may surround.

## Accessibility

- `role="progressbar"` + `aria-valuenow` / `aria-valuemin` / `aria-valuemax`.
- `aria-label` includes percentage + absolute numbers.
- `prefers-reduced-motion`: progress fill uses opacity instead of width transition.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add context
import { Context } from "@/components/ai-elements/context";

export function Example() {
  return <Context used={12400} total={200000} />;
}
```

## Related

- Stat (underlying numeric primitive)
- Progress (underlying bar)
- Agent (sibling lifecycle indicator)
- context-window (v0.13.0 alias)
