---
name: lumen-saved-view
description: Use to persist a FilterBuilder + sort + column state under a name — 'My lanes', 'Q3 shipments', 'Active carriers'. Lime dot indicates unsaved changes. Pair with FilterBuilder.
---

# Lumen SavedView

Named query state with diff + share. Saves a FilterBuilder state under a name. Shows a diff indicator when the current filters differ from the saved state (lime dot). Share via copyable URL. Manage via a popover dropdown — Save / Save as / Rename / Share / Delete.

## Use when

- Operator dashboards with persistent filter sets.
- List views that benefit from named snapshots.
- Team-shared queries (combine with Share URL).

## NEVER

- NEVER allow duplicate view names without disambiguation.
- NEVER skip the dirty indicator (it's the trust signal).
- NEVER share without explicit user action.

## Tokens consumed

- surface.raised
- color.accent
- text.primary
- text.tertiary
- border.hairline
- radius.md

## Anatomy

1. Trigger button (view name + dirty dot)
2. Dropdown: list of views + 'Save current' / 'Save as new'
3. Save-as Modal (name input + save button)
4. Share button (copies URL with view hash)

## API

- `views` — { id, name, query }[].
- `currentView` — string (id) | null.
- `isDirty` — boolean.
- `onSelect` — (id: string) => void.
- `onSave` — (name: string) => void.
- `onShare` — (id: string) => void.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Trigger button has aria-label='Saved views, current: {name}{', unsaved' if dirty}'.
- Dropdown items have descriptive labels.
- Save-as modal has DialogTitle.

## Code (canonical)

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

## Related

- FilterBuilder
- FilterChip
- DataTable
- DropdownMenu
