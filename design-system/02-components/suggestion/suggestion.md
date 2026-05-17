---
name: Suggestion
type: component
tier: T5
family: Shared
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Suggestion
install: npx ai-elements@latest add suggestion
related:
  - ./suggestion.skill.md
  - ../suggestion-strip/suggestion-strip.md
  - ../message/message.md
  - ../prompt-input/prompt-input.md
aliases:
  - suggestion-strip
---

# Suggestion

Suggestion chip strip rendered above PromptInput (or beside an assistant message). One chip click submits the suggestion to the chat handler.

This is the canonical Vercel-AI-Elements-named entry per AGENTS.md hard rule 19. The earlier `suggestion-strip/` folder remains as a deprecated alias for v0.13.0 backward-compat; v0.14 retires it.

## Use when

- Onboarding the user — first-render suggestions (`Quote a lane`, `Track shipment WRP-9824`, `Show today's deliveries`).
- Mid-conversation prompt scaffolding — assistant offers 2-3 follow-up questions as chips.
- Empty-state surface guidance — chips populate the empty PromptInput with sample queries.

## API

Takes `suggestions: string[]` + `onSelect: (text: string) => void`. Each chip is a horizontally scrollable, click-to-submit element. Auto-fades on submit.

## Anatomy

| Sub-component | Role |
|---|---|
| `Suggestion` | Root container, manages chip layout (horizontal scroll on overflow). |
| `SuggestionChip` | Single chip — text + click handler. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- [PromptInput](../prompt-input/prompt-input.md) (lives above it)
- [suggestion-strip](../suggestion-strip/suggestion-strip.md) (v0.13.0 alias; canonical name is `suggestion`)
- ai-suggestion (v0.12.6 legacy; superseded)
- [03-patterns/chat-thread.md](../../03-patterns/chat-thread.md)

## Install

```bash
npx ai-elements@latest add suggestion
```
