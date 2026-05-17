---
name: lumen-sidebar
description: Use for primary nav in operator dashboards. Pair with @lumen/top-bar (top) for a two-axis chrome. Sections group related items; the active item gets aria-current=page + lime accent. Collapsed mode shrinks to 56px icon rail.
---

# Lumen Sidebar

Multi-level navigation rail. Collapsible. Sections (heading + items) with optional icons. Active state via aria-current=page. Optional collapsed mode shrinks to icon-only with tooltips for labels.

## Use when

- Primary navigation in operator dashboards.
- Multi-section nav with grouped items.
- Collapsible chrome for tablet / small viewports.

## NEVER

- NEVER use Sidebar for in-page navigation (Tabs).
- NEVER hide the collapse toggle.
- NEVER omit aria-current on the active item.

## Tokens consumed

- surface.canvas
- surface.sunken
- surface.tint-accent
- text.primary
- text.secondary
- text.tertiary
- text.accent
- border.hairline
- radius.md
- space.2

## Anatomy

1. Sidebar root (<aside>)
2. SidebarHeader (brand mark + collapse toggle)
3. SidebarSection (heading + items)
4. SidebarItem (icon + label, active state)
5. SidebarFooter (user menu)

## API

- `collapsed` — boolean.
- `onCollapsedChange` — (c: boolean) => void.
- Sections + items via composition (children).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- <nav aria-label='Primary navigation'>.
- Active item uses aria-current=page.
- When collapsed, items use Tooltip for labels.

## Code (canonical)

```tsx
import { Sidebar, SidebarHeader, SidebarSection, SidebarItem, SidebarFooter } from "@/components/ui/sidebar";
import { Truck, Home } from "lucide-react";

export function Example() {
  return (
    <Sidebar>
      <SidebarHeader>Warp</SidebarHeader>
      <SidebarSection heading="Operate">
        <SidebarItem icon={<Home size={14} />} active>Overview</SidebarItem>
        <SidebarItem icon={<Truck size={14} />}>Lanes</SidebarItem>
      </SidebarSection>
    </Sidebar>
  );
}
```

## Related

- TopBar
- Tabs
- Breadcrumb
