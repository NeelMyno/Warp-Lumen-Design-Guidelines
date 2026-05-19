# email-layout — transactional + marketing email shell

> Email is a constrained Lumen canvas. Outlook on Windows still uses Word's HTML renderer; Gmail's clipping cap is 102 KB; iOS Mail strips most CSS; many clients don't load remote images. The Lumen email pattern is a single-column, table-based, inline-styled, ≤600 px-wide layout that degrades gracefully to plain-text in clients that can't render it. Tokens map to the same Lumen palette but ship as hex literals because CSS variables aren't supported in most email clients.

## 1. The shape

```
EmailHTML (640 px max, table-based, inline-styled, plain-text-alternate present)
  ├── Preheader (visually hidden text, but pre-rendered in inbox preview)
  │     · 1 sentence, 80–100 chars, summarizes the email's purpose
  │     · Prevents the inbox from auto-extracting random body text
  │
  ├── Header (table, full width, 64 px tall)
  │     ├── Lumen wordmark (left, 24 px tall, SVG with PNG fallback)
  │     └── Optional muted tagline (right, body.xs, text-tertiary hex)
  │
  ├── Hero (optional — for marketing only)
  │     └── Image 640 × 320, alt text required, no text overlay
  │
  ├── Body block (table, max 640 px wide, padding 32 px)
  │     ├── Heading h2 ("Your booking is confirmed.")
  │     ├── Body copy (sans-serif fallback, font-size 16 px, line-height 24 px)
  │     ├── Key-value rows (label/value pairs, label text-tertiary)
  │     ├── Primary CTA (table-cell button — see §4)
  │     └── Optional secondary CTA (text link, accent color)
  │
  ├── Footer (table, body.xs, text-tertiary)
  │     ├── "Sent by Warp · 123 Logistics St · San Francisco CA"
  │     ├── Unsubscribe link (required for marketing; mailto: for transactional)
  │     ├── Preferences link
  │     └── Optional support email
  │
  └── (Plain-text alternate version — same content, no formatting)
```

**Variants — same shell, different content:**

- **Transactional confirmation.** Heading is the action's past-tense verb ("Booked", "Saved", "Sent"). Body summarizes the transaction. KeyValue rows show the structured data (date, recipient, amount, reference). Primary CTA links to the canonical view of the transaction.
- **Transactional notification.** Heading is an event past-tense ("Shipment picked up", "Payment received"). Body summarizes. CTA links to detail.
- **Marketing announcement.** Hero image + Heading is a value statement ("We shipped Lumen v0.14"). Body is 2–3 short paragraphs. CTA is the primary call-to-action.
- **Marketing digest.** Hero optional; body is a stack of 3–5 content cards each with title + 1-line summary + link. Footer has the standard marketing-email components.
- **Password reset / verification (security).** No hero. Heading is action-specific ("Verify your email", "Reset your password"). CTA is a single button that triggers the action. Below the CTA, a plain-text fallback URL + expiry note. **Critical:** the reset link must be the ONLY way to act — never include the new password / token in plain text.

## 2. Density mode

**Always cozy.** Email clients clip + reformat unpredictably. Generous padding is the only way to ensure the body has breathing room across renderers.

| Region | Density | Rationale |
|---|---|---|
| Header | Marketing-tight | Brand chrome, fixed height, minimal padding |
| Body block padding | 32 px | Outlook + iOS Mail both render this consistently |
| Field gap | 16 px | KeyValue row spacing |
| CTA padding | 16 px vertical, 32 px horizontal | Table-cell button needs visible padding (no border-radius in Outlook) |
| Footer | Marketing-tight | Small text, generous line-height (≥ 1.5×) |

## 3. Tokens for wrappers — but as hex literals, not CSS variables

Email clients don't support CSS variables (`var(--*)`). Tokens convert to hex at build time. The Lumen email build script (consumer-side; not part of audit-dashboard) walks `_build/css/tokens.light.css` and inlines hex values.

| Slot | Token | Hex (light theme only — emails are light-default) |
|---|---|---|
| Canvas | `color.surface.canvas` | `#FAFAFA` |
| Card surface | `color.surface.raised` | `#FFFFFF` |
| Primary text | `color.text.primary` | `#0D0D0D` |
| Secondary text | `color.text.secondary` | `#404040` |
| Tertiary text | `color.text.tertiary` | `#6B6B6B` |
| Border hairline | `color.border.default` | `#E6E6E6` |
| Accent (CTA) | `color.accent.500` | `#00FA8A` |
| Accent foreground | `color.accent.fg` | `#07120D` |
| Spring-green dot color | same as accent.500 | `#00FA8A` |

**Always light theme.** Dark-mode email is supported only by Apple Mail (`@media (prefers-color-scheme: dark)`) and is unreliable elsewhere. Lumen emails ship light-default; dark-mode email rendering is out of scope.

## 4. The CTA button pattern

Outlook on Windows + many older clients don't render `border-radius` reliably. The Lumen email CTA pattern is a **table-cell button** with explicit width + padding, no border-radius, fallback to underlined link in plain-text version:

```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
  <tr>
    <td bgcolor="#00FA8A" style="padding: 16px 32px; mso-padding-alt: 0;">
      <a href="https://app.warp.com/bookings/B-12345"
         style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 16px; font-weight: 600; color: #07120D;
                text-decoration: none; display: inline-block;">
        View your booking
      </a>
    </td>
  </tr>
</table>
```

`bgcolor` attribute (not just CSS) for Outlook. `mso-padding-alt: 0` resets Outlook's padding workaround. Accent foreground `#07120D` (the brand-controlled WCAG-AA-pass on spring green from `accessibility.md`) — never white on spring green.

## 5. Component recipe (web parallels)

Email primitives don't share code with web — they're authored as HTML tables, not React components. But the SHAPE matches the web Lumen patterns:

| Email role | Closest web component | Rendering difference |
|---|---|---|
| EmailHTML wrapper | (Card with padding="lg") | Web uses CSS box; email uses nested tables |
| Heading h2 | `text-display-sm` | Same typography, but inlined font-family + font-size |
| Body copy | `text-body-md` | Same; line-height 1.5 |
| KeyValue row | `<KeyValue>` | Web uses flex; email uses table row |
| Primary CTA | `<Button intent="primary" size="lg">` | Web: CSS; email: table-cell pattern above |
| Divider | `<Divider>` | Web: 1 px CSS border; email: `<hr>` with bgcolor attr |
| Footer | `<Footer>` | Same prose, but everything inlined |

## 6. Anti-patterns

- **Web-fonts in email.** Custom typeface load is unreliable across clients. Lumen email uses the system-font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`. Satoshi does NOT load in email; the metric-aligned system-font fallback is what readers see.
- **CSS variables / `var(--token)`.** Outlook + most clients ignore them. Hex literals at the inline-style level.
- **Background images for content.** Many clients block images. Don't put critical content (CTAs, instructions) on a background image — they'll be invisible to image-blockers.
- **JavaScript.** Stripped by every major client. No animations, no interactive elements.
- **`<style>` in head.** Stripped by Gmail Web + most clients. Inline-style every property.
- **`border-radius`.** Outlook on Windows ignores. Use square corners; design accepts the constraint.
- **Auto-darkening.** Don't use `prefers-color-scheme: dark` to flip the whole email — Apple Mail's auto-dark forces incorrect color inversions on light hex values. Ship a single light-default and let the OS auto-darken contrast adjustments.

## 7. Working reference

Lumen does NOT bundle an email-build pipeline in the audit-dashboard. The pattern lives here as a contract; consumer apps (Warp Mailflow, the transactional-email service referenced in 04-content/microcopy.md "Transactional emails" section) implement the table-based HTML and load Lumen tokens via the hex-literal export from `_build/email/tokens.email.json` (a build target to be added).

Plain-text alternate is required by every transactional email — RFC 8058 + RFC 8617 mandate it for transactional senders to avoid spam filtering. The plain-text version has the same content + URL, no formatting, max line length 78 chars per RFC.

## 8. Cross-references

- [`../04-content/microcopy.md`](../04-content/microcopy.md) — message catalog (Lumen email subject lines + preheaders)
- [`../00-foundations/typography.md`](../00-foundations/typography.md) — system-font stack (the fallback Lumen email uses)
- [`../00-foundations/color.md`](../00-foundations/color.md) — hex values per token (the source-of-truth for email's hex literals)
- [`../00-foundations/print.md`](../00-foundations/print.md) — sibling pattern: print is a constrained Lumen canvas in the same way email is
- RFC 8058 (Signaling One-Click Functionality for List Email Headers) — unsubscribe contract
- Litmus / Email on Acid — cross-client testing tools
