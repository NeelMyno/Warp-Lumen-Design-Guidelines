---
name: lumen-web-preview
description: Iframe with safety wrapper for HTML / web previews. Sandbox attribute defaults to safe; CSP-friendly. Mirrors Vercel AI Elements `WebPreview`. Install with `npx ai-elements@latest add web-preview`. Status: stable.
---

# Lumen WebPreview

Iframe with safety wrapper for HTML / web previews. Sandbox attribute defaults to safe; CSP-friendly.

## Use when

- Rendering assistant-generated HTML for preview.
- Showing a Vercel preview URL inside an Artifact.
- Embedding a tool output that's a hosted web page.

## NEVER

- NEVER drop the sandbox attribute. The default `sandbox="allow-scripts"` (no `allow-same-origin`) prevents the iframe from accessing the host.
- NEVER iframe a URL without verifying it's trusted (assistant-generated URLs go through a domain allowlist).
- NEVER let the iframe overflow its bounding box. The safety wrapper enforces max dimensions.

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

1. `WebPreview` — Root iframe wrapper with safety + loading state.

## API

Props: `srcDoc?: string` (inline HTML) OR `src?: string` (external URL). `sandbox?: string` (default safe). `onLoad?`, `onError?` callbacks. Loading state during initial fetch.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add web-preview
import { WebPreview } from "@/components/ai-elements/web-preview";

export function Example() {
  return <WebPreview />;
}
```

## Related

- Artifact (uses WebPreview for type='html')
- JSXPreview
- Sandbox
