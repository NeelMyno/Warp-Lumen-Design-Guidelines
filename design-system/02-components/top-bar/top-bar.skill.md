---
name: lumen-top-bar
description: Use as the top chrome of any operator dashboard. Slots: brand (left), center (breadcrumb / page title), actions (right). Pair with @lumen/sidebar for two-axis nav.
---

# Lumen TopBar

Horizontal app chrome — brand mark + breadcrumb + global search trigger + user menu. h-14 (56px); hairline bottom border. Pair with Sidebar (left) for the two-axis dashboard chrome.

## Use when

- Operator dashboards needing horizontal app chrome.
- Pair with Sidebar for two-axis nav.
- Embed a global search trigger (⌘K).

## NEVER

- NEVER add backdrop-filter to TopBar — hard rule 16 (dense chrome).
- NEVER stack TopBars.
- NEVER skip the brand mark in left slot.

## Tokens consumed

- surface.canvas
- text.primary
- border.hairline
- z-index.sticky

## Anatomy

1. TopBar root (<header>, sticky)
2. TopBarLeft (brand mark)
3. TopBarCenter (breadcrumb / title)
4. TopBarRight (search / user menu / notifications)

## API

- Composition via slot children — TopBar root + children sub-components.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- <header> semantic element.
- Skip-to-content link in the first slot (sr-only).

## Code (canonical)

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

## Related

- Sidebar
- Breadcrumb
- CommandPalette
- Navbar
- Avatar
