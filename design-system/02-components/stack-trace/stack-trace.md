---
name: StackTrace
type: component
tier: T5
family: Content
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: StackTrace
install: npx ai-elements@latest add stack-trace
related:
  - ./stack-trace.skill.md
  - ../artifact/artifact.md
---

# StackTrace

Formatted JS / Node error stack with clickable file paths. Honors source-map URLs when available.

## Use when

- JSXPreview compile failed and we need to show the user where.
- Sandbox returned an error — render the stack trace in a focused viewer.
- Tool call threw — surface the stack as part of ToolOutput.

## API

Props: `error: Error | string` (Error object preferred for source-map awareness), `maxLines?: number = 10` (truncate beyond N), `onClickFrame?: (frame: StackFrame) => void` (IDE jump handler).

## Anatomy

| Sub-component | Role |
|---|---|
| `StackTrace` | Root container. |
| `StackTraceHeader` | Error message + type. |
| `StackTraceFrame` | Single frame line — file, line, col. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- JSXPreview (error renderer)
- Sandbox (error renderer)
- Tool (ToolOutput error renderer)

## Install

```bash
npx ai-elements@latest add stack-trace
```
