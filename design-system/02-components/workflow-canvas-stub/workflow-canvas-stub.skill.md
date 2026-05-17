---
name: lumen-workflow-canvas
description: STUB. Workflow family entry point (Canvas + Node + Edge + Connection + Controls + Panel + Toolbar). React Flow under the hood. Marked experimental. Mirrors Vercel AI Elements `Canvas`. Install with `npx ai-elements@latest add canvas`. Status: experimental.
---

# Lumen WorkflowCanvas

STUB. Workflow family entry point (Canvas + Node + Edge + Connection + Controls + Panel + Toolbar). React Flow under the hood. Marked experimental.

## Use when

- FUTURE: Agent plan visualization — render the plan as a directed graph.
- FUTURE: Freight network visualization — lanes as edges, terminals as nodes.
- Today: do not use; primitive is stubbed.

## NEVER

- NEVER ship Canvas without honoring keyboard navigation. React Flow has accessibility hooks; use them.
- NEVER paint mesh background on Canvas. Hard rule 16 — Canvas is a dense data surface.
- NEVER hardcode node positions for AI-generated graphs. Use dagre / elk auto-layout.

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

1. `Canvas` — Root flow container.
2. `Node` — Single node — themed Card composition.
3. `Edge` — Single edge — hairline path.
4. `Connection` — In-progress edge during drag.
5. `Controls` — Zoom / fit controls.
6. `Panel` — Floating overlay panel.
7. `Toolbar` — Tools palette.

## API

STUB. When fleshed out, wraps @xyflow/react with Lumen-themed Node + Edge styling, hairline accent on the focused element, mode-aware atmosphere on the surrounding chrome (not inside Canvas).

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add canvas
import { WorkflowCanvas } from "@/components/ai-elements/workflow-canvas";

export function Example() {
  return <WorkflowCanvas />;
}
```

## Related

- Agent (Canvas often visualizes Agent's plan)
- Task (Task nodes in a plan)
