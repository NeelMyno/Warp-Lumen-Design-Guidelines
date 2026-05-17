---
name: lumen-terminal
description: Console output with ANSI color support, streaming indicators, auto-scroll. For live tool-call output / deployment logs / sandbox stdout. Mirrors Vercel AI Elements `Terminal`. Install with `npx ai-elements@latest add terminal`. Status: stable.
---

# Lumen Terminal

Console output with ANSI color support, streaming indicators, auto-scroll. For live tool-call output / deployment logs / sandbox stdout.

## Use when

- Tool returns streaming stdout (sandbox execution, deployment logs).
- Surface needs to show terminal-style output with ANSI color preservation.
- Long-running operation where the user wants live progress (deployment, batch quote, large-scale operation).

## NEVER

- NEVER apply backdrop-filter to Terminal. It's text-dense. Hard rule 16.
- NEVER drop the streaming indicator. The user needs to know if output is still arriving.
- NEVER strip ANSI colors. Lumen tokens map to standard ANSI hues (red = lumen-red, green = accent, yellow = lumen-amber, blue = secondary).

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

1. `Terminal` — Root scrollable container.
2. `TerminalHeader` — Optional title + streaming indicator.
3. `TerminalBody` — ANSI-parsed output.

## API

Props: `output: string` (the buffer; updated on stream), `isStreaming?: boolean` (shows live cursor + auto-scroll), `maxHeight?: string = '400px'` (scrollable container size), `parseAnsi?: boolean = true`.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add terminal
import { Terminal } from "@/components/ai-elements/terminal";

export function Example() {
  return <Terminal />;
}
```

## Related

- Sandbox (Terminal renders sandbox stdout)
- CodeBlock (static code)
- StackTrace (error stack rendering)
- Tool
