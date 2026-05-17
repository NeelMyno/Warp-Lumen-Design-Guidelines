---
name: lumen-agent
description: State indicator for an agent: idle / thinking / running tool / awaiting approval / done / error. Six visual states; pairs with LiveDot. Mirrors Vercel AI Elements `Agent`. Install with `npx ai-elements@latest add agent`. Status: stable.
---

# Lumen Agent

State indicator for an agent: idle / thinking / running tool / awaiting approval / done / error. Six visual states; pairs with LiveDot.

## Use when

- Surface representing an agent (autonomous or human-supervised) — dispatcher agent, lane-quote agent, contract-review agent.
- User needs at-a-glance state awareness — is the agent active right now?
- Multi-agent dashboards showing fleet of agents in different states.

## NEVER

- NEVER skip the LiveDot pulse on 'thinking' and 'running tool'. The pulse is the recognizable system signature.
- NEVER use chirpy state labels. 'Thinking' not 'Thinking really hard!'. 'Done' not 'All done! 🎉'.
- NEVER use Spring Green on the 'error' state. Error is lumen-red.
- NEVER allow user-state-name overrides — the six states are canonical.

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

1. `Agent` — Root state indicator.
2. `AgentStateIcon` — State-appropriate icon.
3. `AgentStateLabel` — State label + optional tool name.

## API

Props: `state: 'idle' | 'thinking' | 'running-tool' | 'awaiting-approval' | 'done' | 'error'`, `label?: string` (override default state label), `toolName?: string` (shown when state='running-tool').

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add agent
import { Agent } from "@/components/ai-elements/agent";

export function Example() {
  return <Agent />;
}
```

## Related

- LiveDot (v0.12.4 primitive — Agent uses internally)
- Task (Agent has a Task list)
- Tool (Agent executes Tools)
- 03-patterns/agent-approval-flow.md
