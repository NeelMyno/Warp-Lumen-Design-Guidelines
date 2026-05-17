---
name: Loader
type: component
tier: T5
family: Shared
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Loader
install: npx ai-elements@latest add loader
related:
  - ./loader-ai.skill.md
  - ../message/message.md
---

# Loader

AI-context loader. Wraps Lumen's v0.12.4 Spinner; adds an optional 'AI thinking' label slot.

## Use when

- Pre-stream wait — model is queued but no tokens have arrived.
- Tool execution wait — between Confirmation approval and ToolOutput.
- Citation lookup wait — between assistant claim and Sources rendering.

## API

Composes Lumen Spinner (v0.12.4) with an optional label slot. Honors prefers-reduced-motion (spinner animation stops; label persists).

## Anatomy

| Sub-component | Role |
|---|---|
| `Loader` | Root, composes Spinner + label. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Spinner (v0.12.4 primitive)
- MessageResponse (shimmer takes over once streaming begins)
- Tool (Loader bridges Confirmation → ToolOutput)

## Install

```bash
npx ai-elements@latest add loader
```
