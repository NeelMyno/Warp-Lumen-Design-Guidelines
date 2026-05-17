---
name: Avatar
category: display
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
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
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["AvatarGroup", "CarrierBadge", "LiveDot"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/avatar"
---

# Avatar

User or carrier identity tile. Built on Radix Avatar (image with fallback). The Lumen API takes `name` → derives initials + a deterministic palette from a 6-family rotation (accent / cream / amber / red / cream / obsidian). Optional `ring` + `badge` slot. AvatarGroup stacks N avatars with overflow +N pill.

## When to use

- User identity in top-bar.
- Carrier logo + initials fallback in shipment tables.
- Collaborator stack (AvatarGroup) on a quote or thread.

## Anatomy

1. Avatar root (relative inline-flex)
2. AvatarImage (Radix; loads src)
3. AvatarFallback (initials over deterministic palette bg)
4. Optional badge slot (LiveDot, Spinner, Status pill)
5. Optional ring (ring-2 ring-offset-2)

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- When src is missing, AvatarFallback renders initials; aria-label=name is provided via sr-only span.
- Image alt is required when src is provided.
- Badge slot is decorative — provide its own a11y label.

## Tokens consumed

- `lumen.accent.2`
- `lumen.accent.9`
- `lumen.cream.2`
- `lumen.cream.9`
- `lumen.amber.2`
- `lumen.amber.9`
- `lumen.red.2`
- `lumen.red.9`
- `lumen.obsidian.2`
- `lumen.obsidian.9`
- `surface.sunken`
- `surface.canvas`
- `border.default`
- `text.tertiary`
- `tracking.tight`

## Do

- Always provide name (it's the a11y label).
- Use ring on AvatarGroup members.
- Pair badge with LiveDot for online status.

## Don't

- Don't randomize palette.
- Don't use Avatar for non-identity images.

## Related

- AvatarGroup
- CarrierBadge
- LiveDot

## Code

```tsx
import { Avatar, AvatarGroup } from "@/components/ui/avatar";

export function Example() {
  return <Avatar name="Avery Mercer" size="md" />;
}
```
