---
name: Tabs
category: navigation
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.sunken
  - surface.raised
  - text.tertiary
  - text.primary
  - shadow.sm
  - shadow.focus
  - radius.md
  - radius.sm
  - z-index.popover
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Segmented", "Sidebar", "Breadcrumb", "InlineTabs"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/tabs"
---

# Tabs

Tabbed surface built on Radix Tabs. Sunken track + raised active state. Composes Tabs, TabsList, TabsTrigger, TabsContent.

## When to use

- Settings panel sections.
- Dashboard view switchers (overview / details / activity).
- Document tabs.

## Anatomy

1. Tabs root (flex-col gap-2)
2. TabsList (sunken track)
3. TabsTrigger (raised on data-state=active)
4. TabsContent (flex-1)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Radix manages role=tablist, role=tab, role=tabpanel, aria-controls, aria-selected, arrow-key navigation, focus trap within the list.
- TabsTrigger focus-visible has the lumen --shadow-focus halo.

## Tokens consumed

- `surface.sunken`
- `surface.raised`
- `text.tertiary`
- `text.primary`
- `shadow.sm`
- `shadow.focus`
- `radius.md`
- `radius.sm`
- `z-index.popover`

## Do

- Use for in-page section switching.
- Pair with consistent content shape (each panel similar layout).

## Don't

- Don't use for route navigation.
- Don't stack 7+ tabs.

## Related

- Segmented
- Sidebar
- Breadcrumb
- InlineTabs

## Code

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content</TabsContent>
    </Tabs>
  );
}
```
