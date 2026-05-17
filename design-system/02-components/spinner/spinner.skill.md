---
name: lumen-spinner
description: Use for indeterminate async loads — button loading state, inline 'Fetching rates', skeleton replacement. Composed inside Button via `loading` prop; use standalone for inline indicators. role=status + aria-label='Loading'.
---

# Lumen Spinner

Indeterminate loader. Lucide Loader2 + animate-spin at 0.9s. Honors prefers-reduced-motion (slows the rotation). role=status + aria-label='Loading' for screen readers.

## Use when

- Async button loading (composed via Button loading prop).
- Inline 'Fetching rates' indicator.
- Standalone async data loads (when Skeleton isn't appropriate).

## NEVER

- NEVER spin faster than 0.6s (anxious).
- NEVER omit role=status + aria-label.
- NEVER use Spinner for determinate loads (use Progress).

## Tokens consumed

- _None — purely structural._

## Anatomy

1. Loader2 SVG
2. animate-spin (0.9s linear infinite)
3. role=status
4. aria-label='Loading'

## API

- `size` — px (default: 16).
- `className` — override.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- role=status
- aria-label='Loading'
- Honors prefers-reduced-motion (slower rotation).

## Code (canonical)

```tsx
import { Spinner } from "@/components/ui/spinner";

export function Example() {
  return <Spinner />;
}
```

## Related

- Progress
- ProgressRing
- Skeleton
- Button (loading)
