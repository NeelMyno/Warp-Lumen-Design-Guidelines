---
name: Artifact
type: component
tier: T5
family: Content
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Artifact
install: npx ai-elements@latest add artifact
related:
  - ./artifact.skill.md
  - ../artifact/artifact.md
---

# Artifact

Anthropic-style artifact rendering: code / document / HTML / SVG / Mermaid in a scoped collapsible container.

## Use when

- Assistant generates substantial code, a document, an HTML snippet, an SVG, or a Mermaid diagram.
- User benefits from a focused container — preview + copy + open-in-new-window — rather than inline rendering.
- Content type warrants a dedicated viewer (HTML in WebPreview, JSX in JSXPreview, Mermaid in Artifact's Mermaid renderer).

## API

Header (title + type badge: code/doc/html/svg/mermaid) + body (renderer per type) + footer (copy + open-in-new-window). Collapsible. Type prop drives which renderer is used.

## Anatomy

| Sub-component | Role |
|---|---|
| `Artifact` | Root container with header + body + footer. |
| `ArtifactHeader` | Title + type badge. |
| `ArtifactContent` | The type-specific renderer. |
| `ArtifactActions` | Copy + open-in-new-window IconButtons. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- WebPreview (used for type='html')
- JSXPreview (used for type='jsx')
- CodeBlock (used for type='code')
- Message

## Install

```bash
npx ai-elements@latest add artifact
```
