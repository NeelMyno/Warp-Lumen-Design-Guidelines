---
name: WorkflowCanvas
type: component
tier: T5
family: Workflow
version: 0.13.0
last_updated: 2026-05-17
status: experimental
phase: 5
vercel_ai_elements: Canvas
install: npx ai-elements@latest add canvas
related:
  - ./workflow-canvas-stub.skill.md
  - ../agent-state/agent-state.md
---

# WorkflowCanvas

STUB. Workflow family entry point (Canvas + Node + Edge + Connection + Controls + Panel + Toolbar). React Flow under the hood. Marked experimental.

## Use when

- FUTURE: Agent plan visualization — render the plan as a directed graph.
- FUTURE: Freight network visualization — lanes as edges, terminals as nodes.
- Today: do not use; primitive is stubbed.

## API

STUB. When fleshed out, wraps @xyflow/react with Lumen-themed Node + Edge styling, hairline accent on the focused element, mode-aware atmosphere on the surrounding chrome (not inside Canvas).

## Anatomy

| Sub-component | Role |
|---|---|
| `Canvas` | Root flow container. |
| `Node` | Single node — themed Card composition. |
| `Edge` | Single edge — hairline path. |
| `Connection` | In-progress edge during drag. |
| `Controls` | Zoom / fit controls. |
| `Panel` | Floating overlay panel. |
| `Toolbar` | Tools palette. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Agent (Canvas often visualizes Agent's plan)
- Task (Task nodes in a plan)

## Install

```bash
npx ai-elements@latest add canvas
```
