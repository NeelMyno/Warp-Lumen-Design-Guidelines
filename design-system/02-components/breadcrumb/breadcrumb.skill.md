---
name: lumen-breadcrumb
description: Use to show hierarchy + provide back-navigation — Account › Settings › Billing. Pass `items` array; the last item auto-renders as the current page (aria-current=page). For overflow handling in deep hierarchies, the consumer can supply an ellipsis item.
---

# Lumen Breadcrumb

Hierarchy crumbs with overflow collapse. Lumen API takes `items={[{href, label}, ...]}` for terse usage. Built on the shadcn Breadcrumb composition (Breadcrumb / BreadcrumbList / BreadcrumbItem / BreadcrumbLink / BreadcrumbPage / BreadcrumbSeparator).

## Use when

- Deep hierarchy (Account › Settings › Billing).
- Project navigation (Workspace › Project › Document).
- File / asset browsers.

## NEVER

- NEVER omit aria-current=page on the last item (the API handles this).
- NEVER use Breadcrumb for a single-level page — it's noise.
- NEVER nest a Breadcrumb inside another Breadcrumb.

## Tokens consumed

- text.primary
- text.tertiary
- text.accent
- tracking.tight

## Anatomy

1. <nav aria-label='breadcrumb'> root
2. <ol> BreadcrumbList
3. <li> BreadcrumbItem × N
4. Link variants: BreadcrumbLink (clickable) + BreadcrumbPage (current, aria-current)
5. BreadcrumbSeparator (chevron-right)

## API

- `items` — Crumb[] of { href?, label }. Last item is aria-current=page automatically.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Nav has aria-label='breadcrumb'.
- Current page (last item) has aria-current=page.
- Separators are aria-hidden.

## Code (canonical)

```tsx
import { Breadcrumb } from "@/components/ui/breadcrumb";

export function Example() {
  return (
    <Breadcrumb items={[
      { href: "/", label: "Home" },
      { href: "/lanes", label: "Lanes" },
      { label: "LAX → SFO" },
    ]} />
  );
}
```

## Related

- Link
- Sidebar
- TopBar
- Tabs
