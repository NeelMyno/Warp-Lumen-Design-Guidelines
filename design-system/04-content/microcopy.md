---
name: Microcopy library
type: content
version: 1.0.0
last_updated: 2026-05-02
related: [./ui-writing-style.md, ./error-messages.md, ./empty-states.md]
---

# Microcopy library

> Reusable phrases for common UI moments. Use these verbatim or as templates. When you need a new phrase, run it through the rules in `ui-writing-style.md`.

## Buttons

| Moment | Label |
|---|---|
| Submit a quote form | Get rates |
| Confirm a booking | Book now |
| Save current state | Save changes |
| Discard pending edits | Discard |
| Cancel a non-destructive action | Cancel |
| Cancel an order (destructive) | Cancel order |
| Re-route a shipment | Re-route |
| Escalate to support | Escalate |
| Open carrier portal | Open in carrier |
| Add another row | Add another |
| Remove this row | Remove |
| Filter table | Filter |
| Apply filters | Apply |
| Reset filters | Reset |
| Sort | Sort |
| Refresh data | Refresh |
| Export | Export |
| Create new | New shipment / New quote / New lane |
| Sign in | Sign in |
| Sign out | Sign out |
| Try again after error | Retry |

## Loading

| Moment | Label |
|---|---|
| Quote in progress | Quoting 14 carriers… |
| Booking in progress | Booking… |
| Saving | Saving… |
| Loading initial data | Loading… |
| Refreshing | Refreshing… |
| Searching | Searching… |
| Generating report | Generating… |

## Success toasts

| Moment | Toast |
|---|---|
| Quote returned | 14 quotes ready. Review now. |
| Booking confirmed | Booked. Tracking is live. |
| Order canceled | Order canceled. |
| Saved | Saved. |
| Copied to clipboard | Copied. |
| Settings updated | Settings updated. |
| Invitation sent | Invite sent to {email}. |
| Export complete | Export ready. |

## Empty states

| Context | Headline | Supporting | Action |
|---|---|---|---|
| No shipments yet | No active shipments. | New quote starts a lane. | New quote |
| No tasks | No tasks today. | When a shipment needs your attention, it appears here. | (none) |
| No search results | No matches for "{query}". | Try a different search term. | Clear search |
| No exceptions | All clear. | No active exceptions. | (none) |
| First-run | There is no setup. | Quote a lane. | New quote |
| Filtered list empty | No shipments match these filters. | Adjust or reset. | Reset filters |

## Form validation

| Moment | Message |
|---|---|
| Required field empty | This field is required. |
| Invalid ZIP | ZIP must be 5 digits. |
| Invalid email | Enter a valid email address. |
| Invalid weight | Weight must be a positive number. |
| Date in past | Pickup date must be today or later. |
| Pickup after delivery | Pickup must be before delivery. |
| File too large | File must be under 10 MB. |
| Wrong file type | Upload a PDF or image. |

## Confirmations (dialogs)

| Moment | Title | Body |
|---|---|---|
| Cancel a booked order | Cancel order WRP-9824? | This cannot be undone. The carrier has been notified and any cancellation fees will apply. |
| Delete a saved preset | Delete preset "Standard LTL"? | This deletes the preset for everyone on your team. |
| Sign out | Sign out? | You'll need to sign in again to access shipments. |
| Discard unsaved changes | Discard changes? | Your edits to this quote will be lost. |

## Tooltips

| Element | Tooltip |
|---|---|
| Bell icon | View notifications |
| Filter button | Filter by status, lane, carrier |
| Refresh button | Refresh now (last updated 30 s ago) |
| Export button | Export to CSV |
| Settings cog | Settings |
| Hold modifier hint | Hold ⌘ to multi-select |
| Live status dot | Updating every 30 s |

## Status badges

Always use leadingDot for status variants. Use these labels.

| Status | Label |
|---|---|
| Created, not yet picked up | Created |
| Pickup scheduled / in progress | Pickup |
| In transit, on time | On time |
| In transit, slipping | At risk |
| In transit, late | Late |
| Delivered | Delivered |
| Exception (lost, damaged) | Exception |
| Live tracking active | Tracking live |

## Help / docs links

| Context | Label |
|---|---|
| Read API docs | Docs |
| View the changelog | Changelog |
| Contact support | Support |
| View status page | Status |

## Numbers in copy

| Pattern | Use |
|---|---|
| `655K+ shipments routed` | Marketing claim with bragging count |
| `98.2% on-time` | Operator metric, precise |
| `12 active shipments` | Inline count in UI |
| `Last 30 days · 1,284 shipments` | Period + metric |
| `Quote ready in ~12s` | Time estimate, lowercase "s" for seconds |
| `Sub-second response` | Marketing claim about speed |

## Banned phrases

Do not use these. Replace with the recommended phrasing.

| Banned | Replacement |
|---|---|
| "Welcome aboard!" | (delete; show the product) |
| "You're all set!" | (delete; the setup is the product working) |
| "Oops!" | (delete; describe what happened) |
| "Just a moment…" | "Loading…" or specific verb |
| "Awesome!" | (delete) |
| "We're here to help." | (delete; or link to support) |
| "Powered by AI" | name what the AI does ("Smart routing", "Auto-quote") |
| "Effortlessly" | (delete; the lack of effort speaks for itself) |
| "Seamlessly" | (delete) |
| "Cutting-edge" | (delete) |
| "World-class" | (delete) |
| "Robust" | (delete) |

## User greeting fallback chain (v0.15 R16)

When you render a personalized greeting ("Good afternoon, {name}"), the name resolution follows a strict graceful-degradation chain. The TMS consumer (chat 36-A item #10) shipped `Good afternoon, Warp` for the account `design@wearewarp.com` — the chain reached the company name as a last resort because the user-display utility had no email-local-part fallback.

### The chain

```ts
function displayName(user: User): string {
  // 1. Preferred display name (a nickname / customized greeting name).
  if (user.preferredName?.trim()) return user.preferredName.trim();

  // 2. First name from the canonical name field.
  if (user.firstName?.trim()) return user.firstName.trim();

  // 3. First word of the full name (if firstName isn't separately captured).
  if (user.fullName?.trim()) {
    const first = user.fullName.trim().split(/\s+/)[0];
    if (first) return first;
  }

  // 4. Email local-part (left-of-@), filtered against a generic-account denylist.
  if (user.email) {
    const local = user.email.split("@")[0]?.trim().toLowerCase();
    if (local && !GENERIC_LOCAL_PARTS.has(local)) {
      // Title-case the local-part. "neel.tengariya" → "Neel"
      const first = local.split(/[.\-_]/)[0];
      return first.charAt(0).toUpperCase() + first.slice(1);
    }
  }

  // 5. Final fallback — generic, never the company name.
  return "there";
}

const GENERIC_LOCAL_PARTS = new Set([
  "admin", "administrator", "root", "noreply", "no-reply",
  "support", "help", "info", "contact", "hello", "team",
  "design", "engineering", "ops", "accounting", "finance",
  "sales", "marketing", "press", "hr", "people",
  "owner", "founder", "ceo", "cto", "cfo", "coo",
]);
```

### Why "there" — not the company name

"Good afternoon, Warp" reads off — the company isn't a person, and addressing a person by their company name feels mechanical. "Good afternoon, there" is a recognized graceful greeting in human conversation and reads natural under all degradation paths.

The denylist catches generic-account local-parts that AREN'T people. `design@wearewarp.com` → local part "design" → denied → falls through to "there". `neel@wearewarp.com` → local part "neel" → allowed → "Good afternoon, Neel".

### When to use this chain

- Any personalized greeting in app chrome (dashboard header, side nav, command palette).
- Email subject-line personalization ("Daniel, your weekly digest is ready").
- Onboarding moments where addressing the user by name builds trust.

### When NOT to greet by name

- Repeat-visit operator chrome — the greeting adds noise after the first session. Drop it via `data-onboarding="false"` on the page header, OR retire the greeting entirely and put it in the user-menu hover-state instead.
- Notifications / toasts — name the action, not the actor.
- Error messages — name what went wrong, not who. ("Couldn't save changes" beats "Daniel, we couldn't save your changes".)
