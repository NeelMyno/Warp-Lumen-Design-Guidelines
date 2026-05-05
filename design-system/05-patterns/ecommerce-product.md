# ecommerce-product.md — the e-commerce product detail page pattern

> Three runtimes — Shopify Liquid, BigCommerce Stencil, WooCommerce — and one shape. The product detail page is where storefronts live or die: every commerce platform measures conversion against this surface, and every operator-direct decision in Lumen's voice gets stress-tested by a buyer who's about to spend money. The pattern below is the canonical composition; the runtimes differ only in templating syntax.

This is also the pattern that proves Lumen's two-density-mode-isn't-enough thesis — the buy section needs operator density (compact, scannable, decisive), the marketing density on the rest of the page would push the buy button below the fold. The answer is **breathes-but-dense**: marketing breathing in the hero, operator compaction in the buy panel and the long tail.

## 1. The shape

```
ProductPage
  ├── Breadcrumb              → lumen-eyebrow style, text-tertiary
  │
  ├── Two-column grid         → 1fr 480px on desktop · single-column < 768px
  │   │
  │   ├── LEFT (1fr)
  │   │   └── ProductGallery
  │   │       ├── MainImage   → 1:1 aspect, border.hairline, pinch-to-zoom on mobile
  │   │       └── Thumbnails  → 64×64 grid, IconButton.surface=ghost — active = lumen-btn-selected
  │   │
  │   └── RIGHT (480px)
  │       └── BuyPanel
  │           ├── ProductTitle      → type.heading.h1
  │           ├── PriceBlock        → Stat (size=xl) + savings badge if discounted
  │           ├── RatingSummary     → stars + count, links to reviews
  │           ├── ShortDescription  → body.md, 2–3 lines, truncate w/ read-more
  │           ├── VariantPicker     → Segmented (2–4 options) · Select (5+) · RadioGroup (a11y-critical)
  │           ├── QuantityInput     → NumberInput w/ stepper
  │           ├── BuyButton         → Button.primary.lg, full-width, loading + success states
  │           ├── SecondaryActions  → Button.outline ("wishlist") + IconButton ("share")
  │           └── TrustSignals      → 3 inline icons + body.sm — shipping ETA + return + warranty
  │
  ├── Tabs                    → Description / Specs / Reviews / Shipping
  │
  ├── ReviewsSection
  │   ├── RatingsHistogram    → Bar chart, sentiment-aware tint per v0.11.12
  │   └── ReviewList          → cards with helpful counts
  │
  ├── RelatedGrid             → ProductCard grid · 4 cols desktop / 2 mobile
  │
  ├── RecentlyViewed          → optional second grid
  │
  └── Footer                  → per platform — Shopify section/snippet · Stencil theme footer · Woo widget area
```

The two-column grid is **fixed-width buy panel, fluid gallery** — gallery takes whatever width the viewport gives it, buy panel stays a stable 480px on desktop. Below 768px the layout collapses to single-column: gallery first (full-width), buy panel below. On mobile the BuyButton becomes sticky at the bottom of the viewport (per the mobile-primary pattern's sticky bottom bar) so it never falls below the fold.

## 2. Density mode — breathes-but-dense

Marketing breathes; operator stays dense. A product page is **both** — the hero (gallery + buy panel) is marketing-density (the product is the focal point of the section, the buy decision is the act it sets up), but the spec / review / related sections are operator-density (compact, scannable, decisive). Trying to ship marketing density across the whole page collapses conversion: the buy button gets pushed below the fold, the spec table starts looking like a marketing spec ad, and the reviews read as a brand statement instead of evidence.

So the discipline:

| Region | Density | Section rhythm |
|---|---|---|
| Breadcrumb | operator | `space.section.dense` (24px) above hero |
| Hero (gallery + buy panel) | marketing-but-dense | `space.section.md` (48px) below hero on desktop, `.sm` (32px) on mobile |
| Tabs / Specs / Reviews / Related | operator | `space.section.lg` (64px) between major sections; row gap inside = `space.stack.md` (16px) |
| Footer | per-platform | platform's footer rhythm wins |

The buy panel is dense by necessity. The 480px width is what fits a `Button.primary.lg`, a `Stat.xl`, a `VariantPicker`, a `QuantityInput`, and the trust signals **without scroll** on a 1024×768 viewport. Wider than 480px and the gallery starts looking small; narrower and the BuyButton wraps. The number is non-arbitrary.

## 3. Tokens for wrappers

| Wrapper | Token / value | Notes |
|---|---|---|
| Page padding-x (desktop) | `space.page.lg` (32px) | wider page than dashboards — gallery wants room |
| Page padding-x (mobile) | `space.page.md` (24px) | matches mobile-primary content gutter |
| Two-column gap | `space.section.md` (48px) | gallery vs buy panel — wide enough to read as two regions |
| Section break (desktop) | `space.section.lg` (64px) | hero → tabs, tabs → reviews, etc. |
| Section break (mobile) | `space.section.md` (48px) | tightened so the buy CTA stays close to context |
| BuyPanel internal v-rhythm | `space.stack.md` (16px) | between blocks (title → price → rating) |
| BuyPanel major group gap | `space.stack.lg` (24px) | between major groups (variant picker → buy button) |
| ProductCard radius | `radius.lg` (12px) | the v0.8 default card radius — works at related-grid scale |
| Gallery main image radius | `radius.lg` (12px) | matches related-card radius for visual rhyme |
| Gallery aspect ratio | 1 : 1 (square) | works across product categories — apparel, hardware, food |
| Thumbnail size | 64×64 | enough to read the image, small enough to fit 4–6 in a row below the main |
| Tab content padding | `space.inset.lg` (24px) | comfortable reading inside the tab panel |
| RatingsHistogram bar gap | `space.2` (8px) | dense — histograms read better tight |

The 1:1 gallery aspect ratio is the universal answer for product photography. Portrait (3:4) reads as fashion-only; landscape (4:3) reads as hardware-only; square works everywhere and crops gracefully to thumbnails. If a product category demands a different ratio (e.g., 16:9 for TVs), override at the section level — never globally.

## 4. Component recipe

**ProductGallery.** Main image surface uses `border.hairline` on a 1:1 aspect, `radius.lg`. Thumbnails as `IconButton.surface=ghost` arrayed in a 4–6-wide row beneath. Active thumbnail uses `.lumen-btn-selected` (the v0.9 selected-state utility) with an accent border — single-accent contract, the green is signaling current selection. On mobile, swap thumbnails for a horizontal scroll of dots beneath the main image (Apple's pattern), and enable pinch-to-zoom on the main image per [`motion.md` § Mobile gestures](../04-content/motion.md). **Do not** carousel; carousels hide content and reduce scan rate.

**ProductTitle.** `type.heading.h1` — 31px Satoshi Bold. One line preferred; two lines if the SKU demands it. **Don't** stack a marketing tagline above the title; the breadcrumb already locates the product, the title is the answer.

**PriceBlock.** Composition: `Stat` at `size=xl` for the price (the metric.xl ramp — 61px Satoshi Bold with `tnum` + `lnum`), with a savings badge as success-tinted delta if discounted. Strikethrough the original price in `text-tertiary` `body.md tabular`. **Pricing transparency is non-negotiable** — the price is above the fold, before the variant picker, before the buy button. Hiding it behind "Add to cart" is an anti-pattern that breaks operator-direct voice ("we'll show you the price after you commit" is the opposite of decisive).

**RatingSummary.** 5 stars (filled at the average rating, half-stars allowed) + the rating value (`type.body.md tabular`) + the review count, linking to the Reviews tab/section. Spring green is reserved for accent / live / success — **stars are not green**; they're a warm-amber `color.status.warning.500` (`#F5B118`) which keeps the ratings warm and reserved.

**ShortDescription.** `type.body.md` in `text-primary`, 2–3 lines, truncate with a "Read more" link that scrolls to the Description tab. The full description lives in the Tabs section; the short version is the elevator pitch.

**VariantPicker.** Three composition rules by option count:

- **2–4 options:** `Segmented` — color swatches as button content (with the swatch as the icon), size labels as text. Active variant = `lumen-btn-selected`.
- **5+ options:** `Select` — opens a popover. Don't keep 12 size buttons in a row; it stops being scannable past 4–5.
- **A11y-critical (size with availability info, e.g., "Size 9 — out of stock"):** `RadioGroup` with availability info inline. Screen-reader-friendly, keyboard-navigable, status-aware.

**QuantityInput.** `NumberInput` with stepper. Default value 1, minimum 1, maximum from inventory. Both consumers and operators use this; **never omit it** in favor of a "Buy 1" button — even consumers occasionally buy in bulk.

**BuyButton.** `Button.primary.lg`, full-width within the BuyPanel (480px wide). Loading state = "Adding to cart..." with the v0.10 inline spinner; success state = "Added · View cart" for 1.6s, then resets. The success state is a peak-end moment — spend the motion / micro-interaction budget here, not on idle decoration.

**SecondaryActions.** "Add to wishlist" as `Button.outline` (medium intent, the secondary action), "Share" as `IconButton.surface=ghost` (tertiary, less frequent). Inline below the BuyButton on desktop, stacked above the trust signals on mobile.

**TrustSignals.** Row of three inline icons + `body.sm` — shipping ETA, return policy, warranty. **Never use a Card per signal**; that's too much chrome for a one-line trust signal. The icons are 16×16 from the system iconography, single-color in `text-secondary`.

**Tabs.** Native tabbed interface (the `Tabs` primitive) on desktop, anchor links to scroll-target sections on mobile (the platform pattern — Apple's product pages, Shopify Dawn, BigCommerce Cornerstone all do this). Tab labels: Description / Specs / Reviews / Shipping. Each panel padded with `space.inset.lg`.

**ReviewsSection — Ratings histogram.** `Bar` chart with **sentiment-aware tint per v0.11.12** — 5★ tints toward spring green, 4★ mid-accent, 3★ neutral `text-secondary`, 2★ amber `color.status.warning.500`, 1★ red `color.status.danger.500`. The ramp signals at-a-glance whether reviews skew positive without forcing the user to read every bar value.

**ReviewList.** Each review is a `Card.bordered` (`border.hairline`, no shadow — reviews are evidence, not marketing) with: author, star rating, date, body, helpful count, "helpful" / "not helpful" `IconButton.surface=ghost`. **Default sort: best-by-default** (highest helpful count first), **with a sort menu that lets users switch to recent / lowest / highest.** Recent-only as the default is an anti-pattern (see § 5).

**Related grid — ProductCard.** `Card` with image (1:1, `radius.lg`), title (`heading.h5`), price (`Stat.sm`), rating (compact 5-star + count). Four columns on desktop, two on mobile, responsive between. Hover = `shadow.lifted` + `transform: translateY(-1px)` per the standard card-interactive recipe in `motion.md`.

## 5. Anti-patterns

The LLM-generated mistakes that look like product pages but don't convert.

- **Pure-marketing density across the entire product page.** The buy section is dense by necessity. Too much breathing room pushes the buy button below the fold and breaks scan order. Marketing-but-dense in the hero, operator-dense everywhere else.

- **Carousel for primary product image.** Carousels hide content; a thumbnail row + main image gives users a scannable overview of every image at once. Reserve carousels for tertiary content (related products, reviews) where hiding behind interaction is acceptable.

- **VariantPicker as buttons in a row when there are 12+ options.** Past 4–5 segmented buttons, scanning collapses. Switch to `Select`. The `Segmented` density was tuned for 2–4 options.

- **Buy button with no QuantityInput.** Operators expect a quantity stepper; consumers also use it occasionally (gifts, multi-pack purchases). Omitting it forces the consumer back to the cart to change quantity — a friction point that costs conversions.

- **Hiding price behind "Add to cart" or "Show price."** Pricing transparency is non-negotiable. The price is above the fold, before the variant picker. The consumer's cost is part of the buy decision, not a post-commit reveal.

- **Modal for the size guide.** Size guide is reference content the user wants to compare against the page — modals trap focus, force the user to dismiss to look back at the title or price, and break the back gesture on mobile. Use a `Drawer` (right-anchored) or a separate page.

- **Reviews sorted by recent only.** Best-by-default is the operator-direct pattern: the most-helpful reviews surface evidence first. Let users sort by recent if they want; don't make recent the only sort.

- **Stock photography or AI-generated product imagery.** Per [`imagery.md`](../04-content/imagery.md): real product photos only. A consumer noticing a stock-photo product image is a trust violation — they're now wondering whether the actual product matches the stock image.

- **Aggressive scarcity messaging that isn't true.** "Only 3 left!" without it being true breaks the operator-direct voice (the voice doesn't lie). If scarcity is real and informational, surface it factually: "3 in stock" in `body.sm` near the variant picker, no exclamation point, no countdown timer.

- **"You might also like" related grid that's the same product in different colors.** Recommendations should be different products, not variants of the current one. The user already has the variant picker; the related grid is for cross-sell, not re-display.

- **Auto-add upsells to cart.** Consumers should opt in, not opt out. Auto-adding a warranty or accessory to the cart at the buy step is a dark pattern that breaks trust and triggers chargebacks. Show the upsell, let the user choose.

- **TrustSignals as a row of full Cards.** Too much chrome for a one-line signal. Three inline icons + `body.sm` is the right density.

- **A different typeface for the price.** Per the Satoshi-only contract (ADR 0017), pricing uses `Stat` at `metric.xl` with `tnum` + `lnum` OpenType features. **Don't reach for JetBrains Mono or any other monospace** — Satoshi's tabular numerics are designed exactly for this.

- **`text-white` on the BuyButton's spring-green surface.** ~1.4:1 contrast — WCAG fail. Use `.lumen-btn-primary` (which composes `accent.fg` `#07120D` statically at 14.7:1 AAA) or direct `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]`. Never `bg-primary text-primary-foreground` — the Tailwind v4 content scanner has been observed to drop those bridge utilities (this is the v0.11.13.4 fix).

## 6. Working reference

`audit-dashboard/src/app/commerce/page.tsx` — the canonical web reference for this pattern, exercising the gallery + buy panel + tabs + reviews + related grid composition end to end.

For the platform-specific consumption notes:

- Shopify Liquid: [`03-platforms/shopify-liquid/README.md`](../03-platforms/shopify-liquid/README.md) — section/snippet partials, Theme Editor settings for variant picker, the storefront-vs-checkout split.
- BigCommerce Stencil: [`03-platforms/bigcommerce-stencil/README.md`](../03-platforms/bigcommerce-stencil/README.md) — Handlebars + Stencil module + token SCSS.
- WooCommerce: [`03-platforms/woo-wordpress/README.md`](../03-platforms/woo-wordpress/README.md) — PHP enqueue + token CSS + WP widget areas.

Each platform ships the same shape. The runtime differs (Liquid vs Handlebars vs PHP), the cart integration differs, the checkout customization story differs (Shopify hard-locks; BigCommerce and Woo are open). The composition above is invariant across all three.
