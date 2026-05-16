---
name: Link
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Button, Breadcrumbs]
spec: ./component.json
last_updated: 2026-05-16
---

# Link

> Inline text link. Always an `<a>`. Three appearances — default, subtle (nav), accent (reserved emphasis).

## When to use

- In-prose hyperlinks.
- Inline references inside copy ("See [the docs](…) for more").
- Footer / navigation links.
- External references.

## When NOT to use

- An action that mutates state — use **Button**.
- A primary CTA outside prose — use **Button** with `intent="primary"`.
- An icon-only nav element — use **IconButton** as `<a>` (asChild).

## Variants

| `appearance` | Color | Use |
|---|---|---|
| `default` | `text.primary` | In-prose hyperlinks |
| `subtle` | `text.secondary` | Footer, breadcrumbs, nav |
| `accent` | `text.accent` | Reserved emphasis — at most one per surface |

## Underline

| Mode | Use |
|---|---|
| `always` | Prose paragraphs (WCAG 1.4.1 fallback) |
| `hover` | App body (default) |
| `none` | Navigation contexts |

## External links

`external=true` adds:
- `rel="noreferrer noopener"`
- `target="_blank"`
- Trailing `<ExternalLink />` icon
- `aria-label="…, opens in new tab"`

## Accessibility

- Always `<a>` with `href`. Never `role="link"` on a div.
- Link purpose inferable in context. No "click here".
- Focus ring per AGENTS.md hard rule 11 — outline + box-shadow.
- External links announce target via aria-label.

## Do

- Describe the destination in the link text.
- Underline in-prose links (`underline="always"`).
- One accent link per surface, max.
- Pair external with the ExternalLink glyph.

## Don't

- Don't use Link for actions.
- Don't write "click here".
- Don't paint default links in lime.
- Don't strip the in-prose underline.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
