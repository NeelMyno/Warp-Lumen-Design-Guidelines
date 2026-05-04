---
name: First impression
type: foundation
version: 1.0.0
last_updated: 2026-05-04
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./hierarchy.md
  - ./typography.md
  - ./color.md
  - ./spacing.md
---

# Lumen First Impression

> A visitor decides whether your product feels professional in **50 milliseconds**. That snap judgment then colors every subsequent perception — the *halo effect*. The hero, above-the-fold, the first frame of the loading state, and the empty dashboard a new user lands on are the highest-leverage surfaces in the system. They are not decorated; they are **engineered**.

This foundation operationalizes [`principles.md`](./principles.md) §1 ("Engineer the first impression"). Read it before designing any hero, landing page, sign-in, app launch, or empty state.

> [!note]
> v0.11 — new foundation. The 50 ms halo-effect framing is grounded in Lindgaard et al. (2006) and Tractinsky et al. (2000) — visual attractiveness judgments form on first sight and persist; subsequent content is processed through that lens. Ignoring this is the single most common reason "well-built" sites still feel cheap.

---

## 1. The 50 ms contract

In the first viewport, before the user scrolls, your surface must answer three questions and pass three checks:

**Three questions answered (the *what / who / why* contract):**
1. **What does this do?** — explicit, unambiguous, no marketing fog.
2. **Who is it for?** — implied or stated; the audience recognizes themselves.
3. **Why does it matter now?** — the headline carries the value proposition, not the tagline.

**Three checks passed (the *halo* contract):**
1. **Branded chrome reads on first paint.** Typography (Satoshi), accent (Spring Green), hairlines, accent-glow on the primary CTA — all rendered before any user input.
2. **One dominant focal point.** No competing CTAs, no equal-weight noise. Per [`hierarchy.md`](./hierarchy.md) §1.
3. **No visible loading regression.** Skeleton states, font-fallback metrics, image dimensions — all locked so the layout never shifts.

If any of these six fail, the first impression fails — and per the halo effect, the rest of the experience is read through a lens of skepticism.

---

## 2. Hero anatomy (the canonical pattern)

Lumen heroes follow one of three patterns. Don't invent a fourth.

### Pattern A — Type-led hero (default for marketing)

```
┌─────────────────────────────────────────────┐
│  [eyebrow: 12px UPPERCASE, tertiary]        │
│                                              │
│  Headline runs across two lines, max         │
│  three. 56–96 px display.                    │
│                                              │
│  Subhead, capped at 65 ch, body-lead         │
│  preset, secondary text color.               │
│                                              │
│  [Primary CTA — Spring Green]   [Ghost CTA]  │
│                                              │
│  ─────────  trust strip / 11 px mono  ────── │
└─────────────────────────────────────────────┘
```

- **Eyebrow** (optional): 12 px uppercase tracked, `text.tertiary`. One word or short phrase that names the category.
- **Headline**: display preset 56–96 px, weight 600–700, `text.primary`, line-height 0.95–1.0. Max 3 lines.
- **Subhead**: body-lead 18–22 px, weight 400, `text.secondary`, max 65 ch.
- **Primary CTA**: Spring Green pill (`Button intent="primary" size="lg" glow`).
- **Secondary CTA** (optional): ghost or outline, never lime.
- **Trust strip** (optional): row of 4–7 logo marks, monochrome, 60% opacity, 32 px tall.

Vertical rhythm: `space.stack.xl` between eyebrow→headline, `space.stack.lg` between headline→subhead, `space.stack.xl` between subhead→CTAs, `space.section.lg` between CTAs→trust strip.

### Pattern B — Product-led hero

The product screenshot or live demo is the focal point. Headline shrinks to support.

- Headline at 32–48 px (still display, but smaller).
- Subhead capped at 50 ch.
- Single primary CTA.
- Product image: full bleed or floating, 60–70% of the hero height.

Use when the product itself is more compelling than any words could be — e.g., the audit dashboard, a working demo, a complex chart.

### Pattern C — Stat-led hero (operator-mode landing)

A monumental number does the work.

- Eyebrow (mandatory): "Live" or "Today" or category name.
- One enormous tabular figure (`Stat` component, 96–128 px display).
- One unit / context label below (12–14 px, secondary).
- Primary CTA below.
- Optional `LiveDot` adjacent to the number.

Use for operator-facing entry surfaces (dashboards, ops consoles) where credibility comes from real numbers, not promises.

---

## 3. Above-the-fold rules

The first viewport is sacred. The following are **not allowed** above the fold:

- **More than one primary CTA.** Per [`hierarchy.md`](./hierarchy.md) §1 and [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md): one Spring-Green pill, others ghost/outline.
- **Five+ trust badges.** Pick four to seven; pick one to amplify if any. Equal-weight rows of 8 logos read as cheap.
- **Animated background loops.** The aurora is allowed (it's atmosphere, not motion). Spinning gradients, marching ants, particle systems are not.
- **A cookie banner that obscures content.** Cookie banners ship at the bottom or in a slim top strip — never centered over the headline.
- **A modal on cold load.** No "subscribe to our newsletter" overlays before the user has even seen the page.
- **Stock photography.** Per [`04-content/imagery.md`](../04-content/imagery.md): no stock photos, ever. Product screenshots, documentary photos of real customers, monoline diagrams — anything else is a brand violation.
- **Body copy below 14 px.** First-paint copy is at least 16 px so it reads on a phone without zoom.

---

## 4. Skeleton & loading first-impressions

The skeleton state is part of the first impression. Treat it like a real screen, not a placeholder.

- **No spinner-only loading.** Skeleton bars match the eventual content's shape (heading width, CTA pill, image aspect).
- **Match real layout dimensions.** Don't use a generic 200×40 placeholder for a 56 px headline — the page will jolt when content arrives.
- **Use `surface.sunken` (not a separate skeleton color).** A muted version of the actual surface palette reads quietly, premium.
- **No skeletons longer than 600 ms.** If real content can't arrive in 600 ms, ship a skeleton with optimistic placeholder text instead (e.g., the headline can load instantly; only the live numbers wait).
- **Honor `prefers-reduced-motion`.** The shimmer animation degrades to a static muted bar.

---

## 5. Empty-state first-impressions

A new user opening a fresh dashboard sees an empty state. Treat it like a hero.

- **One bold piece of guidance.** What is the *one* thing they should do first?
- **No "you have no data yet" without a CTA.** Empty without action is a dead end.
- **A monoline diagram or an embedded preview.** Show what the populated state will look like — never a generic "empty inbox" illustration.
- **Match the eventual populated layout.** When data arrives, the layout shouldn't reshape. The skeleton is the populated state with placeholders.

See [`04-content/empty-states.md`](../04-content/empty-states.md) for the full empty-state catalog.

---

## 6. The cold-load contract (technical)

The 50 ms judgment requires the technical pipeline to deliver a polished first paint. Lumen ships these guarantees out of the box; consumers must preserve them.

- **Metric-aligned font fallback.** Satoshi swaps in over an Arial fallback that occupies the exact same box (CLS ≈ 0). See [`audit-dashboard/src/app/globals.css`](../../audit-dashboard/src/app/globals.css) `@font-face Satoshi-Fallback`.
- **Inline critical CSS** for the hero's first paint — token resolutions for `--surface-page`, `--text-primary`, `--accent-500`, `--font-sans`.
- **No layout shift on image load.** Images ship with `width` + `height` attributes (or aspect-ratio CSS) so reserved space matches.
- **No flash of unstyled content (FOUC).** Tailwind v4's `@theme` block + `:root` token block load before any component renders.
- **No flash of unthemed content.** The `data-theme="dark"` attribute is set on `<html>` server-side based on user preference — not in a hydration step.
- **Above-the-fold images use `priority`** (Next.js) or `<link rel="preload">` for native HTML.
- **Above-the-fold fonts use `font-display: swap`** with metric-aligned fallback (already configured in v0.5+).

If a consumer breaks any of these in their integration, the 50 ms contract fails — even though Lumen rendered everything correctly.

---

## 7. The halo audit — before any landing ships

Before any landing page, sign-in, or first-load surface ships, sit it next to a Lumen reference (audit-dashboard `/landing` or `/foundations`) and audit:

- [ ] In the first 50 ms (eyes-closed-then-open test), what is the dominant element?
- [ ] Does the dominant element answer the *what / who / why* contract?
- [ ] Is there exactly one primary CTA in Spring Green?
- [ ] Does typography read as Satoshi (or its metric-aligned fallback) immediately?
- [ ] Does the accent-glow render on the primary CTA on first paint?
- [ ] Are there fewer than 4 distinct elements in the first viewport (excluding navigation)?
- [ ] Is there visible white space around the headline and CTA — at least `space.section.md` (48 px) on every side?
- [ ] If the user scrolls 1 line, does the next focal point reveal *one* clear next action?
- [ ] Is the page legible at 200% zoom and 320 px width?
- [ ] Does the page render correctly with `prefers-reduced-motion: reduce`?
- [ ] Does the cold-load CLS score < 0.05 in Lighthouse?
- [ ] Does the cold-load LCP < 2.5 s on a slow 3G simulation?

If any check fails, the first impression fails. Per the halo effect, **fixing this is more leveraged than any other UX improvement**.

---

## 8. Cross-references

- [`principles.md`](./principles.md) §1 — *Engineer the first impression*
- [`hierarchy.md`](./hierarchy.md) — single focal point per section
- [`typography.md`](./typography.md) — display preset, metric-aligned fallback
- [`color.md`](./color.md) — accent-glow, surface tiers, cold-load token resolution
- [`spacing.md`](./spacing.md) — section breaks, container widths, hero rhythm
- [`02-components/button/component.md`](../02-components/button/component.md) — primary CTA glow recipe
- [`02-components/live-dot/component.md`](../02-components/live-dot/component.md) — for stat-led heroes
- [`04-content/imagery.md`](../04-content/imagery.md) — what counts as premium photography
- [`04-content/empty-states.md`](../04-content/empty-states.md) — empty-state hero anatomy
- Lindgaard et al. (2006), *Attention web designers: You have 50 milliseconds to make a good first impression*
- Tractinsky et al. (2000), *What is beautiful is usable*
