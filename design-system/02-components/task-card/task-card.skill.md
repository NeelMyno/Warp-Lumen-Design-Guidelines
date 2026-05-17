---
name: lumen-task
description: Single-task card for plan visualization: title, status, owner, deadline. Mirrors Vercel AI Elements `Task`. Install with `npx ai-elements@latest add task`. Status: stable.
---

# Lumen Task

Single-task card for plan visualization: title, status, owner, deadline.

## Use when

- Agent plan visualization — list of tasks the agent will execute.
- Human-supervised flow where the operator approves / re-orders / removes tasks.
- Status surface — show the user what's queued, in-progress, and done.

## NEVER

- NEVER drop the status indicator. A Task without a status is just a string.
- NEVER use Spring Green for non-active states. 'Pending' = neutral, 'Active' = accent, 'Done' = check + faded, 'Failed' = lumen-red.
- NEVER over-detail the title — Task is a card, not a paragraph. Title in 6 words or less.

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

1. `Task` — Root card.
2. `TaskHeader` — Title + status indicator.
3. `TaskMeta` — Owner + deadline.

## API

Props: `title: string`, `status: 'pending' | 'active' | 'done' | 'failed'`, `owner?: string` (agent name or human name), `deadline?: Date`, `onClick?: () => void` (open task detail).

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add task
import { Task } from "@/components/ai-elements/task";

export function Example() {
  return <Task />;
}
```

## Related

- Agent (Task list belongs to an Agent)
- Commit (Task often produces a Commit)
- Card (Phase 2 primitive)
