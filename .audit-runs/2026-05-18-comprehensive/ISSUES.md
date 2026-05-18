# Lumen v0.12.7 — Comprehensive Live Audit
**Date:** 2026-05-18
**Browser:** Edge on Personal Mac (via Claude in Chrome extension)
**Dev server:** http://localhost:3100 (port 3100 because :3000 was occupied by Warp-TMS-Builder)
**Viewport:** 1440 × 900
**Routes covered:** /foundations · /library · /landing · /tool · /commerce · /saas · /mobile · /desktop
**Method:** Two rounds — round 1 walks routes top-to-bottom statically, round 2 triggers every overlay and reads the console after each mount.

---

## Issues found

### F-001 — `[RESOLVED — not a bug]` "N" circular indicator at bottom-left
**Initial read:** a stuck Avatar overlaying content on every route.
**Root cause:** the Claude in Chrome screenshot tool's cursor indicator. Confirmed by `JS` scan returning zero DOM matches for the visible glyph at the observed position. The pill that appears next to the cursor on `/library` (`N · 1 Issue · ✕`) is the **Edge DevTools console-issue badge** counting unread console warnings, not a page element.
**Action:** none. Both the cursor indicator and the DevTools badge live in the browser chrome, not the page.

---

### F-002 — `[FIXED v0.12.7]` Sticky-header chrome ingests lime-halo bleed from primary CTAs
**Severity:** High — visible on **6 of 8 surfaces** (library / tool / saas / commerce / mobile / desktop) wherever a primary CTA scrolls close to the header bottom edge. Also visible (in inverted form) on **landing** where the inverse-surface footer washes the chrome muddy gray.
**Symptom:** Strong green halo visible inside the upper portion of the sticky-header chrome when scrolled past `Add to cart` / `Get rates` / `+ New shipment` / `Apply` / `Buy with shop pay` / `Choose Operator` etc. The halo extends asymmetrically over the chrome — strongest above the button x-position, fading at the chrome edges.
**Root cause:** Three multipliers compound:
1. **Halo reach.** `--shadow-glow-accent-strong` is a multi-layer halo. Its outer layer `0 24px 72px -12px var(--lumen-lime-a24)` reaches **72 px** in every direction from the button. A button at y=140 paints a halo from y=68 to y=212.
2. **Header alpha.** The lower edge of the sticky header sits at y=119. The lumen-glass background was `var(--lumen-ink-a62)` — 62 % alpha — so **38 %** of any content directly underneath shows through.
3. **Saturate amplifier.** lumen-glass-strong was `backdrop-filter: ... saturate(160%)`, which *amplifies* whatever chromatic content does pass through.
**Fix landed:**
- `audit-dashboard/src/components/dashboard-shell.tsx` — header `.lumen-glass` → `.lumen-glass-strong` (ink-a86 / blur 28 px). 86 % alpha drops transparency from 38 % to 14 %.
- `audit-dashboard/src/app/globals.css` `.lumen-glass-strong` — `saturate(160%)` → `saturate(110%)`. With 14 % × 1.1 = 15.4 % perceived bleed, the residual is below the visibility threshold against the obsidian canvas.
**Verified:** library / tool / saas / commerce / mobile / desktop chrome now stays brand-dark across every scroll position. Landing's "Light mode preview" inverse band no longer washes the chrome.

---

### F-003 — `[RESOLVED — intentional design]` Landing § "Light mode preview · same tokens, inverted surfaces"
**Initial read:** white `Get started` band + white footer breaking dark mode.
**Source check:** `audit-dashboard/src/app/landing/page.tsx:236-258` — `<section className="bg-[var(--surface-inverse)]">` with the eyebrow caption `"Light mode preview · same tokens, inverted surfaces"`. The section is **deliberately** rendered on the inverted surface to demonstrate that the design system survives a mode flip with the same token contracts.
**Action:** none on the surface itself. The chrome fix (F-002) ensures the sticky header stays brand-dark above this section, so the mode-flip now reads as a deliberate gesture rather than jarring breakage.

---

### F-004 — `[RESOLVED — intentional design]` Commerce § white promo bar "Free freight on orders over $200 — handled by @warp"
**Initial read:** white storefront banner breaking dark mode.
**Source check:** the commerce surface mocks a fashion-brand storefront (Foundry) that intentionally adopts a different surface palette than the system chrome — the Lumen primitives compose **underneath** the brand layer.
**Action:** none.

---

### F-005 — `[FIXED v0.12.7]` React warning: `checked` prop without `onChange`
**Severity:** Low (warning, not error) — but it was making the `/library` DevTools badge count to "1 Issue" on every mount, which masks any future warning that lands on top of it.
**Console message:** *"You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`."*
**Source:** `audit-dashboard/src/app/library/client.tsx:474` — `<Radio name="rate" value="contract" label="Contract rate" description="$0.18/mi · 14-day SLA" checked />`. The showcase calls Radio with `checked` to display the canonical option's visual state statically, but no `onChange` is provided.
**Why it was hard to fix at the call site:** `<input type="radio">` doesn't accept `readOnly`, so the React-recommended escape hatch isn't available for radios.
**Fix landed:** `audit-dashboard/src/components/primitives/inputs.tsx` — when `onChange` is omitted, the Radio falls back to `defaultChecked` instead of forwarding `checked`. The underlying native input switches to uncontrolled mode; static showcases stay visually correct without React warning. Controlled-mode usages with `onChange` are unchanged.
**Verified:** `/library` mounts with a clean console — Edge DevTools no longer shows "1 Issue" beside the cursor on library page.

---

### F-006 — `[INSPECTED — no action]` `--lumen-neutral-N` rendering in cream-ramp prose
**Initial read:** the double-dash `--` in `--lumen-neutral-N` rendering as a thin ligature in Satoshi.
**Source check:** `audit-dashboard/src/app/foundations/page.tsx:116` — source carries the literal `\`--lumen-neutral-N\`` wrapped in backticks (rendered as `<code>`). Satoshi at body size with `font-feature-settings` enabled can render `--` as a slightly thinner kerned pair. Not a bug — Satoshi's OpenType feature set is on by design for the editorial sections.
**Action:** none.

---

### F-007 — `[FIXED v0.12.7]` Version SSOT propagation
The version SSOT introduced in v0.12.5 (`audit-dashboard/src/lib/version.ts` exporting `LUMEN_VERSION`) does its job — bumping the constant from `v0.12.6` → `v0.12.7` updated the header pill, footer line, foundations hero chip (`• v0.12.7 · Obsidian`), library hero chip, tool hero chip, and command-palette footer in one render, verified live.

Also bumped `VERSION` file at repo root to `0.12.7` (per ADR 0009 versioning policy).

---

## Routes covered — per-surface verification

| Route | Pre-fix bleed visible? | Post-fix bleed visible? | Other findings |
|---|---|---|---|
| `/foundations` | mild | none | clean (the original audit anchor) |
| `/library` | severe (Apply / Checkout / button states) | none | F-005 React warning fixed |
| `/landing` | severe (active tab pill area, inverse footer) | none | F-003 intentional |
| `/tool` | severe (Get rates pill, top right) | none | – |
| `/commerce` | severe (Add to cart pill) | mild residual at button edge | F-004 intentional |
| `/saas` | severe (Get rates side-panel pill) | mild residual at button edge | – |
| `/mobile` | mild (+New shipment) | none | – |
| `/desktop` | mild (+New shipment) | none | – |

Residuals on `/commerce` and `/saas` are the buttons themselves visible at the top of the viewport at the audited scroll positions — not chrome bleed.

---

## What this fix pack deliberately did NOT change

- **The button glow ladder itself.** `--shadow-glow-accent` and `--shadow-glow-accent-strong` are correct at the button level. They're the system's "lit moment" per ADR 0022 (premium psychology peak-end). The defect was at the chrome layer, not the button layer.
- **The aurora / grain / architectural grid backgrounds.** Inspected via JS; no radial gradients exist in the DOM. The faint chromatic noise occasionally visible in JPG screenshots is screenshot compression artifact, not a real surface bug.
- **The two intentional-light-surface bands** (F-003 Landing, F-004 Commerce). They're load-bearing design gestures, and the chrome fix means they now compose cleanly with the sticky header.
