---
name: Sidebar
category: navigation
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["TopBar", "Tabs", "Breadcrumb"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/sidebar"
---

# Sidebar

Multi-level navigation rail. Collapsible. Sections (heading + items) with optional icons. Active state via aria-current=page. Optional collapsed mode shrinks to icon-only with tooltips for labels.

## When to use

- Primary navigation in operator dashboards.
- Multi-section nav with grouped items.
- Collapsible chrome for tablet / small viewports.

## Anatomy

1. Sidebar root (<aside>)
2. SidebarHeader (brand mark + collapse toggle)
3. SidebarSection (heading + items)
4. SidebarItem (icon + label, active state)
5. SidebarFooter (user menu)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- <nav aria-label='Primary navigation'>.
- Active item uses aria-current=page.
- When collapsed, items use Tooltip for labels.

## Tokens consumed

- `surface.canvas`
- `surface.sunken`
- `surface.tint-accent`
- `text.primary`
- `text.secondary`
- `text.tertiary`
- `text.accent`
- `border.hairline`
- `radius.md`
- `space.2`

## Do

- Group items by section.
- Pair active state with aria-current.
- Use Tooltip in collapsed mode.

## Don't

- Don't use for in-page nav.
- Don't hide the collapse toggle.

## Related

- TopBar
- Tabs
- Breadcrumb

## Code

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
