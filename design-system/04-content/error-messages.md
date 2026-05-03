---
name: Error messages
type: content
version: 1.0.0
last_updated: 2026-05-02
related: [./ui-writing-style.md, ./microcopy.md]
---

# Error messages

> The system is responsible for failures, not the user. Errors are written from the system's perspective, in plain language, with the next action obvious.

## The Lumen error template

Every error has three parts:

1. **What happened** — past tense, system-blame, no jargon.
2. **What it means** (optional) — single line, only if it isn't self-evident.
3. **What to do next** — verb-led, action button or link.

Example:
> **We couldn't reach the carrier.**
> The quote service is offline. We're retrying every 30 seconds.
> [Retry now] [View status]

## Pattern catalog

### Network / connection

| Trigger | Message | Action |
|---|---|---|
| Network offline | "You're offline. Changes will save when you're back." | (none, system-handled) |
| Slow API | "This is taking longer than usual. Still trying." | (none) |
| API down | "Quote service is offline. Retrying in 30 s." | Retry now |
| Timeout | "Request timed out after 30 s." | Retry |
| 5xx | "Something on our end. We've been notified." | Retry · View status |

### Validation

| Trigger | Message |
|---|---|
| Required empty | This field is required. |
| Invalid format (ZIP, email, etc.) | ZIP must be 5 digits. / Enter a valid email address. |
| Out of range | Weight must be between 1 and 50,000 lb. |
| Logical conflict | Pickup must be before delivery. |
| Duplicate | A preset named "Standard LTL" already exists. Pick a different name. |

### Authorization

| Trigger | Message | Action |
|---|---|---|
| Not signed in | "You're signed out." | Sign in |
| Permission denied | "You don't have access to this lane." | Request access |
| Session expired | "Your session expired." | Sign in again |
| 2FA required | "Verify with your second factor to continue." | Send code |

### Domain failures (carrier / freight specific)

| Trigger | Message | Action |
|---|---|---|
| No carrier accepted | "No carrier accepted this lane at this rate." | Adjust rate · Try alternative carriers |
| Carrier rejected | "Sterling LTL declined: weight exceeds equipment limit." | Re-quote |
| Booking conflict | "This shipment was just booked by another teammate." | View shipment |
| Tracking lost | "Carrier hasn't pinged in 4 h. Last seen at SLC hub." | Contact carrier |
| Cancellation window passed | "This order can no longer be canceled. Pickup completed at 04:18." | Contact carrier |

### File / upload

| Trigger | Message |
|---|---|
| Too large | File must be under 10 MB. |
| Wrong type | Upload a PDF or image. |
| Failed upload | Upload failed. Check connection and retry. |

### Catastrophic / unexpected

| Trigger | Message | Action |
|---|---|---|
| Unhandled error in UI | "Something on our end. We've been notified. The page may need a refresh." | Refresh page |
| 404 | "We couldn't find that page." | Go back · Open dashboard |
| 500 | "Something on our end. We're investigating." | Refresh · View status |
| Permission gone (asset deleted) | "This shipment no longer exists." | Open shipments |

## Inline vs toast vs dialog vs banner

| Severity | Surface | Example |
|---|---|---|
| Field-level validation | Inline below field | "ZIP must be 5 digits." |
| Recoverable, transient | Toast (sticky) | "Quote service is offline. Retrying in 30 s." |
| Recoverable, requires user choice | Dialog | "This order can no longer be canceled. Continue?" |
| System-wide degradation | Banner (persistent at top) | "Carrier API degraded — quotes may be slow until 14:00." |
| Page-level fatal | Empty page state | "We couldn't find that page." |

## Don'ts

- ❌ Don't use "Oops!", "Uh-oh", "Yikes" — anything cute.
- ❌ Don't show stack traces or error codes alone. (A code can be present, but only as supplementary detail in a copyable expandable.)
- ❌ Don't blame the user. Even "You entered an invalid email" can become "Enter a valid email address."
- ❌ Don't use red without text. The status color reinforces; the text carries the meaning.
- ❌ Don't say "Please" or "Sorry" performatively. If a real apology is warranted (an outage), say it once, briefly.
- ❌ Don't auto-dismiss errors. The user must acknowledge.

## Examples — full error toast

Good:
```
[!] We couldn't reach the carrier.
    Quote service is offline. Retrying in 30 s.
    [Retry now]
```

Bad:
```
[!] Error: ECONNREFUSED 502
    Something went wrong! Please try again or contact support.
    [OK]
```

## Logging vs surfacing

The error the user sees is not the error you log. The log can have the stack trace, the request ID, the carrier name, the timing — everything. The surface gets the human one-liner. Pair them with a request ID the user can quote in support: "Reference: req_a1b2c3."
