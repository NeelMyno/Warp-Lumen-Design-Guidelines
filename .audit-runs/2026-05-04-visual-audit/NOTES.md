# Lumen Live Visual Audit — 2026-05-04

**URL:** https://warp-lumen-design-guidelines.vercel.app/
**Live deployed version:** v0.11.0 (footer: "V0.11.0 · AUDIT PREVIEW")
**Repo HEAD:** v0.11.4 — **live is 4 patches behind**
**Audit method:** Playwright @ Chromium 1217 (since Edge MCP couldn't capture screenshots)
**Capture pass:** 8 routes × {desktop dark + desktop light + mobile} + 4 hover/focus states
**Audit rubric:** Premium Psychology (50ms halo, cognitive fluency, peak-end, aggressive hierarchy, restraint as taste, micro-detail care)

---

## Severity scale

- **P0** — breaks first-impression / fundamental. The site demonstrably fails as "premium" on this point.
- **P1** — breaks hierarchy / cognitive fluency. The visitor has to work harder than they should.
- **P2** — token discipline / micro-detail miss. Nobody-notices-but-everybody-feels.
- **P3** — polish / nice-to-have.

---

## Issue inventory (16 issues across 8 routes + chrome)

### P0 — First-impression / fundamental

#### P0-1 · Mobile nav drops 4 of 8 tabs (chrome / responsive)
Mobile viewport (390px) shows only "Foundations · Library · SaaS · Landing". Tool, Commerce, Mobile, Desktop are silently invisible — no horizontal scroll, no overflow indicator, no hamburger. Half the IA disappears.

**Premium Psychology**: Cognitive fluency violation (the visitor can't navigate to half the site). Strategic structure failure (sitemap broken on smallest viewport).
**Fix:** Add `overflow-x-auto` + `snap-x snap-mandatory` + hidden scrollbar to the tab strip. Or collapse to dropdown below ~640px.

#### P0-2 · Mobile demo content doesn't reflow
The nested mockups (Landing browser-frame hero, SaaS dashboard, Tool quote builder, Ecommerce storefront) keep desktop dimensions on a 390px viewport. The Landing H1 "The freight network for builders" runs off-screen — only "The freight" fits the width. SaaS sidebar steals 290px on a 390px viewport, pushing KPI cards into a clipped sliver. This is the most "not premium" failure mode.

**Premium Psychology**: First impression fail on mobile (50ms test goes negative). Cognitive fluency failure (content is literally unreadable).
**Fix:** Each nested demo needs a mobile breakpoint that either (a) downscales the demo content uniformly, (b) replaces with a "view on desktop" affordance + tablet-scaled preview, or (c) uses container queries to truly reflow. Quickest viable: hide the demos below `md:` and show a `MobileDemoPlaceholder` saying "Open on desktop to interact."

#### P0-3 · /foundations hero is an empty card frame
The most-prime real estate (above-fold, ~720px high) is consumed by a hairline-bordered card containing exactly 2 words: "Foundations. Lit." The card is ~890×144px of empty space surrounding 240×54px of text. The card frame itself becomes the focal point, not the headline.

**Premium Psychology**: Halo-effect violation — the 50ms judgment lands on "an empty rectangle". Aggressive hierarchy violation — there's no dominant focal point because the card frame outweighs the content. Peer comparison: Apple shows a product, Stripe shows code, Linear shows the product UI. Lumen shows two words in a frame.
**Fix:** Either (a) remove the card and let the headline anchor the page directly, (b) fill the card with a live token-system preview (4 swatches + a Satoshi specimen + a button + a live-dot — all the system primitives in one frame), or (c) replace with a hero-canvas illustration. Recommend (b).

#### P0-4 · Default mood follows system preference, not brand
The site adopts `prefers-color-scheme` for theme. Playwright headless (light system) gets light mode; the user's Edge with dark system gets dark. The brand is "Obsidian Mint" — Premium Psychology says the brand should ASSERT itself, not inherit the OS. Half the visitors land on light mode and never see the canonical dark canvas the system is named after.

**Premium Psychology**: Brand strategy weakness (the visual identity should be deterministic, not OS-conditional). Halo-effect risk (visitors who get light first won't know there's a "premium dark mode" beneath).
**Fix:** Lock `data-theme="dark"` + `data-mood="obsidian-mint"` as the default. Allow override via the toggle, persist user preference in `localStorage`.

---

### P1 — Hierarchy / cognitive fluency

#### P1-5 · Top header version-metadata redundancy
Above the fold, "V0.11" appears **5 separate times in ~600px**:
1. "Lumen [V0.11]" brand chip (top-left)
2. "SYSTEM V0.11 LIVE" status (top-right)
3. "TAB 01 • SYSTEM PRIMITIVES • OBSIDIAN-MINT • V0.11" eyebrow
4. "v0.11.0 · Obsidian Mint" chip below subtitle
5. (Inside `/library`) green "v0.11.0 · 25 sections · 250+ components" chip in eyebrow

Each individually is fine. Together they create version-noise that competes with content.

**Premium Psychology**: Restraint-as-taste violation. Cognitive load inflation.
**Fix:** Keep one anchor: the brand chip "Lumen v0.11" (top-left). Remove "SYSTEM V0.11 LIVE" from header (move to footer). Strip the trailing "• V0.11" from breadcrumbs (keep just `TAB 01 · SYSTEM PRIMITIVES · OBSIDIAN-MINT`). Demote the chip-strip "v0.11.0 · Obsidian Mint" pill to a quieter caption. Result: V0.11 appears once in chrome, once per page-eyebrow context — instead of 5x.

#### P1-6 · Right-rail sidebar is a flat list of 13 links
On `/foundations` the right rail lists Color · Typography · Spacing & grid · Radius · Elevation · Surfaces · Motion · Iconography · Voice · Controls · Display · Navigation · Live data. All same size, same color, no grouping. The visitor scans serially.

**Premium Psychology**: Aggressive hierarchy violation (no dominant focal point, no grouping signals). Cognitive fluency penalty.
**Fix:** Group into 4 categories with a quiet `text-overline` label: "Visual primitives" (Color, Typography, Spacing & grid, Radius, Elevation, Surfaces) · "Motion & visual language" (Motion, Iconography, Voice) · "Component patterns" (Controls, Display, Navigation) · "Live signals" (Live data).

#### P1-7 · Hero chip-strip — 4 chips, equal weight, conflicting categories
Below the foundations subtitle: 4 chips read "v0.11.0 • Obsidian Mint" / "8-point soft grid" / "Satoshi · single-typeface system" / "WCAG 2.2 AA". One is a version+mood, one a grid choice, one a typography choice, one an a11y badge. Same visual weight = no priority cue.

**Premium Psychology**: Restraint failure. The chip strip is 4 different "things to know" all shouting equally.
**Fix:** Reduce to 3 chips of differentiated weight: a primary (filled, accent-on) `v0.11 · Obsidian Mint` and 2 quieter outline-only chips (`8-pt soft grid`, `WCAG 2.2 AA`). The Satoshi chip is the same info as the typography section header — drop it.

#### P1-8 · Type scale has 12 unique sizes — far exceeds Major Third intent
On `/foundations` alone: 10px, 11px, 12px, 13px, 14px, 15px, 16px, 20px, 28px, 31px, 39px, 49px appear in rendered text. Major-third (1.25x) is supposed to gate this to ~7 stops (12, 14, 16/18, 22, 28, 36, 44+). The 13px size has **101 instances** (text-body-xs preset) and 15px has **26 instances** — neither is on the canonical scale.

**Premium Psychology**: Cohesion failure ("not random — intentional" check fails for typography). 
**Fix:** Audit text-body-xs (13px) and text-body-sm (15px) presets — either move to 12/14 to match the scale, OR document them in `typography.md` as legitimate intermediate stops with a stated rationale.

---

### P2 — Token discipline / micro-detail

#### P2-9 · 65 instances of 10px text via arbitrary `text-[10px]` class
Color-swatch hover index labels use `text-[10px] font-semibold lumen-tnum` arbitrary class. 10px is below the 12px UI floor declared in `typography.md` and v0.10.3, AND `text-[10px]` violates `lint:no-arbitrary-typography`.

**Premium Psychology**: Micro-detail care failure (the system has its own rule and breaks it 65 times).
**Fix:** Add `text-micro: 10px` semantic preset OR (better) use the existing `text-caption` (probably 12px). Replace `text-[10px]` with `text-micro` or `text-overline-xs`.

#### P2-10 · Tab `shortLabel: "Commerce"` ≠ `slug: "ecommerce"` → /commerce returns 404
`audit-dashboard/src/lib/tabs.ts:53-58`: the tab shows "Commerce" in the nav but routes to `/ecommerce`. A user who reads "Commerce" and types `/commerce` in the address bar lands on the Next.js default 404. URL ≠ visible label.

**Premium Psychology**: Cognitive fluency violation (URL doesn't match the visible label). SEO miss.
**Fix:** Rename slug + route folder: `/ecommerce` → `/commerce` AND keep the shortLabel "Commerce" (or invert: keep `/ecommerce` and rename label to "E-commerce"). Recommend the rename — "Commerce" is the visible word; URL should match.

#### P2-11 · /ecommerce empty product image stacks
The PDP shows 3 stacked gray squares as product images. They're placeholders for product photos that don't exist. Premium Psychology checklist: "no decorative for decoration's sake — every asset earns its place." Empty placeholders fail this.

**Premium Psychology**: Bespoke-assets failure (placeholders are the antithesis of bespoke). First impression weakening on the PDP.
**Fix:** Either generate 3 monoline product illustrations (matching the iconography drawing style in `04-content/iconography.md`), or fill with a styled diagram/blueprint of the product. The Foundry x Field Jacket Mk II concept is rich enough to deserve a real visual.

#### P2-12 · Dark wrapper + light demo content is visually jarring
On `/saas`, `/tool`, `/ecommerce`, `/landing` the audit-dashboard chrome is dark (when in dark mode) but the inner mock-product content is light (operator dashboard, marketing landing, quote builder, storefront). The contrast feels accidental.

**Premium Psychology**: Cohesion check fails (the feeling is "two systems coexisting" not "one system in two surface modes").
**Fix:** Either (a) frame the demo deliberately as "light mode preview" with a styled chrome strip + label, or (b) provide a dark-mode variant of each demo and toggle them in tandem with the page theme.

---

### P3 — Polish

#### P3-13 · Carrier letter avatars overlap awkwardly in saas (mobile)
Avatar stack `D · J · A · R` letters are colored circles. On mobile they overlap badly in the cramped header.
**Fix:** Hide avatar stack below `md:` OR shrink avatar size + reduce overlap.

#### P3-14 · Mobile nav has no scroll affordance
Even after fixing P0-1 (overflow scroll), users won't know they can scroll horizontally without a fade-edge or chevron indicator.
**Fix:** Add right-edge gradient fade as visual affordance.

#### P3-15 · "+ New shipment" CTA in saas top bar lacks loading state
A primary action that submits a record should have a subtle loading state. Currently appears immediate.
**Fix:** Add `aria-busy="true"` + spinner on click in the demo (or document it as a loading-with-progress demo per the v0.9 deferred item).

#### P3-16 · Footer says "AUDIT PREVIEW" but live URL is the de-facto reference
Footer reads "LUMEN · WARP DESIGN SYSTEM · OBSIDIAN-MINT · V0.11.0 · AUDIT PREVIEW · github". The "AUDIT PREVIEW" label suggests this isn't the real site — but it IS the canonical demo. Either it should be removed or rebadged.
**Fix:** Replace "AUDIT PREVIEW" with "REFERENCE IMPLEMENTATION".

---

## Quick wins to ship in this session (in priority order)

1. **P0-1** mobile nav overflow scroll
2. **P0-4** lock dark mode default + persist user override
3. **P1-5** version-metadata redundancy reduction (header + breadcrumb)
4. **P1-6** right-rail sidebar grouping
5. **P2-10** route rename `/ecommerce` → `/commerce`
6. **P0-3** foundations hero — fill the empty card with a primitives showcase
7. **P3-16** footer "AUDIT PREVIEW" → "REFERENCE IMPLEMENTATION"
8. **P2-9** kill `text-[10px]` arbitrary class — add `text-micro: 10px` (or better, raise to 11/12)

Deferred to a focused mobile sprint:
- **P0-2** mobile reflow of all nested demos (~big refactor)
- **P3-13** avatar stack mobile fix
- **P3-14** scroll affordance gradients

Deferred to art direction:
- **P2-11** monoline product illustrations
- **P2-12** dark-mode variants of demo content
- **P1-7** chip-strip simplification
- **P1-8** type-scale audit

---

## What works (positives — don't change)

- **Spring Green discipline holds**: 56 accent-bg occurrences are dominantly demo elements (color swatches, live dots, success pills). No primary-text uses accent. Hard rule #7 is honored at the visual level.
- **Landing hero (`/landing`)** is genuinely premium — single dominant H1, clear primary CTA, halo-glow hover, brand chip live indicator.
- **SaaS dashboard demo (`/saas`)** is a real-product-quality mockup with sparklines, status pills, carrier logos, activity panel.
- **Mobile + Native Desktop demos (`/mobile` + `/desktop`)** ship platform-correct chrome — iOS Dynamic Island vs Android Material 3 vs macOS traffic lights vs Windows Mica.
- **Get-started CTA hover** on `/landing` shows a green halo glow ring around the button — a textbook Premium Psychology micro-interaction.
- **Tool quote builder (`/tool`)** is a real working demo with presets, live preview, multiple carrier rate cards. Rare to see this depth in a "design system showcase".
- **Single H1 per page**, semantic heading hierarchy, every interactive has a transition (some baseline of micro-interaction discipline).
- **Token coverage holds** for the load-bearing semantics: `--surface-page`, `--text-primary`, `--lumen-accent-4`, `--lumen-accent-fg`, `--surface-popover`, `--surface-overlay`, the full ramp of `--space-stack-*` and `--space-inset-*`.

---

## Audit artifacts

- `screenshots/dark-{route}-abovefold.png` (8) — the canonical mood
- `screenshots/dark-{route}-fullpage.png` (8) — full scroll
- `screenshots/desktop-{route}-abovefold.png` (8) — light, system-default
- `screenshots/desktop-{route}-fullpage.png` (8) — full scroll, light
- `screenshots/mobile-{route}-abovefold.png` (8)
- `screenshots/mobile-{route}-fullpage.png` (8)
- `screenshots/desktop-foundations-LIGHT-abovefold.png` — explicit light toggle test
- `screenshots/hover-landing-getstarted.png` — micro-interaction reference
- `audit-script.js` — the forensic JS audit (token discipline + hierarchy + violations)
- `capture.mjs` + `capture-dark.mjs` — Playwright capture scripts
