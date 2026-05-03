---
name: Empty states
type: content
version: 1.0.0
last_updated: 2026-05-02
related: [./microcopy.md, ../02-components/empty-state/component.md]
---

# Empty states

> A composed message that appears when a collection has no items yet. Type-led, never illustration-led. Two lines max. One headline + one supporting + one optional primary action.

## The template

```
[ICON?]

[HEADLINE — type.heading.h3, primary]

[SUPPORTING — type.body.sm, secondary, ≤2 lines]

[PRIMARY ACTION (optional)]
```

## Catalog

### App / data

| Context | Headline | Supporting | Action |
|---|---|---|---|
| No active shipments | No active shipments. | New quote starts a lane. | New quote |
| No tasks today | No tasks today. | When a shipment needs your attention, it appears here. | (none) |
| No exceptions | All clear. | No active exceptions. | (none) |
| No saved presets | No presets yet. | Save the current quote as a preset to reuse. | Save preset |
| No team members | No teammates yet. | Invite someone to share lanes with. | Invite |
| Empty inbox | Inbox zero. | Notifications appear here. | (none) |
| Empty cart | Your cart is empty. | Browse the shop to add items. | Browse |
| No favorites | No favorites yet. | Save a lane to come back to it. | (none) |

### Search / filter

| Context | Headline | Supporting | Action |
|---|---|---|---|
| Search returned nothing | No matches for "{query}". | Try a different search term. | Clear search |
| Filtered to nothing | No shipments match these filters. | Adjust or reset to see all. | Reset filters |
| Date range returned nothing | Nothing happened in this range. | Try a wider window. | Last 30 days |

### First-run

| Context | Headline | Supporting | Action |
|---|---|---|---|
| First run | There is no setup. | Quote a lane. | New quote |
| First team member | This workspace is yours. | Invite teammates to collaborate. | Invite |
| First integration | No integrations yet. | Connect your ERP to push shipments. | Connect ERP |

### Error-adjacent

(For genuine errors, use `error-messages.md` patterns; these are friendly empties for "this thing was deleted by someone else" cases.)

| Context | Headline | Supporting | Action |
|---|---|---|---|
| Resource deleted | This shipment no longer exists. | It may have been canceled. | Open shipments |
| Permission revoked | Access was removed. | Ask your admin to restore access. | (none) |

## Specs

- **Vertical centering** within the available space.
- **Max width:** `60ch` for the supporting line.
- **Vertical padding:** `space.16` (64 px) top and bottom on full-page empties; `space.8` (32 px) inside cards.
- **Icon (optional):** 18–20 px inside a 40 × 40 framed circle (`border.default`, `radius.full`).
- **Headline:** `type.heading.h3` (20 px, medium weight).
- **Supporting:** `type.body.sm` (14 px, secondary color).
- **Action:** `Button[intent=primary]` for primary action; `intent=secondary` if context demands. Single button.

## Bans

- ❌ Illustrations. ("A friendly cloud waving" is forbidden.)
- ❌ "Oops!" / "Uh-oh!" / "Nothing here yet 🙃"
- ❌ Multiple actions of equal weight.
- ❌ Long paragraphs of explanation.
- ❌ Auto-redirects from empty states.
- ❌ Clever empty states that hide the lack of data behind humor.
