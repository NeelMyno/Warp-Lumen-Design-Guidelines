---
name: Terminal
type: component
tier: T5
family: Content
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Terminal
install: npx ai-elements@latest add terminal
related:
  - ./terminal.skill.md
  - ../artifact/artifact.md
---

# Terminal

Console output with ANSI color support, streaming indicators, auto-scroll. For live tool-call output / deployment logs / sandbox stdout.

## Use when

- Tool returns streaming stdout (sandbox execution, deployment logs).
- Surface needs to show terminal-style output with ANSI color preservation.
- Long-running operation where the user wants live progress (deployment, batch quote, large-scale operation).

## API

Props: `output: string` (the buffer; updated on stream), `isStreaming?: boolean` (shows live cursor + auto-scroll), `maxHeight?: string = '400px'` (scrollable container size), `parseAnsi?: boolean = true`.

## Anatomy

| Sub-component | Role |
|---|---|
| `Terminal` | Root scrollable container. |
| `TerminalHeader` | Optional title + streaming indicator. |
| `TerminalBody` | ANSI-parsed output. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Sandbox (Terminal renders sandbox stdout)
- CodeBlock (static code)
- StackTrace (error stack rendering)
- Tool

## Install

```bash
npx ai-elements@latest add terminal
```
