---
name: lumen-stack-trace
description: Formatted JS / Node error stack with clickable file paths. Honors source-map URLs when available. Mirrors Vercel AI Elements `StackTrace`. Install with `npx ai-elements@latest add stack-trace`. Status: stable.
---

# Lumen StackTrace

Formatted JS / Node error stack with clickable file paths. Honors source-map URLs when available.

## Use when

- JSXPreview compile failed and we need to show the user where.
- Sandbox returned an error — render the stack trace in a focused viewer.
- Tool call threw — surface the stack as part of ToolOutput.

## NEVER

- NEVER render a stack trace without the error message at the top. The message is the most important line.
- NEVER convert clickable paths to opaque links — preserve `file:line:col` format so the user's IDE can open them.
- NEVER overflow horizontally on small screens — wrap or scroll-x.

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

1. `StackTrace` — Root container.
2. `StackTraceHeader` — Error message + type.
3. `StackTraceFrame` — Single frame line — file, line, col.

## API

Props: `error: Error | string` (Error object preferred for source-map awareness), `maxLines?: number = 10` (truncate beyond N), `onClickFrame?: (frame: StackFrame) => void` (IDE jump handler).

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add stack-trace
import { StackTrace } from "@/components/ai-elements/stack-trace";

export function Example() {
  return <StackTrace />;
}
```

## Related

- JSXPreview (error renderer)
- Sandbox (error renderer)
- Tool (ToolOutput error renderer)
