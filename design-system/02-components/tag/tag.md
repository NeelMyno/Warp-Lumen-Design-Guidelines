---
name: Tag
category: display
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - pill.neutral.bg
  - pill.neutral.fg
  - pill.neutral.border
  - pill.success.bg
  - pill.success.fg
  - pill.accent.bg
  - pill.accent.fg
  - radius.full
  - tracking.tight
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Badge", "TagsInput", "FilterChip"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/tag"
---

# Tag

Removable label. Same --pill-{tone}-* contract as Badge, with an optional onRemove handler that renders an inline X icon. Use for filter rows, multi-select chips, applied filters. For static status, use Badge.

## When to use

- Applied filter chips above a data table.
- Tags on a quote (accessorials, equipment types).
- Multi-select pickers (TagsInput → Tag rows).

## Anatomy

1. Span root
2. Optional leading dot or icon
3. Label text
4. Optional remove X (when onRemove is passed)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Remove button has aria-label='Remove {label}' for screen readers.
- Tag itself is non-interactive unless onRemove (then the X is a button).
- Inside a multi-select context, the parent listbox manages aria-selected; Tag is the visual.

## Tokens consumed

- `pill.neutral.bg`
- `pill.neutral.fg`
- `pill.neutral.border`
- `pill.success.bg`
- `pill.success.fg`
- `pill.accent.bg`
- `pill.accent.fg`
- `radius.full`
- `tracking.tight`

## Do

- Use for applied filters and multi-select tokens.
- Always include onRemove to make tags useful (no-remove → use Badge).

## Don't

- Don't use Tag for status indicators (use Badge).
- Don't make tags clickable for non-remove actions.

## Related

- Badge
- TagsInput
- FilterChip

## Code

```tsx
import { Tag } from "@/components/ui/tag";

export function Example() {
  return <Tag onRemove={() => console.log("remove")}>LAX → SFO</Tag>;
}
```
