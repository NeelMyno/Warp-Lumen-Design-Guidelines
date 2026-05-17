---
name: Response
type: component
tier: T5
family: Shared
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Response
install: npx ai-elements@latest add response
related:
  - ./response-text.skill.md
  - ../message/message.md
---

# Response

Plain (non-streaming) markdown rendering wrapper. Use when content is complete and the streaming/shimmer mechanics of MessageResponse are unnecessary.

## Use when

- Rendering complete assistant text where streaming is already done.
- Tool output that returns prose (research result, summary).
- Static content surfaces — assistant-generated documentation, policy explanation.

## API

Props: `text: string`, `markdown?: { allowHtml?, remarkPlugins?, rehypePlugins? }`. Renders complete markdown with no shimmer / cursor.

## Anatomy

| Sub-component | Role |
|---|---|
| `Response` | Root markdown wrapper. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- MessageResponse (streaming sibling)
- Message
- Tool (ToolOutput often uses Response for text)

## Install

```bash
npx ai-elements@latest add response
```
