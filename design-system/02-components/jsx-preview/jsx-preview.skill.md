---
name: lumen-jsx-preview
description: Live React component preview for assistant-generated JSX. Compiles with @babel/standalone in-browser; surfaces errors via StackTrace. Mirrors Vercel AI Elements `JSXPreview`. Install with `npx ai-elements@latest add jsx-preview`. Status: stable.
---

# Lumen JSXPreview

Live React component preview for assistant-generated JSX. Compiles with @babel/standalone in-browser; surfaces errors via StackTrace.

## Use when

- Assistant generated a React component the user wants to see rendered.
- Design-system showcases where 'try it' is the killer affordance.
- Educational surfaces (Lumen docs site embedded examples).

## NEVER

- NEVER allow side-effectful imports in JSXPreview. Allowlist React + @lumen/* + a sandbox import map.
- NEVER let JSXPreview consume the page's DOM. Render in a shadow root or iframe.
- NEVER swallow compile errors. Wrap in <StackTrace />.

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

1. `JSXPreview` — Root preview surface with compile + render + error pipeline.

## API

Props: `code: string` (JSX/TSX source). Internal: babel transforms to JS, evaluates in a try/catch, renders into a shadow root. On error, returns StackTrace.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add jsx-preview
import { JSXPreview } from "@/components/ai-elements/jsx-preview";

export function Example() {
  return <JSXPreview />;
}
```

## Related

- Artifact (uses JSXPreview for type='jsx')
- WebPreview
- StackTrace (error renderer)
