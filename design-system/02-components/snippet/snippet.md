---
name: Snippet
type: component
tier: T5
family: Content
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Snippet
install: npx ai-elements@latest add snippet
related:
  - ./snippet.skill.md
  - ../artifact/artifact.md
---

# Snippet

Lightweight terminal command or short code snippet. Built on shadcn InputGroup; one-line copy affordance.

## Use when

- Assistant returns a single terminal command ('Run `pnpm install`').
- A short code snippet (one-line, one-statement) that benefits from copy-affordance UI.
- Surface needs a lighter-weight alternative to CodeBlock for short inline content.

## API

Props: `command: string` (the single line), `language?: string` (shell | json | css | …). Renders inline-code-styled with a click-to-copy IconButton.

## Anatomy

| Sub-component | Role |
|---|---|
| `Snippet` | Root container. |
| `SnippetCopyButton` | Click-to-copy IconButton. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- CodeBlock (multi-line)
- InputGroup (shadcn primitive)
- Terminal

## Install

```bash
npx ai-elements@latest add snippet
```
