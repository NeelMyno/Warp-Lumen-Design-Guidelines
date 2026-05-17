---
name: TopBar
category: navigation
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.canvas
  - text.primary
  - border.hairline
  - z-index.sticky
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Sidebar", "Breadcrumb", "CommandPalette", "Navbar", "Avatar"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/top-bar"
---

# TopBar

Horizontal app chrome — brand mark + breadcrumb + global search trigger + user menu. h-14 (56px); hairline bottom border. Pair with Sidebar (left) for the two-axis dashboard chrome.

## When to use

- Operator dashboards needing horizontal app chrome.
- Pair with Sidebar for two-axis nav.
- Embed a global search trigger (⌘K).

## Anatomy

1. TopBar root (<header>, sticky)
2. TopBarLeft (brand mark)
3. TopBarCenter (breadcrumb / title)
4. TopBarRight (search / user menu / notifications)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- <header> semantic element.
- Skip-to-content link in the first slot (sr-only).

## Tokens consumed

- `surface.canvas`
- `text.primary`
- `border.hairline`
- `z-index.sticky`

## Do

- Pair with Sidebar.
- Embed CommandPalette trigger.
- Provide skip-to-content.

## Don't

- Don't add backdrop-filter.
- Don't stack.

## Related

- Sidebar
- Breadcrumb
- CommandPalette
- Navbar
- Avatar

## Code

```tsx
import { TopBar, TopBarLeft, TopBarCenter, TopBarRight } from "@/components/ui/top-bar";

export function Example() {
  return (
    <TopBar>
      <TopBarLeft>Warp</TopBarLeft>
      <TopBarCenter>Lanes</TopBarCenter>
      <TopBarRight>⌘K · A</TopBarRight>
    </TopBar>
  );
}
```
