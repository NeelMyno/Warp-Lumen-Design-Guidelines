---
name: Context
type: component
tier: T5
family: Shared
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Context
install: npx ai-elements@latest add context
related:
  - ./context-window.skill.md
  - ../message/message.md
---

# Context

Token usage / context window display. Composition of Stat (tokens used / limit) + progress meter. Color shifts to amber at 80%, lumen-red at 95%.

## Use when

- Long-running chat where context window utilization matters (the user is approaching the limit).
- Developer-facing surface where token cost matters.
- Operator surface — dispatcher chat that runs all day, where context-window awareness prevents surprise truncation.

## API

Props: `tokensUsed: number`, `tokensLimit: number`, `format?: 'compact' | 'detailed'`, `onClear?: () => void` (clears conversation when shown as actionable).

## Anatomy

| Sub-component | Role |
|---|---|
| `Context` | Root composition. |
| `ContextStat` | Stat-style display of tokens used / limit. |
| `ContextMeter` | Horizontal progress meter; color shifts at 80% and 95%. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Stat (Phase 2 primitive)
- Progress (Phase 2 primitive)
- Conversation (Context belongs alongside Conversation chrome)

## Install

```bash
npx ai-elements@latest add context
```
