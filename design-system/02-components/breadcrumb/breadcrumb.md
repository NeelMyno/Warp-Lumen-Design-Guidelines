---
name: Breadcrumb
category: navigation
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - text.primary
  - text.tertiary
  - text.accent
  - tracking.tight
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Link", "Sidebar", "TopBar", "Tabs"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/breadcrumb"
---

# Breadcrumb

Hierarchy crumbs with overflow collapse. Lumen API takes `items={[{href, label}, ...]}` for terse usage. Built on the shadcn Breadcrumb composition (Breadcrumb / BreadcrumbList / BreadcrumbItem / BreadcrumbLink / BreadcrumbPage / BreadcrumbSeparator).

## When to use

- Deep hierarchy (Account › Settings › Billing).
- Project navigation (Workspace › Project › Document).
- File / asset browsers.

## Anatomy

1. <nav aria-label='breadcrumb'> root
2. <ol> BreadcrumbList
3. <li> BreadcrumbItem × N
4. Link variants: BreadcrumbLink (clickable) + BreadcrumbPage (current, aria-current)
5. BreadcrumbSeparator (chevron-right)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Nav has aria-label='breadcrumb'.
- Current page (last item) has aria-current=page.
- Separators are aria-hidden.

## Tokens consumed

- `text.primary`
- `text.tertiary`
- `text.accent`
- `tracking.tight`

## Do

- Use for ≥ 2 levels of hierarchy.
- Truncate middle items in long crumbs.

## Don't

- Don't use for top-level navigation.
- Don't omit aria-current.

## Related

- Link
- Sidebar
- TopBar
- Tabs

## Code

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
