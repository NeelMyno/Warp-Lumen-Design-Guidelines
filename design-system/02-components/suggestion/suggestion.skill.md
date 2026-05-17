---
name: lumen-suggestion
description: Suggestion chip strip rendered above PromptInput. Click submits to chat handler. Mirrors Vercel AI Elements `Suggestion` verbatim per AGENTS.md hard rule 19. Install with `npx ai-elements@latest add suggestion`. Status: stable.
---

# Lumen Suggestion

Suggestion chip strip rendered above PromptInput. Click submits to chat handler.

## Use when

- Onboarding the user — first-render suggestions (`Quote a lane`, `Track shipment WRP-9824`, `Show today's deliveries`).
- Mid-conversation prompt scaffolding — assistant offers 2-3 follow-up questions as chips.
- Empty-state surface guidance — chips populate the empty PromptInput with sample queries.

## NEVER

- NEVER ship more than 4 suggestion chips. More creates choice paralysis.
- NEVER use Spring Green on a Suggestion chip — chips are neutral; the accent appears only on Submit.
- NEVER repeat a chip across turns. Suggestions are context-specific, not menu options.
- NEVER use Suggestion as a slash-command palette — that's PromptInputTools.

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

1. `Suggestion` — Root container, manages chip layout (horizontal scroll on overflow).
2. `SuggestionChip` — Single chip — text + click handler.

## API

Takes `suggestions: string[]` + `onSelect: (text: string) => void`. Each chip is a horizontally scrollable, click-to-submit element. Auto-fades on submit.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add suggestion
import { Suggestion } from "@/components/ai-elements/suggestion";

export function Example() {
  return <Suggestion />;
}
```

## Related

- PromptInput (lives above it)
- suggestion-strip (v0.13.0 alias)
- ai-suggestion (v0.12.6 legacy; superseded)
- 03-patterns/chat-thread.md
