---
name: Spinner
category: feedback
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - (none — sets data-mode)
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Progress", "ProgressRing", "Skeleton", "Button (loading)"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/spinner"
---

# Spinner

Indeterminate loader. Lucide Loader2 + animate-spin at 0.9s. Honors prefers-reduced-motion (slows the rotation). role=status + aria-label='Loading' for screen readers.

## When to use

- Async button loading (composed via Button loading prop).
- Inline 'Fetching rates' indicator.
- Standalone async data loads (when Skeleton isn't appropriate).

## Anatomy

1. Loader2 SVG
2. animate-spin (0.9s linear infinite)
3. role=status
4. aria-label='Loading'

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- role=status
- aria-label='Loading'
- Honors prefers-reduced-motion (slower rotation).

## Tokens consumed

_None — this component is purely structural._

## Do

- Use for indeterminate.
- Set size to match context (16 inline, 24 standalone, 32 hero).

## Don't

- Don't use for determinate.
- Don't spin faster than 0.6s.

## Related

- Progress
- ProgressRing
- Skeleton
- Button (loading)

## Code

```tsx
import { Spinner } from "@/components/ui/spinner";

export function Example() {
  return <Spinner />;
}
```
