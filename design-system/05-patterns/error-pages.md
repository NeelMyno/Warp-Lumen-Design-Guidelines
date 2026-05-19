# error-pages — 404, 500, 503, maintenance, offline

> When the application can't deliver, the page that loads still has to be on-brand. Error pages are the cheapest opportunity to show the user the system is alive, in control, and honest about what happened. Lumen's error pattern is a centered single-card composition that mirrors the auth-flow shape but with one big visual cue (the status code, large) + one calm explanation + one recovery action.

## 1. The shape

```
ErrorLayout (full viewport, dark canvas, centered, no chrome)
  ├── StatusCode (visual centerpiece)
  │     └── Display 2xl number "404" / "500" / "503"
  │         · Spring-green accent only at the digit (single accent rule)
  │         · No frame, no background — just typography
  │
  ├── Heading h2  ("Page not found" / "Something broke")
  │
  ├── Supporting body.md (text-secondary, max-w-[42ch])
  │     · One sentence, system-blame, plain language
  │     · No jargon, no apology theater
  │
  ├── ActionRow (horizontal, gap-3)
  │     ├── Button.primary.lg  ("Take me home" / "Try again")
  │     └── Button.ghost.lg    ("Status page" — links to a live status surface)
  │
  └── Footer (body.sm, text-tertiary)
        · "If this keeps happening, contact <Link>support@warp.com</Link>"
        · Optionally show a request-ID for support to reference
```

**Variants — same shell, different content:**

- **404 (Not found).** StatusCode "404". Heading "Page not found." Supporting "The page you're looking for isn't here — it may have moved or never existed." Primary action: home. Ghost: search / report broken link.
- **500 (Server error).** StatusCode "500". Heading "Something broke on our end." Supporting "We've been notified and we're working on it. You can try again in a moment." Primary action: try again (retries the previous request). Ghost: status page.
- **503 (Service unavailable / maintenance).** StatusCode "503". Heading "We're in maintenance." Supporting "We'll be back at 02:00 UTC. Estimated downtime is 30 minutes." Primary action: status page. Ghost: home (when available).
- **Offline (browser-side, no network).** No StatusCode (no server response to display). Heading "You're offline." Supporting "Check your connection and try again." Primary action: reload. Ghost: cached-content link if a PWA.
- **Forbidden (403).** StatusCode "403". Heading "You don't have access to this page." Supporting "Your role may have changed, or you're signed in to the wrong account." Primary action: switch account. Ghost: home.
- **Unauthorized (401).** StatusCode "401". Heading "Please sign in to see this." Supporting "Your session may have expired." Primary action: sign in. Ghost: home.

## 2. Density mode

**Marketing-on-canvas + cozy-on-card.** Same shape as auth-flow: the canvas breathes (96 px from viewport top to BrandMark) so the error feels intentional, not bolted on. The card itself stays compact — the user wants to leave; don't pad the footer.

| Region | Density | Rationale |
|---|---|---|
| ErrorLayout canvas | Marketing | Breathing room signals "we built this on purpose, the system is alive" — opposite of "white-screen-of-death" / unstyled error |
| StatusCode | Display-2xl, single accent | The number is the centerpiece — visual cue before language. Spring-green accent on the digit reinforces brand calm |
| Card padding | Marketing-inside (24–32 px) | Tight enough that the user reads it in one glance |
| Action buttons | Cozy-lg (48 px) | One primary CTA gets weight; secondary stays ghost to defer |

## 3. Tokens for wrappers

| Slot | Token |
|---|---|
| ErrorLayout outer padding | `space.page.marketing` (96 px) top/bottom; `space.inset.md` (24 px) sides on mobile |
| BrandMark → StatusCode gap | `space.section.marketing.tight` (64 px) |
| StatusCode → Heading gap | `space.element.lg` (24 px) |
| Heading → Supporting gap | `space.element.md` (12 px) |
| Supporting → ActionRow gap | `space.element.lg` (24 px) |
| ActionRow → Footer gap | `space.section.marketing.tight` (64 px) |
| Status code color | `color.text.accent` (Spring Green) ONLY on the digit |

## 4. Component recipe

| Slot | Component | Variants |
|---|---|---|
| StatusCode | (Custom typography) | `class="text-display-2xl text-accent"`, `aria-label="HTTP {code} error"` |
| Heading | `h2.text-display-sm` | bold, primary text |
| Supporting | `p.text-body-md.text-secondary` | max-w-[42ch] for readability |
| Primary action | `<Button intent="primary" size="lg">` | "Take me home", "Try again", "Sign in" |
| Secondary action | `<Button intent="ghost" size="lg">` | "Status page", "Report this" |
| Footer link | `<Link>` | text-accent on hover |
| Optional request-ID | `<KeyValue label="Request ID" value="..." mono>` | for support reference |

## 5. Anti-patterns

- **Default-browser error page.** The classic "404 not found" white screen with default serif font is a brand violation. Lumen's contract: every error response renders the Lumen ErrorLayout.
- **Animated 404 illustrations / mascots.** The brand voice is calm + numerate, not whimsical. Decorative illustration competes with the status code as the centerpiece.
- **Saying "Oops! Something went wrong."** Apology theater. The Lumen voice is system-blame in plain language: "Something broke on our end. We've been notified." No "oops" / "uh-oh" / "yikes" / emoji.
- **Listing every recovery option in equal weight.** ONE primary action. Ghost actions defer. A 6-button row reads as confusion, not service.
- **Auto-redirecting after a delay.** The user needs to UNDERSTAND what happened. Auto-redirect after 3 seconds removes the opportunity to read + remember + report. Use an explicit user-driven recovery.
- **Hiding the status code.** Users + support tooling rely on the HTTP code being visible. Don't replace "404" with "Page not found" alone — keep both.
- **Hidden / missing support contact.** When an error keeps happening, the user needs to know how to escalate. Include the support email or link to the status page.

## 6. Working reference

`audit-dashboard/src/app/_not-found.tsx` (404) + `audit-dashboard/src/app/_global-error.tsx` (500-class) ship the Lumen pattern. Both static-render with the chrome retired (no nav, no sidebar — just the ErrorLayout).

The 503 maintenance page is consumer-side: when the deployment / infrastructure is offline, the load-balancer or edge function serves a static 503 page bundled with the build (Vercel: `app/maintenance.html`; Cloudflare: a Worker serving the same HTML).

## 7. Cross-references

- [`../04-content/error-messages.md`](../04-content/error-messages.md) — message catalog for inline errors (this pattern is for full-page errors)
- [`../00-foundations/voice-and-tone.md`](../00-foundations/voice-and-tone.md) — system-blame voice
- [`./auth-flow.md`](./auth-flow.md) — sibling pattern with similar centered-card shape (sign-in is "everything is fine, please authenticate"; error is "something went wrong, please recover")
- HTTP status code semantics — RFC 9110 — match the user-visible message to the actual response code; never lie about it
