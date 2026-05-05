# marketing-landing — the canonical Warp public surface

> The shape of every Warp landing, product, pricing, and about page. Type-led hero on `surface.canvas`, screenshot-as-proof, live rate ticker, monoline customer logos, three pricing cards, an honest FAQ. Apple-disciplined chrome on Warp-substantive content. Reference implementation: [`audit-dashboard/src/app/landing/page.tsx`](../../audit-dashboard/src/app/landing/page.tsx).

This pattern is the contract for the surfaces the public meets first. It compresses the [`first-impression.md`](../00-foundations/first-impression.md) 50 ms halo, [`hierarchy.md`](../00-foundations/hierarchy.md) single-focal-point rule, and [`density.md`](../00-foundations/density.md) marketing tier into one composable shape. If you're building a landing page that isn't this shape, you're either building a different pattern (operator dashboard, web tool, settings) or you're drifting — and drift is the most common reason a "well-built" Lumen site still doesn't feel like Warp.

---

## 1. The shape

```
MarketingLanding
├── HeroSection                          ← the 50 ms surface
│   ├── EyebrowLine                      → lumen-mono-cap, lumen-dot-pulse + status sentence
│   ├── DisplayHeading                   → text-display-2xl, max 3 lines, italic accent on one word
│   ├── LeadParagraph                    → text-lead, max 60ch, text-secondary
│   ├── CTAGroup
│   │   ├── Button intent=primary size=xl pill glow      → THE focal point
│   │   └── Button intent=secondary size=xl pill          → ghost weight, never lime
│   └── TerminalProof                    → mono pill with $-prompt + LiveDot (optional)
│
├── RateTicker                           ← live data, full-bleed, 24px tall
│
├── TrustStrip                           ← 4–6 wordmarks, monoline, 60% opacity
│   └── lumen-eyebrow + horizontal logo row
│
├── StatBand                             ← 4 Stat (size=xl) on surface.sunken
│   └── StatGrid cols=4 divided, each Stat with sparkData + delta + polarity
│
├── FeaturesGrid                         ← 3 Card columns
│   └── icon tile + heading-h3 + body-md description
│
├── PricingSection                       ← 3 PricingCard
│   ├── Starter         → outline border
│   ├── Operator        → highlighted, accent border, intent=primary CTA
│   └── Enterprise      → outline border
│
├── TestimonialBand                      ← single quote, oversized accent quotemark
│   └── 96px ldquo glyph at 18% opacity + heading-h1 quote + Avatar attribution
│
├── FAQSection                           ← native <details>, ≤ 8 items
│   └── divided list, label-lg summary + body-md answer
│
├── CTABand                              ← inverted surface (light-mode flip is OK), full-bleed
│   └── lumen-mono-cap + display-2xl headline + Button primary xl pill glow
│
└── Footer                               ← inverted surface, 4-column nav + brand block
    ├── BrandBlock      → wordmark + 40ch tagline + LiveDot "API healthy"
    └── NavColumns      → Product / Network / Company / Legal
```

The shape is rigid. Sections may be removed (a product page with no pricing) or duplicated (a pricing page with three CTAs) — but the order is the order, because each section answers a question the previous one raised. Don't reorder without a reason in the PR.

---

## 2. Density mode

**Marketing density.** Section rhythm is `space.section.hero` (96px) between hero and the next band, and `space.section.xl` (80px) between every subsequent band. This is the breathes-not-dense tier from [`density.md`](../00-foundations/density.md) §2 and the `comfortable` mode from §5. Every control on a marketing surface is ≥ 48 px (`size.control.lg` for body CTAs, `size.control.xl`/56 px for the hero CTA).

**Why marketing density on marketing surfaces.** The visitor isn't scanning 200 rows of freight at 9 AM — they're forming a halo judgment in 50 ms. Whitespace is a primary design element here (principle 1). A 24 px section gap on a marketing page reads as "ops console" — wrong density mode, broken first impression. Conversely, a 96 px section gap on a dashboard reads as "Squarespace template" — same mistake, opposite direction.

**The one exception** — operator-mode landings (a `/changelog`, a `/status`, a `/api`) lean toward `comfortable` but lift the rate ticker, KPI band, and tabular numerics from the operator tier. Don't go full operator on a marketing surface; do borrow the live-data primitives (`Stat`, `LiveDot`, `RateTicker`) — they're the credibility layer.

---

## 3. Tokens for wrappers

Wrappers are the page's skeleton. Pick from `space.section.*`, `space.page.*`, and `space.inset.*` — not from primitives, not from arbitrary Tailwind values.

| Wrapper | Token | Pixels | Notes |
|---|---|---|---|
| Hero top padding | `space.24` | 96 | Above the fold breathes; nothing competes with the headline. |
| Hero bottom padding | `space.20` | 80 | Slightly less than top — the eye continues down. |
| Section vertical padding | `space.section.xl` | 80 | Standard band-to-band rhythm on marketing. |
| Hero-to-next-band | `space.section.hero` | 96 | Only between hero and first band. |
| Page horizontal padding | `space.10` | 40 | `px-10` on the outer shell; matches `audit-dashboard/src/app/landing/page.tsx`. |
| Container max-width | `size.container.default` | 1100 | `max-w-default`. Wide hero blocks can use `size.container.wide` (1200). |
| Card inset (feature, pricing) | `space.inset.lg` | 24 | Card's `padding="lg"` resolves to this. |
| Hero stack rhythm (eyebrow → headline → lead → CTA) | `gap-7` (28 px) | 28 | Tight enough to read as one composition, wide enough to honor the type hierarchy. |
| CTA group inline gap | `gap-3` (12 px) | 12 | Primary + secondary CTA shoulder-to-shoulder, not jammed. |
| Stat band internal padding | `py-section-xl` | 80 | Same as other sections; the band is just another section visually. |
| Trust strip vertical padding | `py-section-xl` | 80 | Logos breathe; squashed logo strips read as cheap. |
| Footer vertical padding | `space.12` | 48 | Footers are quieter than bands; `48` matches dashboard chrome. |

The horizontal `px-10` is non-negotiable on this pattern. Reducing it to 24 (operator) or 32 makes the page feel like a sub-section of an app shell, not a public surface.

---

## 4. Component recipe

Every box in the tree resolves to a Lumen primitive or a small wrapper around one. **No bespoke components** unless the foundation requires it.

### Hero

| Role | Component | Variant | Why |
|---|---|---|---|
| Eyebrow | plain `<div>` with `lumen-mono-cap` + `lumen-dot-pulse` | — | Eyebrow is type-driven; no chrome. The dot pulse is the heartbeat — `text-accent` color, 1px live signal. |
| Headline | `<h1>` with `text-display-2xl` (96 px) | `display.2xl` | Max 3 lines. One word can take an italic-not-italic `text-accent` override (the "builders" treatment in the audit reference) — that's the principal typographic flourish allowed on hero. |
| Lead | `<p>` with `text-lead` | `body.lead` (18–22 px) | Capped at 60ch via `max-w-[60ch]`. `text-secondary`. No marketing fog. |
| Primary CTA | `Button` | `intent="primary" size="xl" pill glow` | The `glow` prop adds the `.lumen-glow-cta` halo (per [`first-impression.md`](../00-foundations/first-impression.md) §2). Without it, a 96 px display headline outweighs the CTA and the focal point flattens. |
| Secondary CTA | `Button` | `intent="secondary" size="xl" pill` | Ghost weight. Never primary. Two lime CTAs side by side breaks principle 2 (single focal point). |
| Terminal proof (optional) | inline `<div>` with `lumen-mono` + `LiveDot` | — | A single-line `$ npx warp quote` pill underneath the CTAs is the canonical Warp move. Reads as "this thing actually exists." |
| Reveal entrance | `<ScrollReveal>` per child, staggered 80ms | — | Per audit reference: each focal child wraps its own ScrollReveal so the eye is led in. Above-the-fold reveals fire on first frame. |

### Trust strip

| Role | Component | Variant | Why |
|---|---|---|---|
| Eyebrow | `<div className="lumen-eyebrow">` | — | "Trusted by operators at" or similar — the *purpose* of the strip, not a marketing tagline. |
| Logos | plain `<div>` rows of wordmarks | `text-body-lg font-bold tracking-tight` | Wordmarks rendered as type, not raster logos. Static, not interactive (the audit reference dropped the `cursor-default + hover:` pair in v0.11.13 — these are showcase, not pressable). |
| Count | 4–6 wordmarks | — | Five+ trust badges of equal size is a [hierarchy anti-pattern](../00-foundations/hierarchy.md) §5. Pick four to seven; pick *one* to amplify if any. |

### Stat band

| Role | Component | Variant | Why |
|---|---|---|---|
| Container | plain `<section>` on `bg-surface-sunken` with `py-section-xl` border-y hairline | — | The sunken surface signals "data layer" — the band reads as evidence between marketing claims. |
| Grid | `<StatGrid cols={4} divided>` | — | The `divided` prop paints the hairline column rules. |
| Number | `<Stat>` | `size="xl"`, `sparkData={[…]}`, `trend`, `delta`, `polarity` (when needed) | xl (61 px) not hero (76 px) — the spark + delta pill needs breathing room. v0.11.12 wired `sparkData` to drive the live endpoint pulse — every stat ships one. |

### Features grid

| Role | Component | Variant | Why |
|---|---|---|---|
| Section header | plain `<header>` with eyebrow + heading-h2 | `display.md`/`display.lg` | Eyebrow + headline only — no subhead. The grid below carries the detail. |
| Feature card | `<Card>` | `padding="lg"` | 24 px inset, hairline border, default elevation. |
| Icon tile | inline `<div>` | `h-11 w-11`, `surface.tint.accent`, `text-accent` icon | The 44×44 tile is the second-tier visual anchor inside each card — keeps the icon from competing with the title. |
| Title | plain `<div>` | `text-heading-h3` | One line; ≤ 7 words. |
| Body | plain `<p>` | `text-body-md text-secondary` | Two lines max. The grid is for *promise*, not *spec sheet*. |

### Pricing

| Role | Component | Variant | Why |
|---|---|---|---|
| Card | `<Card>` | `padding="lg"`, `elevation="lifted"` on the highlighted tier | Highlighted tier ships `!border-accent` to break out without adding a second loud color. |
| Price | plain `<div>` | `text-display-lg lumen-tnum` | Tabular figures align across the three columns. |
| Highlight badge | `<Badge>` | `status="accent" leadingDot` | Only on the recommended tier. |
| Feature list | `<ul>` of `<li>` with `Check` icon + body-sm | — | Body text, not display. The price is the focal point per [hierarchy.md](../00-foundations/hierarchy.md) §4. |
| Card CTA | `<Button>` | `intent="primary"` on highlighted, `intent="secondary"` on others, `fullWidth` | Only the recommended tier ships in lime. |

**Three is the maximum.** Five-column pricing tables fail the 5-second comprehension test — the eye can't compare five prices and pick. If you have five plans, group them; if you have three, the middle is primary.

### FAQ

| Role | Component | Variant | Why |
|---|---|---|---|
| Container | plain `<div>` with `border-hairline`, `surface.raised`, `divide-y` | — | Hairline divider between items; no card-per-question (that's the wall-of-cards anti-pattern). |
| Item | native `<details>` / `<summary>` styled with `group-open:rotate-180` chevron | — | Native browser disclosure — no custom JavaScript, no aria gymnastics, animation comes free. |
| Question | inside `<summary>` | `text-label-lg` | Label-lg, not heading — these aren't section headers. |
| Answer | inside `<details>` | `text-body-md text-secondary` | Body. |
| Count | ≤ 8 | — | Eight is the comfortable upper bound. If you have more, the page has a structure problem, not a content problem. |

### CTA band + footer

| Role | Component | Variant | Why |
|---|---|---|---|
| CTA band background | plain `<section>` on `surface.inverse` | — | Inverted surface = light-mode preview. Reads as a deliberate flip ("here's the same surface in light mode"), not jarring. Optional. |
| CTA headline | `<h2>` | `text-display-2xl` | Same scale as hero; the band is a re-statement of the hero's ask. |
| CTA button | `<Button>` | `intent="primary" size="xl" pill glow` | Same recipe as hero — the page is a sandwich, hero and footer-CTA are the bread. |
| Footer | plain `<footer>` on `surface.inverse` | — | 4-column grid: brand block + 3 nav columns. |
| Footer brand block | wordmark + tagline + `<LiveDot label="API healthy" />` | — | The live dot under "API healthy" is the canonical Warp footer move — operator confidence in marketing chrome. |

---

## 5. Anti-patterns

The wrong-feeling compositions to avoid. Most of these are LLM-default mistakes — equal-weight noise, drift toward stock SaaS templates, motion choices borrowed from app onboarding.

- **Two primary CTAs in the hero.** The most common violation. "Get started" + "Talk to sales" both in lime breaks principle 2 (single focal point) and ADR 0005 (single accent). One primary, one ghost. Always.

- **A second loud color.** Purple secondary, orange tertiary, blue link underline. The accent is one color (Spring Green) — every other accent must be neutral or status. ADR 0005 + 0018 are non-negotiable.

- **Stock photography or AI-generated heroes.** Per [`04-content/imagery.md`](../04-content/imagery.md): no stock photos, ever. Product screenshots first, documentary photography of real customers second, monoline diagrams third. A generic "person on laptop" hero is a brand violation — the visitor reads it as "this is a template."

- **Operator density on a marketing page.** 24 px section rhythm on a landing page reads as "ops dashboard" — wrong density mode. Use `space.section.hero` (96 px) between hero and the next band, `space.section.xl` (80 px) thereafter.

- **A hero that doesn't answer who/what/why in 50 ms.** Open in private browsing, hard-refresh, screenshot at the 50 ms mark. If the dominant element doesn't answer "what is this," "who is it for," and "why now," the first impression failed and per the halo effect the rest of the page is read through skepticism. See [`first-impression.md`](../00-foundations/first-impression.md) §1.

- **Pricing card with 5+ columns.** The eye can't scan five prices and pick. Three is the max. If your business model demands five, group them ("Self-serve / Team / Enterprise") and keep three visible columns.

- **Bouncy hero entrance animation.** Lumen decelerates. `cubic-bezier(0.2, 0, 0, 1)` is the standard easing. Spring overshoot is reserved for exceptional moments and is never default — the hero is the *most* default surface in the system, so absolutely no bounce.

- **Equal-weight headline and subhead.** A 36 px H2 next to a 32 px subhead is noise, not hierarchy. Headlines are 1.5–2× the visual weight of the subhead per [`hierarchy.md`](../00-foundations/hierarchy.md) §1.

- **A wall of cards in features.** Six identical feature cards with no amplification reads as cheap. Pick three; if you have six features, the page has a scope problem. Per `hierarchy.md` §5: pick one to amplify (size, accent, position) so the eye lands somewhere.

- **A cookie banner over the headline.** Cookie banners ship at the bottom or in a slim top strip — never centered over the hero. Same rule for "subscribe to our newsletter" modals on cold load. The first viewport is sacred per `first-impression.md` §3.

- **Decorative gradient backgrounds.** The aurora is allowed (it's atmosphere, not motion). Spinning gradients, marching ants, particle systems are not. Per principle 3 (single disciplined accent), gradients break the hierarchy contract.

- **A trust strip with 8+ logos at equal size.** Equal-weight rows of 8 logos read as cheap (per `first-impression.md` §3). Pick four to seven; if you have a flagship, render it larger.

- **Body copy below 14 px on first paint.** First-paint copy is at least 16 px so it reads on a phone without zoom. Body floor is 12 px (kbd / overline only) per [`typography.md`](../00-foundations/typography.md) §6.

- **Skeletons that don't match real layout.** A generic 200×40 placeholder for a 96 px headline jolts the page when content arrives. Match real dimensions; use `surface.sunken`; honor `prefers-reduced-motion`. See `first-impression.md` §4.

- **Hero stat without `polarity` on a "good-down" metric.** If your hero stat is a cost, latency, or error rate, ship `polarity="good-down"` so the trend pill and sparkline read green when the number falls. The default is `good-up`. v0.11.12 fix on the SaaS dashboard caught this same bug — it applies here too.

- **A FAQ disclosure in a card-per-question grid.** Cards-in-cards bloats space and breaks the "the type can do the work" rule from `hierarchy.md` §6. One container with hairline dividers; let the type carry the structure.

---

## 6. Working reference

[`audit-dashboard/src/app/landing/page.tsx`](../../audit-dashboard/src/app/landing/page.tsx) is the end-to-end web implementation.

It exercises every primitive in this pattern: `Button` (intent=primary/secondary, size=xl, pill, glow), `LiveDot`, `RateTicker`, `Stat` (size=xl, sparkData, polarity), `StatGrid` (cols=4, divided), `Card` (padding=lg, elevation=lifted), `Badge` (status=accent, leadingDot), `Avatar`, `ScrollReveal` (staggered hero entrance), and the `lumen-eyebrow` / `lumen-mono-cap` / `lumen-dot-pulse` / `lumen-glow-cta` utility classes.

Cross-reference foundations:

- [`first-impression.md`](../00-foundations/first-impression.md) — the 50 ms halo contract, hero anatomy patterns A/B/C, the cold-load contract.
- [`hierarchy.md`](../00-foundations/hierarchy.md) — single focal point, the 1.5–2× rule, per-surface patterns including hero and pricing.
- [`density.md`](../00-foundations/density.md) — comfortable as the marketing default; when it's OK to lean toward operator.
- [`spacing.md`](../00-foundations/spacing.md) — `space.section.*` ladder, container widths, hero rhythm.
- [`color.md`](../00-foundations/color.md) — the four-color floor, accent-glow on the primary CTA.
- [`elevation.md`](../00-foundations/elevation.md) — hairline borders + accent-glow as the Warp signature.
- [`02-components/button/component.md`](../02-components/button/component.md) — primary CTA glow recipe.
- [`02-components/stat/component.md`](../02-components/stat/component.md) — `sparkData` API and polarity rules.
- [`04-content/imagery.md`](../04-content/imagery.md) — what counts as premium photography.

When in doubt about how to compose this pattern on web, run the audit dashboard locally (`cd audit-dashboard && pnpm dev`) and open `/landing` next to whatever you're building. If the section weights, density, and motion don't match — the audit reference wins.
