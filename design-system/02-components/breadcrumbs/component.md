---
name: Breadcrumbs
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Navbar, Sidebar, Link, DropdownMenu]
spec: ./component.json
last_updated: 2026-05-15
---

# Breadcrumbs

> Where am I, how did I get here, and how do I step back. A horizontal trail separated by ChevronRight, with the current page as the terminal non-link node.

## When to use

- App pages two or more levels below the top-level destination.
- Admin / settings sections with nested resources.
- Docs / knowledge base articles with category trails.

## When NOT to use

- Top-level pages — they have no trail.
- Marketing / landing pages — chrome distracts from the hero.
- Mobile-primary surfaces where the trail would steal vertical space — use a single back arrow + page title.
- As a replacement for the browser back button.

## Anatomy

1. **`<nav aria-label="Breadcrumb">`** — the landmark.
2. **`<ol>`** — ordered list inside the nav.
3. **`<BreadcrumbItem>`** (× N) — list item.
4. **`<BreadcrumbLink>`** — anchor or button on every node *except* the terminal one.
5. **`<BreadcrumbSeparator>`** — lucide ChevronRight, `aria-hidden`.
6. **`<BreadcrumbCurrent>`** — the terminal node. Plain text, `aria-current="page"`.
7. **`<BreadcrumbEllipsis>`** — opens a DropdownMenu when items are truncated. Visible only when item count exceeds `maxItems`.

## States

- **Default** — `text.secondary`.
- **Hover** — `text.primary` with optional `action.ghost.bg.hover` chip background.
- **Focus** — `:focus-visible` ring on links (outline + soft shadow).
- **Current** — `text.primary`, no underline, `aria-current="page"`.
- **Truncated** — middle items hidden; ellipsis button reveals them.

## Accessibility

- Landmark: `<nav aria-label="Breadcrumb">`.
- Ordered list semantics so SR exposes position.
- `aria-current="page"` on the terminal node (mandatory).
- Separators wrapped in `aria-hidden="true"`.
- Truncated-menu trigger has `aria-label="Show more pages"`.

## Do

- "Settings / Workspaces / Acme Co / Members"
- Title Case for system pages; sentence case for user content.
- Pair with the `<h1>` directly below the trail.
- On mobile, drop to 3 items max and collapse to an ellipsis.

## Don't

- Don't link the current page.
- Don't paint separators in lime — chrome, not action.
- Don't combine with a Stepper. They communicate different things.
- Don't include the homepage as a separate item if the Navbar already shows it.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release. Default `maxItems=4` with truncate-to-DropdownMenu.
