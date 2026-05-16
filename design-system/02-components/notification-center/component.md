---
name: NotificationCenter
type: component
status: beta
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Toast, Alert, Popover, Sidebar]
spec: ./component.json
last_updated: 2026-05-16
---

# NotificationCenter

> Popover-anchored inbox of system + user notifications. Bell trigger in the Navbar. Grouped by recency.

## When to use

- App-wide notification inbox.
- Activity feed surfaced from the top nav.
- Mentions / assignments overflow when there's more than Toast can carry.

## When NOT to use

- Transient confirmations — **Toast**.
- Region-scoped status — **Alert**.
- System-wide outage — **Banner**.

## Anatomy

1. **Trigger** — IconButton (Bell) in Navbar slot. Painted with a count badge when `unreadCount > 0`.
2. **Popover content** — `role="region"`, portaled (hard rule 10), 420 px wide.
3. **Header** — title + 'Mark all as read' + filter chips.
4. **Group label** — `type.eyebrow.mono` uppercase ("TODAY", "EARLIER").
5. **Item** — leading source / icon, title, snippet, time. Unread dot in `text.accent`.
6. **Empty state** — centered illustration + "You're all caught up."

## Filter chips

`all` (default) / `unread` / `mentions` / `system`. Roving-tabindex radio group.

## Accessibility

- Trigger `aria-label="Notifications, N unread"`.
- Items as `<li>` with button or anchor inner.
- Unread → `aria-current="true"` or announce via `aria-live` for streaming.
- Escape closes, returns focus to trigger.

## Do

- Group by recency.
- Lead with source.
- Brand-accent dot for unread.
- Empty state with illustration.

## Don't

- Don't paint unread dot in danger red unless critical.
- Don't put marketing in the panel.
- Don't render > 50 items — paginate or route.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release (beta).
