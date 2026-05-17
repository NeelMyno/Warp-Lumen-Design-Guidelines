---
name: lumen-skeleton
description: Use during async loads to indicate the shape of incoming content. Pass width/height to match the final content layout (CLS guard). Always set aria-hidden — the screen reader skips it; pair with `aria-busy` on the parent.
---

# Lumen Skeleton

Loading placeholder. Accepts width / height / rounded shorthand. Animated via tw-animate-css animate-pulse; honors prefers-reduced-motion (drops the pulse).

## Use when

- Async data loads where the shape is known (table rows, card grids).
- Image / avatar placeholders before src resolves.
- Above-the-fold sections during SSR hydration.

## NEVER

- NEVER use Skeleton for static content — only loading.
- NEVER skip dimensions — the CLS guard depends on width + height matching final content.
- NEVER mount inside aria-live regions — Skeleton is aria-hidden.

## Tokens consumed

- surface.sunken
- radius.sm
- motion.duration.slower

## Anatomy

1. Inline-block div with bg + radius + animate-pulse

## API

- `width` — number (px) or string (any CSS length).
- `height` — number (px) or string (default: 14).
- `rounded` — CSS radius (default: var(--radius-sm)).
- `className` — override classes.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- aria-hidden=true (presentational).
- Parent should set aria-busy=true while loading.
- Honors prefers-reduced-motion (drops the pulse animation).

## Code (canonical)

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function Example() {
  return <Skeleton width={120} height={14} />;
}
```

## Related

- Spinner
- Progress
- EmptyState
