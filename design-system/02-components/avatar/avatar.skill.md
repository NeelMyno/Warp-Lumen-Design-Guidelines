---
name: lumen-avatar
description: Use for user identity in chrome (top-bar profile), carrier identity in tables (CarrierBadge composes Avatar), AvatarGroup for collaborators on a shipment. The deterministic palette means the same name always produces the same color — recognizable across the app.
---

# Lumen Avatar

User or carrier identity tile. Built on Radix Avatar (image with fallback). The Lumen API takes `name` → derives initials + a deterministic palette from a 6-family rotation (accent / cream / amber / red / cream / obsidian). Optional `ring` + `badge` slot. AvatarGroup stacks N avatars with overflow +N pill.

## Use when

- User identity in top-bar.
- Carrier logo + initials fallback in shipment tables.
- Collaborator stack (AvatarGroup) on a quote or thread.

## NEVER

- NEVER use a random palette per-render. Palette is deterministic by name.
- NEVER omit alt when src is provided.
- NEVER use Avatar for product imagery — use a normal <img>.

## Tokens consumed

- lumen.accent.2
- lumen.accent.9
- lumen.cream.2
- lumen.cream.9
- lumen.amber.2
- lumen.amber.9
- lumen.red.2
- lumen.red.9
- lumen.obsidian.2
- lumen.obsidian.9
- surface.sunken
- surface.canvas
- border.default
- text.tertiary
- tracking.tight

## Anatomy

1. Avatar root (relative inline-flex)
2. AvatarImage (Radix; loads src)
3. AvatarFallback (initials over deterministic palette bg)
4. Optional badge slot (LiveDot, Spinner, Status pill)
5. Optional ring (ring-2 ring-offset-2)

## API

- `name` — required string. Drives initials + palette.
- `size` — xs | sm | md | lg | xl | 2xl.
- `src`, `alt` — image source.
- `badge` — ReactNode (rendered at -right-0.5 -bottom-0.5).
- `ring` — boolean (adds ring-2 with canvas offset).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- When src is missing, AvatarFallback renders initials; aria-label=name is provided via sr-only span.
- Image alt is required when src is provided.
- Badge slot is decorative — provide its own a11y label.

## Code (canonical)

```tsx
import { Avatar, AvatarGroup } from "@/components/ui/avatar";

export function Example() {
  return <Avatar name="Avery Mercer" size="md" />;
}
```

## Related

- AvatarGroup
- CarrierBadge
- LiveDot
