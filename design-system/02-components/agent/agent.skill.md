---
name: lumen-agent
description: Six-state visual indicator for an AI agent's current lifecycle phase. Mirrors Vercel AI Elements `Agent` verbatim per AGENTS.md hard rule 19. Install with `npx ai-elements@latest add agent`. Status: stable.
---

# Lumen Agent

Six-state visual indicator for an AI agent's current lifecycle phase.

## Use when

- Surfacing agent lifecycle to the user (idle / thinking / running-tool / awaiting-approval / done / error).
- Pairing with Task and Commit cards for full agent-plan visualization.
- Driving the suspense-or-result framing for streaming Conversations.

## NEVER

- NEVER swap status colors. Each state has a canonical color: thinking + done = accent, awaiting-approval = warning, error = danger.
- NEVER hide the Agent during streaming — even idle state should remain visible so the user knows the agent is reachable.
- NEVER nest Agents — one per Conversation root.
- NEVER use Agent for non-agentic AI surfaces — plain chat has no Agent state.

## Tokens consumed

- color.accent.500
- color.accent.400
- color.status.warning.500
- color.status.danger.500
- color.text.secondary
- color.surface.raised
- color.border.hairline
- space.2, space.3
- radius.full
- shadow.glow-accent (expressive mode, running-tool state)
- motion.duration.base
- motion.easing.standard

## Anatomy

1. `Agent` — Root container. Pill-shaped chip with status icon + label.

## API

```ts
interface AgentProps {
  state: "idle" | "thinking" | "running-tool" | "awaiting-approval" | "done" | "error";
  toolName?: string;
  errorMessage?: string;
  className?: string;
}
```

## Modes

- Restrained (default): solid surface, no glow.
- Expressive: `running-tool` state gains soft glow halo via `shadow.glow-accent`.

## Accessibility

- `role="status"` + `aria-live="polite"`.
- `aria-label` includes the human-readable state.
- `prefers-reduced-motion`: shimmer collapses to a static accent fill.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add agent
import { Agent } from "@/components/ai-elements/agent";

export function Example() {
  return <Agent state="thinking" />;
}
```

## Related

- Task (Agent's plan items)
- Commit (Agent's changes)
- Confirmation (approval gate)
- agent-state (v0.13.0 alias)
- 03-patterns/agent-approval-flow.md
