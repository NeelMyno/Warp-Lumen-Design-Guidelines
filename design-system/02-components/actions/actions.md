---
name: Actions
type: component
tier: T5
family: Shared
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Actions
install: npx ai-elements@latest add actions
related:
  - ./actions.skill.md
  - ../message/message.md
---

# Actions

Action button strip below an assistant Message: regenerate / copy / like / dislike / share.

## Use when

- Below any assistant message in a chat thread.
- Surface needs user feedback signals (like / dislike) for RLHF or QA loop.
- User benefits from explicit regenerate / copy / share affordances.

## API

Composes Lumen IconButton primitives. Each action is opt-in via prop: `onRegenerate?`, `onCopy?`, `onLike?`, `onDislike?`, `onShare?`. The presence of the callback determines whether the icon appears.

## Anatomy

| Sub-component | Role |
|---|---|
| `Actions` | Root strip container. |
| `ActionsButton` | Single action button (uses Lumen IconButton internally). |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Message (lives below assistant messages)
- IconButton (Phase 2 primitive)
- MessageBranch (regenerate triggers a new branch)

## Install

```bash
npx ai-elements@latest add actions
```
