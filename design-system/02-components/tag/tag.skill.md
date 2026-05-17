---
name: lumen-tag
description: Use for removable inline labels — filter chips, applied filters, multi-select TagsInput. Same color contract as Badge (--pill-{tone}-*). When `onRemove` is set, an inline X renders with aria-label='Remove {label}'. For static status without remove, use @lumen/badge.
---

# Lumen Tag

Removable label. Same --pill-{tone}-* contract as Badge, with an optional onRemove handler that renders an inline X icon. Use for filter rows, multi-select chips, applied filters. For static status, use Badge.

## Use when

- Applied filter chips above a data table.
- Tags on a quote (accessorials, equipment types).
- Multi-select pickers (TagsInput → Tag rows).

## NEVER

- NEVER omit aria-label on the remove button.
- NEVER use a Tag where a Button would be better (Tag is content, not action).
- NEVER stack 10+ tags in a single row — paginate or wrap.

## Tokens consumed

- pill.neutral.bg
- pill.neutral.fg
- pill.neutral.border
- pill.success.bg
- pill.success.fg
- pill.accent.bg
- pill.accent.fg
- radius.full
- tracking.tight

## Anatomy

1. Span root
2. Optional leading dot or icon
3. Label text
4. Optional remove X (when onRemove is passed)

## API

- `status` — neutral | success | warning | danger | info | accent (default: neutral).
- `size` — sm | md (default: sm).
- `onRemove` — () => void; renders the X.
- `leadingIcon` — optional ReactNode.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Remove button has aria-label='Remove {label}' for screen readers.
- Tag itself is non-interactive unless onRemove (then the X is a button).
- Inside a multi-select context, the parent listbox manages aria-selected; Tag is the visual.

## Code (canonical)

```tsx
import { Tag } from "@/components/ui/tag";

export function Example() {
  return <Tag onRemove={() => console.log("remove")}>LAX → SFO</Tag>;
}
```

## Related

- Badge
- TagsInput
- FilterChip
