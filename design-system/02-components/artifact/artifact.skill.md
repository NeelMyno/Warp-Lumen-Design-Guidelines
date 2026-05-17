---
name: lumen-artifact
description: Anthropic-style artifact rendering: code / document / HTML / SVG / Mermaid in a scoped collapsible container. Mirrors Vercel AI Elements `Artifact`. Install with `npx ai-elements@latest add artifact`. Status: stable.
---

# Lumen Artifact

Anthropic-style artifact rendering: code / document / HTML / SVG / Mermaid in a scoped collapsible container.

## Use when

- Assistant generates substantial code, a document, an HTML snippet, an SVG, or a Mermaid diagram.
- User benefits from a focused container — preview + copy + open-in-new-window — rather than inline rendering.
- Content type warrants a dedicated viewer (HTML in WebPreview, JSX in JSXPreview, Mermaid in Artifact's Mermaid renderer).

## NEVER

- NEVER apply backdrop-filter to the Artifact container — it's text-dense content. Hard rule 16.
- NEVER render untrusted HTML directly. Use WebPreview's sandbox attribute.
- NEVER drop the type badge. The user needs to know what kind of artifact they're looking at.

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

1. `Artifact` — Root container with header + body + footer.
2. `ArtifactHeader` — Title + type badge.
3. `ArtifactContent` — The type-specific renderer.
4. `ArtifactActions` — Copy + open-in-new-window IconButtons.

## API

Header (title + type badge: code/doc/html/svg/mermaid) + body (renderer per type) + footer (copy + open-in-new-window). Collapsible. Type prop drives which renderer is used.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add artifact
import { Artifact } from "@/components/ai-elements/artifact";

export function Example() {
  return <Artifact />;
}
```

## Related

- WebPreview (used for type='html')
- JSXPreview (used for type='jsx')
- CodeBlock (used for type='code')
- Message
