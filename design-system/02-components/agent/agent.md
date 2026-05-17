---
name: Agent
type: component
tier: T5
family: Agent
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Agent
install: npx ai-elements@latest add agent
related:
  - ./agent.skill.md
  - ../agent-state/agent-state.md
  - ../task-card/task-card.md
  - ../commit-card/commit-card.md
aliases:
  - agent-state
---

# Agent

Six-state visual indicator for an AI agent's current lifecycle phase: `idle`, `thinking`, `running-tool`, `awaiting-approval`, `done`, `error`.

This is the canonical Vercel-AI-Elements-named entry per AGENTS.md hard rule 19. The earlier `agent-state/` folder remains as a deprecated alias for v0.13.0 backward-compat; v0.14 retires it.

## Use when

- Surfacing agent lifecycle to the user — placed in the Conversation header or alongside a streaming Message.
- Driving the suspense-or-result framing — `thinking` shows shimmer, `running-tool` shows the tool name, `awaiting-approval` blocks further input until confirmation.
- Pairing with Task and Commit cards for full agent-plan visualization.

## API

```ts
interface AgentProps {
  state: "idle" | "thinking" | "running-tool" | "awaiting-approval" | "done" | "error";
  toolName?: string;             // shown when state === "running-tool"
  errorMessage?: string;         // shown when state === "error"
  className?: string;
}
```

## Anatomy

| Sub-component | Role |
|---|---|
| `Agent` | Root container. Pill-shaped chip with status icon + label. |

## State visuals

| State | Color | Icon | Motion |
|---|---|---|---|
| `idle` | text.secondary | none | none |
| `thinking` | accent.500 at 32% | sparkle (lucide) | shimmer |
| `running-tool` | accent.500 | tool (lucide) | rotation |
| `awaiting-approval` | status.warning.500 | hand-raised (lucide) | none |
| `done` | accent.500 | check-circle (lucide) | none |
| `error` | status.danger.500 | x-circle (lucide) | none |

## Modes

- **Restrained** (default): solid surface, no glow.
- **Expressive**: `running-tool` state gains soft glow halo via `shadow.glow-accent`.

## Accessibility

- `role="status"` + `aria-live="polite"` for state transitions.
- `aria-label` includes the human-readable state (`"Agent thinking"`, `"Agent awaiting approval"`).
- `prefers-reduced-motion`: shimmer collapses to a static accent fill.

## Related

- [Task](../task-card/task-card.md) (Agent's plan items)
- [Commit](../commit-card/commit-card.md) (Agent's changes)
- [Confirmation](../confirmation/confirmation.md) (approval gate; surfaces alongside `awaiting-approval` state)
- [agent-state](../agent-state/agent-state.md) (v0.13.0 alias; canonical name is `agent`)

## Install

```bash
npx ai-elements@latest add agent
```
