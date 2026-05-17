---
name: Skeleton
category: feedback
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.sunken
  - radius.sm
  - motion.duration.slower
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Spinner", "Progress", "EmptyState"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/skeleton"
---

# Skeleton

Loading placeholder. Accepts width / height / rounded shorthand. Animated via tw-animate-css animate-pulse; honors prefers-reduced-motion (drops the pulse).

## When to use

- Async data loads where the shape is known (table rows, card grids).
- Image / avatar placeholders before src resolves.
- Above-the-fold sections during SSR hydration.

## Anatomy

1. Inline-block div with bg + radius + animate-pulse

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- aria-hidden=true (presentational).
- Parent should set aria-busy=true while loading.
- Honors prefers-reduced-motion (drops the pulse animation).

## Tokens consumed

- `surface.sunken`
- `radius.sm`
- `motion.duration.slower`

## Do

- Match the final content dimensions.
- Pair parent with aria-busy.
- Honor reduced-motion.

## Don't

- Don't omit width/height.
- Don't use as static content.

## Related

- Spinner
- Progress
- EmptyState

## Code

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function Example() {
  return <Skeleton width={120} height={14} />;
}
```
