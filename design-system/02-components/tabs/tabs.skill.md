---
name: lumen-tabs
description: Use for view switchers — settings sections, dashboard pages, document tabs. Built on Radix Tabs. Default style is the segmented sunken-track pattern; for inline label-style tabs use InlineTabs.
---

# Lumen Tabs

Tabbed surface built on Radix Tabs. Sunken track + raised active state. Composes Tabs, TabsList, TabsTrigger, TabsContent.

## Use when

- Settings panel sections.
- Dashboard view switchers (overview / details / activity).
- Document tabs.

## NEVER

- NEVER use Tabs for primary navigation between routes — use <nav> / Sidebar / TopBar.
- NEVER stack more than 7 tabs — paginate or move to dropdown.
- NEVER nest Tabs without strong reason.

## Tokens consumed

- surface.sunken
- surface.raised
- text.tertiary
- text.primary
- shadow.sm
- shadow.focus
- radius.md
- radius.sm
- z-index.popover

## Anatomy

1. Tabs root (flex-col gap-2)
2. TabsList (sunken track)
3. TabsTrigger (raised on data-state=active)
4. TabsContent (flex-1)

## API

- `defaultValue`, `value`, `onValueChange` — controlled/uncontrolled.
- All Radix Tabs props pass through.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Radix manages role=tablist, role=tab, role=tabpanel, aria-controls, aria-selected, arrow-key navigation, focus trap within the list.
- TabsTrigger focus-visible has the lumen --shadow-focus halo.

## Code (canonical)

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

## Related

- Segmented
- Sidebar
- Breadcrumb
- InlineTabs
