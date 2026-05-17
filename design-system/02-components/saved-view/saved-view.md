---
name: SavedView
category: data
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.raised
  - color.accent
  - text.primary
  - text.tertiary
  - border.hairline
  - radius.md
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["FilterBuilder", "FilterChip", "DataTable", "DropdownMenu"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/saved-view"
---

# SavedView

Named query state with diff + share. Saves a FilterBuilder state under a name. Shows a diff indicator when the current filters differ from the saved state (lime dot). Share via copyable URL. Manage via a popover dropdown — Save / Save as / Rename / Share / Delete.

## When to use

- Operator dashboards with persistent filter sets.
- List views that benefit from named snapshots.
- Team-shared queries (combine with Share URL).

## Anatomy

1. Trigger button (view name + dirty dot)
2. Dropdown: list of views + 'Save current' / 'Save as new'
3. Save-as Modal (name input + save button)
4. Share button (copies URL with view hash)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Trigger button has aria-label='Saved views, current: {name}{', unsaved' if dirty}'.
- Dropdown items have descriptive labels.
- Save-as modal has DialogTitle.

## Tokens consumed

- `surface.raised`
- `color.accent`
- `text.primary`
- `text.tertiary`
- `border.hairline`
- `radius.md`

## Do

- Show dirty state.
- Provide Save-as.
- Make share explicit.

## Don't

- Don't auto-save on every change.
- Don't share silently.

## Related

- FilterBuilder
- FilterChip
- DataTable
- DropdownMenu

## Code

```tsx
import { SavedView } from "@/components/ui/saved-view";

export function Example() {
  return (
    <SavedView
      views={[{ id: "1", name: "My lanes", query: {} }]}
      currentView="1"
      isDirty
    />
  );
}
```
