---
name: Task
type: component
tier: T5
family: AgentTask
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Task
install: npx ai-elements@latest add task
related:
  - ./task-card.skill.md
  - ../agent-state/agent-state.md
---

# Task

Single-task card for plan visualization: title, status, owner, deadline.

## Use when

- Agent plan visualization — list of tasks the agent will execute.
- Human-supervised flow where the operator approves / re-orders / removes tasks.
- Status surface — show the user what's queued, in-progress, and done.

## API

Props: `title: string`, `status: 'pending' | 'active' | 'done' | 'failed'`, `owner?: string` (agent name or human name), `deadline?: Date`, `onClick?: () => void` (open task detail).

## Anatomy

| Sub-component | Role |
|---|---|
| `Task` | Root card. |
| `TaskHeader` | Title + status indicator. |
| `TaskMeta` | Owner + deadline. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Agent (Task list belongs to an Agent)
- Commit (Task often produces a Commit)
- Card (Phase 2 primitive)

## Install

```bash
npx ai-elements@latest add task
```
