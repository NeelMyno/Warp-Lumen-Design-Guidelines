---
name: lumen-sandbox
description: Collapsible container with status indicator + tabbed nav between code / output / terminal. For E2B / similar sandbox integrations. Mirrors Vercel AI Elements `Sandbox`. Install with `npx ai-elements@latest add sandbox`. Status: experimental.
---

# Lumen Sandbox

Collapsible container with status indicator + tabbed nav between code / output / terminal. For E2B / similar sandbox integrations.

## Use when

- Assistant runs code in a remote sandbox (E2B, Modal, Vercel Sandbox) — surface needs to show source + result side-by-side.
- Multi-step plans where each step has executable code + observable output.
- Educational flows: 'here's the code, here's the output, here's the terminal log.'

## NEVER

- NEVER auto-execute sandbox code. Operator approves via Confirmation first.
- NEVER ship a sandbox component without resource limits documented (memory, wall-clock).
- NEVER let sandbox output overflow visible bounds — Terminal handles its own scroll.

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

1. `Sandbox` — Root tabbed container with status header.
2. `SandboxTabs` — Tab control.
3. `SandboxCode` — Code tab body.
4. `SandboxOutput` — Output tab body.
5. `SandboxTerminal` — Terminal tab body.

## API

STUB. Tabbed: { Code | Output | Terminal }. Status indicator: idle | running | success | error. Children slot for each tab's renderer (CodeBlock for Code; arbitrary for Output; Terminal for Terminal).

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add sandbox
import { Sandbox } from "@/components/ai-elements/sandbox";

export function Example() {
  return <Sandbox />;
}
```

## Related

- Tool (Sandbox is often a Tool output)
- CodeBlock
- Terminal
- Confirmation (gate sandbox execution)
