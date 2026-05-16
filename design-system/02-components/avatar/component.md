---
name: Avatar
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [PresenceIndicator, Tag, Tooltip]
spec: ./component.json
last_updated: 2026-05-16
---

# Avatar

> User / actor identity image with deterministic name-hashed fallback colors and initials.

## When to use

- User / team-member representation.
- Author / commenter glyph in collab contexts.
- Owner / assignee tag on rows.
- Profile detail headers.

## When NOT to use

- Product images — use Image / Logo.
- Anonymous placeholders — use generic Icon (User glyph) + label "Guest".

## Variants

| `size` | Pixels |
|---|---|
| `xs` | 20 |
| `sm` | 24 |
| `md` | 32 (default) |
| `lg` | 40 |
| `xl` | 56 |

| `shape` | Use |
|---|---|
| `circle` | Person (default) |
| `rounded` | Workspace / org |
| `square` | Bot / system actor |

## AvatarGroup

Stack 3-5 visible avatars, `−6 px` margin-left overlap, ring in `surface.page` color. Overflow renders a circular chip "+N more".

## Presence

`online` (accent) / `idle` (warning) / `dnd` (danger) / `offline` (neutral) — small ring-bordered dot at the bottom-right corner.

## Accessibility

- `alt` required when no visible name nearby.
- Hash-color fallback initials are `aria-hidden`.
- Presence dot announces via parent `aria-label`.

## Do

- 8-color name-hashed palette — same name = same color.
- Initials: first letter of first two words.
- Sizes consistent per surface.

## Don't

- Don't paint fallback in lime.
- Don't render without alt or visible name nearby.
- Don't use circle for orgs.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
