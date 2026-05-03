---
title: Warp Brand DNA Study
date: 2026-05-02
type: research
tags: [research, warp, brand, color, typography]
sources_count: 17
status: draft
---

# Warp Brand DNA

> Study target: **wearewarp.com** — the LA-based logistics / freight technology company founded in 2021 by Daniel Sokolovsky. NOT to be confused with `warp.dev` / `warp.co` (the developer terminal app — separate, unrelated company that also rebranded recently).

## TL;DR

- **Mood**: a freight operator's terminal, not a marketing brochure. Dark navy "operator console" surfaces, vivid lime-green accents, monospace numerics, live data tickers everywhere. Reads more like a Bloomberg / Linear / Vercel hybrid than a typical logistics site.
- **Color personality is binary**: deep navy near-black canvas + a single, very loud lime-green accent (`#4ade80`, used 788 times in CSS — by far the dominant brand color). Everything else is a supporting muted grey-blue.
- **The accent green plays one role only**: action, success, "live" pulse. CTA backgrounds, success status, the dot pulse on the "Tracking" button, the logo glyph itself. Restraint is the whole game.
- **Their actual marketing typeface is Space Grotesk + Fira Code mono** (extracted from CSS variables). Note: the user has chosen Satoshi for the new system — the brief is "use Warp's *vibe*, not Warp's literal fonts." Satoshi is a sensible swap for Space Grotesk; both are geometric sans with similar proportions.
- **Logo is a "terminal screen"**: a thick green-stroked rectangular frame containing the "WARP" wordmark with a notched diagonal slash through the A. Looks like a CRT readout, signals "system / network / live."
- **Photography is essentially absent.** No warehouses, no trucks, no team shots, no stock. The hero is data: live rate tickers, a network map, a dashboard screenshot. Trust is built with logos (Walmart, Gopuff, KITH) and numbers (`98.2% on-time`, `655K+ shipments`), not lifestyle.
- **Layout is dense, single-column, content-heavy.** Long scrolls. Lots of FAQ. Card max-widths around 1100–1200px. No oversized hero photography or full-bleed photo backdrops.

## Color system as observed

> Source: extracted directly from compiled CSS at `wearewarp.com` (9 stylesheet bundles, ~452 KB). All values are verbatim hex strings present in the source. Counts indicate raw occurrence in CSS — useful as a usage proxy, not a spec.

### Brand-named tokens (extracted as `--warp-*` CSS variables)

These are Warp's own design-token names. Use these as the canonical reference.

| Token | Hex | Role |
|---|---|---|
| `--warp-bg` | `#131c2a` | Page background (deep navy) |
| `--warp-surface-1` | `#141c2b` | Card surface (1 step lifted) |
| `--warp-surface-2` | `#1a2332` | Card surface (2 steps lifted) |
| `--warp-surface-3` | `#222d3e` | Card surface (3 steps lifted, hover) |
| `--warp-border` | `#253040` | Default border on dark |
| `--warp-border-strong` | `#334155` | Emphasis border |
| `--warp-text` | `#f0f2f5` | Primary text on dark |
| `--warp-text-muted` | `#b0b8c4` | Secondary text |
| `--warp-text-dim` | `#7a8494` | Tertiary text / labels |
| `--warp-accent` | `#4ade80` | Brand action color (lime green) |
| `--warp-success` | `#22c55e` | Success status (saturated green) |
| `--warp-warning` | `#f59e0b` | Warning (amber) |
| `--warp-danger` | `#ef4444` | Error (red) |
| `--warp-info` | `#38bdf8` | Info (sky blue) |
| `--color-warp-green` | `#86efac` | Lighter green (subtle highlights) |
| `--color-warp-green-dark` | `#071109` | Near-black green (used as text on green CTAs) |
| `--color-warp-input` | `#ffffff0f` | Input field background (~6% white) |
| `--color-warp-input-border` | `#ffffff1f` | Input border (~12% white) |

### Surface ladder (deepest → lightest)

| Hex | Name | Where observed |
|---|---|---|
| `#0a0c10` | Deepest navy | Some overlays / drawer backgrounds |
| `#0e1622` / `#0e141e` | Very dark navy | Section backdrops |
| `#0f1114` | Near-black | Edge zones, hero backdrop |
| `#131c2a` | **Brand bg** | Page background (declared `--warp-bg`) |
| `#141c2b` | **Surface 1** | Default cards |
| `#1a2332` | **Surface 2** | Lifted card / panel |
| `#222d3e` | **Surface 3** | Hover state, secondary panel |
| `#253040` | Border | Card borders, dividers |
| `#334155` | Strong border | Emphasis dividers |

### The green family (the brand's only loud color)

| Hex | Count in CSS | Role |
|---|---|---|
| `#4ade80` | **788** | Primary accent / CTA bg / icon fill (declared `--warp-accent`) |
| `#22c55e` | 34 | Success state (declared `--warp-success`) |
| `#34d399` | 10 | Teal-leaning green, used in subtle gradients |
| `#34c977` | 10 | Hover-darken of `#4ade80` (observed as `:hover{background:#34c977`) |
| `#3af792` | 4 | "Micro" gradient mid-stop (sparkles / signal animation) |
| `#86efac` | 18 | Light-green tint (declared `--color-warp-green`) |
| `#4aff80` | 10 | Pure green spike (data viz) |
| `#7aff5b` | 25 | Yellow-green spike (data viz) |
| `#00FF33` | n/a (in logo SVG) | **Logo color** — pure lime green, even brighter than `#4ade80` |
| `#071109` | n/a | Near-black text on green CTAs |

### Supporting blues (used sparingly, mostly in data viz)

| Hex | Role |
|---|---|
| `#66d6ff` | Sky-blue accent (line graphs, secondary data) |
| `#6fc4ff`, `#83c3ff`, `#57a3ff` | Lighter blues for layered chart fills |
| `#1884ff`, `#0078D4` | Saturated blue (rare, info state) |
| `#38bdf8` | Info status (declared `--warp-info`) |

### Neutrals & text

| Hex | Role |
|---|---|
| `#ffffff` | Pure white text (count: 643) |
| `#f0f2f5` | Primary text on dark (declared `--warp-text`) |
| `#e1e8f2`, `#f0f5fa`, `#f5f7fa` | Light surfaces (used on light variant pages — rare) |
| `#b0b8c4` | Muted body text (declared `--warp-text-muted`) |
| `#9ca3af`, `#7a8494` | Dim/tertiary text |
| `#6b7280` | Tailwind slate (utility) |
| `#000000` | Pure black (mostly used in 1px grid line gradients) |

### Status / semantic colors (full list)

| Hex | Role |
|---|---|
| `#22c55e` | Success |
| `#f59e0b` | Warning |
| `#facc15` | Warning highlight |
| `#ef4444` | Danger |
| `#f87171`, `#ff5a5a` | Light danger / hover |
| `#38bdf8` | Info |
| `#a882ff` | Indigo accent (rare — appears in some dev / agent pages) |
| `#ffc83c` | Yellow data spike |

### Notable color *combinations* (extracted from real CSS rules)

- **Primary CTA**: `background: #4ade80; color: #071109; box-shadow: 0 14px 34px #4ade803d` (a 24%-opacity green outer glow). This green-glow under the button is a signature.
- **Card hover**: `background: #4ade8014` (8% green tint) — extremely subtle.
- **Input on dark**: `background: #ffffff0f` + `border: #ffffff1f` — translucent white on dark, no solid fill.
- **Faint card surface gradient**: `linear-gradient(#ffffff0d, #ffffff05)` — layered translucent white sheen.
- **Blueprint grid backdrop**: `linear-gradient(90deg, #000000e6 1px, #0000 1px)` — 1px black grid line over surface, evokes a CAD / data-canvas feel.
- **Cyan-green tracer line** (used in section dividers): `linear-gradient(90deg, #57a3ff1f, #4aff80db, #57a3ff1f)`.

## Typography as observed

> Source: extracted from CSS variables in compiled stylesheets. **Note for the design system: Warp itself uses Space Grotesk + Fira Code, NOT Satoshi.** The user's choice of Satoshi for the Lumen system is a thematic match (both are geometric sans), not a literal copy.

### Typeface stack

| Token | Stack | Role |
|---|---|---|
| `--font-primary` | `var(--font-space-grotesk), "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | Display + UI |
| `--font-space-grotesk` | `"Space Grotesk", "Space Grotesk Fallback"` | Primary face |
| `--font-mono` | `var(--font-fira-code), "Fira Code", "SFMono-Regular", ui-monospace, monospace` | Code, numerics, data tickers |
| `--font-fira-code` | `"Fira Code", "Fira Code Fallback"` | Specific monospace face |
| `--font-sans` | `ui-sans-serif, system-ui, sans-serif, ...` | System fallback |

### Weights observed (count of CSS rules using each)

| Weight | Count | Role |
|---|---|---|
| 700 (Bold) | **263** | Headings, key numbers, strong emphasis |
| 600 (Semibold) | **218** | Sub-headings, button labels, table headers |
| 800 (Extra Bold) | 69 | Hero headlines, major stats |
| 500 (Medium) | 56 | Body emphasis, micro-copy |
| 400 (Regular) | 9 | Body fallback |
| 900 (Black) | 3 | Rare, single-stat displays |

### Hierarchy observed

| Level | Style (verbatim from CSS) | Notes |
|---|---|---|
| H1 hero | `font-size: clamp(2rem, 4.5vw, 3.2rem); font-weight: 700; line-height: 1.12; letter-spacing: -0.02em; color: #f0f2f5` | Tight tracking, near-white on navy |
| H1 mobile | `font-size: clamp(1.6rem, 7vw, 2.2rem)` | Same family |
| Body | `1rem` / `~16px` (default) with `1.5` line-height | |
| Eyebrow / label | Sub-`16px` sizes — heavy use of `0.72rem` (73 occurrences), `0.78rem` (71), `0.82rem` (73), `0.65rem` (34) | Many small uppercase labels |
| Numerics | Often Fira Code monospace | Visible in rate tickers (`LA → SF $260`), pricing |

### Letter-spacing pattern

- Tight negative tracking (`-0.02em`) on display sizes
- Default 0 on body
- Some uppercase eyebrows likely use Tailwind `tracking-wide` / `tracking-wider` (declared as CSS vars)

## Imagery & iconography

### Photography
**Effectively none.** No warehouse photos, no truck photos, no portraits of leadership (the About page lists names without headshots), no team shots on careers page. The brand actively avoids the standard logistics-stock-photo aesthetic.

### What appears instead of photography
- **One real product UI screenshot** (`portal-dashboard.jpg`, 2860×1424). Inspected: dark navy dashboard, green-outlined logo top-left, light-on-dark sidebar, three "0 / 0 / 1 — Created / In Progress / Completed" KPI cards with thin icon glyphs, a Mapbox grayscale US map with two dark navy node markers, a green "Get Quote" pill in the top-right. This screenshot is the closest thing to "photography" in their system.
- **Customer logos** (Walmart, Gopuff, KITH) on the homepage trust strip — rendered as flat `.png` lockups.
- **Press logos** (Forbes, FreightWaves, TechCrunch, SourcingJournal, SupplyChainBrain) — flat `.svg` monoline marks in a "as seen in" strip.
- **One MP4 video** (`portal-flow.mp4`) demonstrating the booking flow (UI motion, not lifestyle footage).

### Illustration
None observed. No spot illustrations, no isometric scenes, no character mascots. The blog references "professional business illustrations and conceptual graphics" but no specific examples are visible in static fetches.

### Iconography style
- **Thin line icons** (~1.5px stroke based on dashboard screenshot) — sidebar nav uses outlined glyphs (home grid, shipments, freight quote arrow, manage users, notifications bell, settings cog).
- **Geometric / pictogram-friendly**: simple rectangles, arrows, dots — match the "system console" feel.
- **No filled / duotone / gradient icons.**
- **No decorative flourishes.**
- **Live "pulse" dot** on the Tracking button: 8px green dot with an animated 2px green ring (`@keyframes trackPulse: 3s ease-out infinite`) — small but distinctive motion signature.

### Voice/visual signatures unique to Warp
1. **Live data tickers** — scrolling horizontal rate streams (`LA → SF $260 · Quote →`) appear on virtually every page. This is the single most consistent visual element after the green CTA.
2. **Near-black + neon green = "terminal" mood** — the entire product UI looks like a freight Bloomberg terminal.
3. **Numbers as hero** — `27% cost reduction`, `98.2% on-time`, `655K+ shipments`, `1,500+ lanes`, `50+ cross-docks`. Big bold numerals carry the marketing.

## Layout & rhythm

### Container widths (extracted from `max-width` CSS rules, sorted by usage)

| Width | Count | Likely role |
|---|---|---|
| `1100px` | 10 | Primary content container |
| `1200px` | 6 | Wide content / hero |
| `720px` | 7 | Article / single-column reading |
| `1060px` | 4 | Alternate wide container |
| `900px` | 4 | Medium content |
| `680px–700px` | 6 combined | Narrow text column |
| `56ch` / `60ch` | 9 combined | Reading-width measure for prose |

### Border radius scale

| Radius | Count | Role |
|---|---|---|
| `999px` | 63 | Pill buttons, badges |
| `50%` | 65 | Circular avatars, dots |
| `20px` | 51 | Large cards |
| `12px` / `14px` / `16px` / `18px` | 108 combined | Standard cards |
| `10px` | 46 | Smaller cards / chips |
| `8px` / `6px` / `4px` | 102 combined | Inputs, small chips |
| `2px` | 15 | Hairline accents |

The dominant cards live at **12–20 px** corner radius — soft but not playful, exactly the "Apple-app-on-a-dark-surface" feel.

### Spacing patterns (compound padding values)

Most-used button paddings: `10px 12px`, `8px 12px`, `10px 14px`, `12px 16px`. Indicates a tight, dense UI rather than airy hero-style buttons.

### Density
Pages are **content-dense and long-scrolling**. Single-column on mobile, multi-section verticals on desktop with alternating full-width and constrained-width blocks. The freight platform page packs 16+ section headings; FAQ-style accordions appear at the bottom of nearly every page.

## Motion

> Static fetch limitations: I can see CSS transitions and keyframes, but cannot observe runtime parallax, scroll-jacked animations, or any JS-driven motion. Everything below is verifiable from the CSS bundle.

- **Tracking pulse**: `@keyframes trackPulse { 100% { transform: scale(2.2); opacity: 0; } }` over 3s ease-out infinite — the green dot in the header. Subtle, ambient, on-brand.
- **Live rate ticker**: implied horizontal scroll (`carousel format` per fetch reports) — likely CSS `transform` based, but the keyframe definition wasn't isolated in the static dump.
- **Hover transitions**: button background swaps (e.g., primary CTA `#4ade80` → `#34c977`). Standard.
- **Subtle gradient sweeps**: the `linear-gradient(90deg, #0000, #5babff1f, #4ade8024, #0000)` lines suggest a "data flowing" line-sweep motif, but the keyframe trigger isn't in the CSS — likely JS-driven.
- **Could not verify**: scroll-triggered reveals, hero number-counters, map fly-throughs, the `portal-flow.mp4` content, parallax. Worth opening in Chrome to confirm.

## Voice & tone

Verbatim from `wearewarp.com` pages, each under 15 words:

1. "The open source freight network."
2. "More shipments on the same routes. Lower cost per pallet. AI keeps it dropping."
3. "Every shipment makes the network stronger for everyone."
4. "Built by people who've lived every layer of freight."
5. "Every year, legacy carriers raise prices. Every year, Warp gets cheaper."
6. "No ornamental process. Engineers ship code that controls physical freight."
7. "One command quotes. One books. JSON out, pipes in."
8. "Ship freight without leaving your terminal."
9. "Stop logging into 10 carrier portals every morning."
10. "There is no implementation. You log in, get rates, book, track."

**Tone signature**: declarative, matter-of-fact, numerate. Almost no adjectives. Sentences fragment for emphasis. Heavy use of "no X. no Y. Z." cadence. Reads like a senior operator, not a marketer.

## Logo system

**The mark** (extracted from `https://www.wearewarp.com/warp-logo.svg`):

- **Form**: A rectangular frame (660×186 viewBox) drawn as a thick stroked outline. Inside the frame sits the "WARP" wordmark in a custom geometric sans-serif treatment, with a **diagonal cut/notch through the A** that visually echoes a forward-slash / "fast / shipping vector" gesture.
- **Color**: pure lime green `#00FF33` — even brighter than the UI accent `#4ade80`. The logo is monochrome — every shape in the SVG is `fill="#00FF33"`.
- **Aspect**: roughly 3.55:1 (wide horizontal lockup).
- **Personality**: reads as a **terminal screen** or **CRT readout** — the rectangle around the wordmark is the defining gesture, and the green-on-dark presentation makes it feel like a system status display.
- **Usage observed**: top-left of nav, top-left of dashboard, in OG share image. Always green; always horizontal lockup; no separate glyph-only mark observed in static fetches.
- **Sizing**: `width: 110px / 94px / 120px height: auto` — small footprint, never dominant.

**No alternate marks, no monogram glyph, no icon-only lockup observed.** The whole brand leans on this one rectangular-frame wordmark.

## Implications for the design system

These are concrete, evidence-based directions for building the **Lumen** system "inspired by Warp." They're sequenced from highest-confidence to most-interpretive.

1. **Adopt the dark-navy + single-loud-green palette as the hero color move.** Concretely: use a navy in the `#131c2a–#1a2332` range as the canvas, layer surfaces in 3 steps as Warp does (`#141c2b → #1a2332 → #222d3e`), and assign a single green (their `#4ade80` or your tuned equivalent) the role of "action / live / success" — *and nothing else*. Resist the instinct to add a second brand color. The whole power comes from restraint: one dominant accent, used where it counts. (Iridescent or saturated blues should be confined to data-viz, not chrome.)

2. **Use Satoshi as the literal Warp-Space-Grotesk substitute, plus a real monospace.** Satoshi's geometric proportions land in the same zone as Space Grotesk. Pair it with **Fira Code, JetBrains Mono, or IBM Plex Mono** for any numerics, code, table cells, KPI counters, and rate-style displays. Warp's monospace is everywhere — pricing, tickers, command lines, JSON examples — and it's a huge chunk of why the brand reads as "operator-grade." Don't skip it.

3. **Build a "live data" component family.** Warp's most distinctive pattern isn't a button or a card — it's the **scrolling rate ticker** + **pulsing live-status dot** + **monospace numerics**. The Lumen system should have first-class primitives for: (a) a marquee/ticker, (b) a `LiveStatus` dot with the pulsing ring animation, (c) a `Stat` component that displays a big bold numeric with a small monospace unit/label. These three carry the operator-console mood more than any hero treatment can.

4. **Skip lifestyle photography. Build a strong screenshot + diagram practice instead.** Warp shows zero stock photos and one carefully-styled product UI screenshot. Lumen should plan for: high-resolution dark-themed product screenshots (with subtle drop shadows, rounded 12–16px corners), monoline geographic / network diagrams, and a brand-consistent way of presenting customer + press logos in muted strips. Reserve any photography only for genuine documentary editorial use.

5. **Calibrate to "dense and content-rich," not "airy minimal."** Apple-Ive minimalism leans toward generous whitespace and one big idea per screen. Warp does the opposite — long single-column scrolls, ~1100–1200px content widths, FAQ accordions, multi-section pages. If Lumen needs to read as Apple-clean *and* Warp-substantive, the resolution is: keep typography refined and surfaces calm (Apple), but allow dense info architecture and reward scrolling (Warp). A single page can have 12+ sections as long as each one is typographically composed and rests on the navy canvas.

## Sources

1. ★ https://www.wearewarp.com/ — Homepage (full HTML + 9 CSS bundles, ~452 KB total, downloaded for token extraction)
2. ★ https://www.wearewarp.com/warp-logo.svg — Logo SVG (color and form verification)
3. ★ https://www.wearewarp.com/portal-dashboard.jpg — Product UI screenshot (visually inspected, 2860×1424)
4. ★ https://www.wearewarp.com/about — About page (mission, leadership, voice)
5. ★ https://www.wearewarp.com/contact — Contact page (used as fallback when /careers and /pricing 404'd)
6. ★ https://www.wearewarp.com/all/warp-solutions — Solutions hub
7. ★ https://www.wearewarp.com/industries/home-goods — Industry vertical example
8. ★ https://www.wearewarp.com/blog — Blog index
9. ★ https://www.wearewarp.com/network — Enterprise network page
10. ★ https://www.wearewarp.com/sitemap.xml — Full sitemap (~700 URLs catalogued by category)
11. ★ https://www.wearewarp.com/developers — Developer hub (CLI / API / MCP positioning)
12. ★ https://www.wearewarp.com/agents/cli — CLI / agent page (terminal-styled UI)
13. ★ https://www.wearewarp.com/work-at-warp — Careers page
14. ★ https://www.wearewarp.com/research/state-of-ltl-2026 — Research page (data viz observation)
15. ★ https://www.wearewarp.com/ai — AI page
16. ★ https://www.wearewarp.com/freight-platform — Platform page
17. ★ https://www.wearewarp.com/news — Press / news page
18. https://www.crunchbase.com/organization/wearewarp — Company profile (403'd; backed by Globenewswire press release for verification)
19. https://www.globenewswire.com/news-release/2025/06/13/3099096/0/en/Warp-Raises-10M-... — $10M Series A confirmation, founding year
20. https://www.linkedin.com/in/danielsokolovsky/ — CEO confirmation
21. https://www.rebrand.gallery/rebrand/warp — Confirmed: this listing is for Warp Terminal (warp.co), NOT for our Warp. No external rebrand documentation exists for wearewarp.com.

## Method

**What I did.** Pulled the rendered homepage HTML (392 KB) and all 9 referenced CSS chunks (~452 KB combined) directly via `curl`, then extracted every hex color, every CSS custom property, and every layout/typography/radius/spacing token from the compiled stylesheets. Cross-referenced with WebFetch summaries of 11 additional pages (about, developers, agents/cli, work-at-warp, network, freight-platform, ai, blog, news, industries/home-goods, research/state-of-ltl-2026). Inspected the logo SVG directly for color and geometry. Inspected the one product screenshot (`portal-dashboard.jpg`) visually to confirm the dark-themed UI treatment. WebSearched for external corroboration on the company (verified: founded 2021, LA, $22M total raised, led by Daniel Sokolovsky). Verified that the rebrand.gallery "Warp" entry is the unrelated Warp Terminal app, not this company.

**What I could not verify.** Runtime motion (parallax, scroll-triggered animation, the rate-ticker keyframe behavior) — would require a real browser; this machine has no Chrome or Chromium installed. The exact contents of the `portal-flow.mp4` video. Any internal brand documentation — Warp does not appear to publish a public press kit or brand guidelines PDF. The carrier-facing site `carrier.wearewarp.com` is a thin SPA that loads content via JavaScript and was not server-rendered.

**Confidence.** Color and typography findings are high-confidence — they come from compiled CSS that ships to every visitor, including the company's own `--warp-*` semantic tokens. Layout / radius / spacing findings are high-confidence (extracted from same source). Imagery and motion findings are medium-confidence (based on static HTML + one screenshot + WebFetch text summaries). Voice findings are high-confidence (verbatim quotes preserved).
