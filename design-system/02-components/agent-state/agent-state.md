---
name: Agent
type: component
tier: T5
family: AgentTask
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Agent
install: npx ai-elements@latest add agent
related:
  - ./agent-state.skill.md
  - ../agent-state/agent-state.md
---

# Agent

State indicator for an agent: idle / thinking / running tool / awaiting approval / done / error. Six visual states; pairs with LiveDot.

## Use when

- Surface representing an agent (autonomous or human-supervised) — dispatcher agent, lane-quote agent, contract-review agent.
- User needs at-a-glance state awareness — is the agent active right now?
- Multi-agent dashboards showing fleet of agents in different states.

## API

Props: `state: 'idle' | 'thinking' | 'running-tool' | 'awaiting-approval' | 'done' | 'error'`, `label?: string` (override default state label), `toolName?: string` (shown when state='running-tool').

## Anatomy

| Sub-component | Role |
|---|---|
| `Agent` | Root state indicator. |
| `AgentStateIcon` | State-appropriate icon. |
| `AgentStateLabel` | State label + optional tool name. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- LiveDot (v0.12.4 primitive — Agent uses internally)
- Task (Agent has a Task list)
- Tool (Agent executes Tools)
- 03-patterns/agent-approval-flow.md

## Install

```bash
npx ai-elements@latest add agent
```
