# Lumen — Warp's Design System

> Lumen is Warp's vertically integrated UI design system. **LLM-first, human-second.** Single source of truth for every UI surface Warp's product/software-builder team ships — web, mobile, native desktop, e-commerce themes.

```
Visual mood:        Obsidian · neutral near-black canvas + cool-neutral paper + radial spring-green aurora
Accent:             Spring Green #00FA8A — action / live / success only
Dark canvas:        Obsidian #0D0D0D — neutral near-black (R = G = B at every dark stop, v0.12 — mint retired)
Light anchor:       #E6E6E6 — neutral light, also used as primary text on dark canvas
Typography:         Satoshi (single typeface — UI, display, body, numerics, code, editorial)
Hierarchy:          Aggressive — one focal point per section, 1.5–2× weight gap to support tier
First impression:   Engineered — 50ms halo contract, three-question hero, restrained chrome
Micro-interactions: Peak-end rule — hover, focus, validation, success — short, decelerating
Glow ladder:        Primary CTA rest 16px a25 → hover 20px a28 → active 8px a20 (v0.12.2 hover dialed down)
Card padding=none:  Auto-clips edge-touching children to the rounded corner (v0.12.1 corner-clip contract)
Floating UI:        Combobox / Popover / Dropdown / Tooltip portal to document.body (v0.12.4 — escapes ancestor overflow)
Focus rings:        Outline + box-shadow halo, never box-shadow alone (v0.12.4 — outline immune to ancestor overflow:hidden)
Position math:      Inline style.left / style.transform, never Tailwind translate-x-[Npx] (v0.12.3 — scanner fragility retired)
Version SSoT:       Every user-facing version label imports from @/lib/version (v0.12.5 — closes v0.11.13 palette-footer drift)
Accordion marker:   <summary class="lumen-summary"> suppresses native browser disclosure triangle on every browser (v0.12.5)
Icon-tile hover:    Hover lifts icon to text-accent + border-accent — teaches "green at action" visually (v0.12.5)
Peak-card hover:    Pricing tiers + plan pickers lift on hover (shadow-md + border-default + -translate-y-[1px]) (v0.12.5)
Density:            Marketing breathes (96 px hero rhythm) · Operator stays dense (24 px section rhythm)
Distribution:       shadcn registry · npx shadcn add <registry>/<name>
Tokens:             DTCG JSON · Style Dictionary v5 · 9 platform outputs
LLM contract:       llms.txt + AGENTS.md + CLAUDE.md + tool-specific mirrors · 14 hard rules
Status:             v0.12.5 · live-audit fix pack (single-source version constant + iconography accent-on-hover + pricing card peak-end lift + FAQ chevron unified + privacy scrubs) · 7 principles · 22 ADRs
```

## What this repo is

This repo is the **single source of truth** for Lumen. Everything Warp's team ships should pull tokens, components, and rules from here.

It contains:
- Design tokens in DTCG JSON (primitives → semantic → component) — 887 tokens across 32 files. v0.11.13 added 24 new primitives to close the master→child inheritance chain.
- Component contracts (Markdown spec + JSON sidecar) for 35 components: 12 v0.1 baseline + 8 v0.6 forms layer + 10 v0.7 deferred-form completion + 5 added through v0.8–v0.11.
- Per-platform consumption guides for 9 platforms (each maps the v0.6 field shell + density modes).
- Content rules (imagery, illustration, motion, voice, microcopy, errors, empty states) — 8 topical files.
- 14 foundation docs in `design-system/00-foundations/` (principles, voice, a11y, motion, hierarchy, first-impression, micro-interactions, etc.).
- An [`/audit-dashboard/`](./audit-dashboard/) — a Next.js 16 reference implementation showing every component pattern across 8 project templates (foundations, landing, saas, tool, ecommerce, mobile, desktop, library).
- A layered LLM contract so any AI coding tool (Cursor, Claude Code, Codex, Copilot, Devin, Warp Terminal AI) can consume Lumen rules natively.

It does NOT contain shipped product code. Product code lives in consumer repos and pulls Lumen via shadcn registry / Swift Package / Compose module / etc.

## Repo layout

```
Warp-Lumen-Design-Guidelines/
├── README.md                       ← you are here
├── llms.txt                        ← LLM discovery index (start here if you're an agent)
├── llms-full.txt                   ← inlined version
├── AGENTS.md                       ← universal agent rules (read first)
├── CLAUDE.md                       ← Claude-specific addenda
├── CONTRIBUTING.md                 ← human contributor guide
├── CHANGELOG.md                    ← Keep-a-Changelog format
├── VERSION                         ← 0.12.5
├── package.json                    ← build / validate / registry scripts
├── style-dictionary.config.ts      ← token build pipeline
├── scripts/                        ← build-registry, check-contrast, lint, release
│
├── design-system/                  ← THE ACTUAL SYSTEM
│   ├── 00-foundations/             ← principles, voice, a11y, motion, hierarchy, first-impression, micro-interactions (× 14)
│   ├── 01-tokens/                  ← DTCG JSON (primitives, semantic, components) — 887 tokens / 32 files
│   ├── 02-components/              ← component.md + component.json per component (× 35)
│   ├── 03-platforms/               ← per-platform consumption guides (× 9)
│   └── 04-content/                 ← imagery, illustration, microcopy, errors (× 8)
│
├── _registry/                      ← shadcn-compatible registry.json + sidecars
├── _meta/                          ← glossary, ADRs (× 22), prompt fragments (× 5)
├── _build/                         ← gitignored. Style Dictionary outputs.
│
├── audit-dashboard/                ← Next.js 16 + Tailwind v4 reference dashboard
│
├── .cursor/rules/lumen.mdc         ← Cursor mirror of AGENTS.md
├── .warp/lumen.mdc                 ← Warp Terminal mirror
├── .github/copilot-instructions.md ← GitHub Copilot mirror
│
└── research/                       ← brand DNA, inspiration, typography, architecture, brief
```

## Getting started

### As a human contributor

```bash
git clone <repo>
cd Warp-Lumen-Design-Guidelines
pnpm install
pnpm build               # Style Dictionary builds _build/
pnpm validate            # JSON schemas + DTCG + WCAG contrast
cd audit-dashboard
pnpm install
pnpm dev                 # http://localhost:3000  ← visual audit dashboard
```

Then open the audit dashboard, switch tabs across the eight project types, toggle dark/light mode, and review the system end-to-end. See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to propose changes.

### As an AI coding agent

1. Read [`llms.txt`](./llms.txt) for the discovery map.
2. Read [`AGENTS.md`](./AGENTS.md) for the hard rules.
3. If you're Claude, also read [`CLAUDE.md`](./CLAUDE.md).
4. When generating code, use only **semantic tokens** (`color.surface.page`, never `color.warm.50`).
5. When creating a new component, follow [`_meta/prompts/new-component.md`](./_meta/prompts/new-component.md).
6. When in doubt, look at [`audit-dashboard/src/`](./audit-dashboard/src/) for working examples of every primitive.

### As a consumer (a Warp project that wants to use Lumen)

Web (Next.js + Tailwind v4 + shadcn):
```bash
# Pull the built theme
curl -o src/styles/lumen.css <cdn>/lumen/v0.1.0/tailwind/theme.css

# Install a component (copies into your repo)
pnpm dlx shadcn@latest add <cdn>/lumen/registry/button.json
```

iOS (SwiftUI):
```swift
.package(url: "https://github.com/warp/lumen-ios.git", from: "0.1.0")
```

Android (Compose):
```kotlin
implementation("dev.warp:lumen-compose:0.1.0")
```

See [`/design-system/03-platforms/`](./design-system/03-platforms/) for the full per-platform setup guide.

## What makes Lumen different

- **Apple discipline + Warp substance + premium psychology.** Apple typographic rigor (1.25 scale, hairlines, decelerate motion) + the v0.11 psychology principles (50ms halo, aggressive hierarchy, cognitive fluency, peak-end rule) on Warp's material (cool-neutral paper / neutral obsidian canvas — v0.12 retired the mint tilt, the spring-green accent has the hue stage to itself / contextual density).
- **One disciplined accent.** Spring Green `#00FA8A` plays exactly one role across the entire system: action / live / success. Adding a second loud color is a brand violation.
- **Three Warp-signature primitives.** `Stat` (big tabular number), `LiveDot` (pulsing 8px green dot), `RateTicker` (scrolling lane rates). These three carry the operator-console mood.
- **LLM-first, human-second.** Two-file-per-component contract (md for humans, json for agents). Layered LLM contract surfaces (llms.txt, AGENTS.md, CLAUDE.md, tool-specific mirrors). Lint enforces semantic-only token references.
- **No stock anything.** No stock photography, no AI-generated images, no character mascots, no isometric scenes. Product screenshots first, documentary second, monoline diagrams for abstract concepts.
- **Dense, not airy.** Long-scroll pages, 1100 px primary content, compact 32 px table rows. Whitespace lives inside sections.

## The audit dashboard

The single best way to evaluate Lumen is to open the audit dashboard:

```bash
cd audit-dashboard && pnpm dev
```

Eight tabs:
1. **Foundations** — color, type, spacing, radius, elevation, motion, iconography, live-data primitives.
2. **Marketing & Landing** — type-led hero, live ticker, trust strip, stat band, features, pricing, FAQ, CTA, footer.
3. **SaaS Dashboard** — Warp's actual product type. Sidebar nav, KPI grid, shipments table, side panel.
4. **Web Tool** — single-purpose utility (quote builder), focused canvas, control panel, output panel.
5. **E-commerce** — Shopify-style product detail with gallery, buy panel, ratings, related grid.
6. **Mobile** — iOS and Android frames side-by-side. Same Lumen visual language, platform-native chrome.
7. **Native Desktop** — macOS and Windows frames side-by-side. Vibrancy / Mica titlebar.
8. **Library** — full component gallery + every primitive in every state.

Use the mood switcher (top right) to compare the four moods (Quiet Industrial recommended; Soft Luminous, Mono Editorial, Premium Glass as alternatives).

## What's new — v0.12.x

### v0.12.5 (2026-05-07) — Live-audit fix pack (single-source version constant + iconography accent-on-hover + pricing card peak-end lift + FAQ chevron unified + privacy scrubs)
A two-round live visual audit against the deployed Vercel site (round 1 walks all 8 routes statically; round 2 triggers every interactive overlay — ⌘K palette, accordions, dropdowns, hover states) caught five issues that the static walk missed. v0.12.5 ships them as five surgical fixes at five different cascade depths, plus a release-script change to keep the new infrastructure in lockstep:

- **Infrastructure band — single source of truth for the runtime version label.** New [`audit-dashboard/src/lib/version.ts`](./audit-dashboard/src/lib/version.ts) exports `LUMEN_VERSION` (`"v0.12.5"`), `LUMEN_VERSION_MAJOR_MINOR` (`"v0.12"`), and `LUMEN_VERSION_MAJOR_MINOR_UPPER` (`"V0.12"`) for the three rendering contexts. Wired into `dashboard-shell.tsx` (header pill + footer line), `command-palette.tsx` (palette footer — was reading `Lumen v0.11.13` three minor versions stale, the audit's signature catch), `foundations/page.tsx` (hero badge + two `SYSTEM V0.11 · LIVE` brand-voice samples), `library/client.tsx` (hero pill + "End of library — last refreshed" footer), `tool/page.tsx` (page header + Quote Builder titlebar), and `landing/page.tsx` (hero "system v0.12 live" eyebrow). The release script (`scripts/release.mjs`) now bumps `lib/version.ts` in lockstep with the root `VERSION` file. The whole class of cross-file version drift is retired.
- **Micro-interaction band — iconography hover lifts to accent.** Foundations §08 Iconography demo tile hover state was tinting the background only; the icon glyph stayed neutral, so the brand rule "green appears precisely at action" was taught only in prose. v0.12.5 adds `hover:text-[color:var(--text-accent)]` and `hover:border-[var(--border-accent)]` on top of the existing `hover:bg-[var(--surface-tint-accent)]` — three-property hover transition on the 140 ms `motion-fast` curve. The icon now lifts to spring green at the moment of interaction; the rule is felt, not read.
- **Micro-interaction band — pricing card peak-end lift.** Pricing tier cards on landing rendered static — no peak-end micro-interaction at the moment of decision. v0.12.5 adds hover lift via the existing system tokens. Non-highlighted tiers (Starter / Enterprise): `shadow-md` + `border-default` + `-translate-y-[1px]`. Highlighted tier (Operator): layer `var(--shadow-glow-accent)` on top of the rest-state lifted shadow. 140 ms standard easing, decelerate-not-bounce per ADR 0016. Per Premium Psychology principle 3 (peak-end rule), the pricing decision IS a peak moment — the cards now respond.
- **Globals band — `<details>`/`<summary>` marker contract.** Landing FAQ disclosure caret was Unicode `▾` (U+25BE BLACK DOWN-POINTING SMALL TRIANGLE) while commerce + tool used lucide `<ChevronDown />`. v0.12.5 unifies on lucide and adds a new `globals.css` rule (`.lumen-summary` / `summary.list-none`) that suppresses the native browser disclosure marker — `list-style: none` covers modern Chrome / Safari / Firefox via the standard `::marker`, `::-webkit-details-marker { display: none }` covers the pre-2022 webkit fallback. Without the rule, browsers render the native triangle PLUS the custom lucide icon — two arrows compete. With the rule applied (any new accordion summary gets `class="lumen-summary"`), the lucide icon is the sole disclosure cue on every browser.
- **Fixtures band — privacy scrub.** Real-person names (`Daniel Sokolovsky` / `Neel Tengariya` / their initials) appeared in 9 sites across 5 files (`ai.tsx` CommentThread, `foundations/page.tsx` Avatar + AvatarGroup demos + caption sample, `saas/page.tsx` AvatarGroup, `commerce/page.tsx` review fixture, `library/client.tsx` Avatar + AvatarGroup + Reaction-bar). v0.12.5 retires both — replaced with synthetic operator names (`Avery Mercer` / `A Mercer` / `Mercer A.` for Sokolovsky, `Kai Morgan` for Tengariya). The avatar palette is name-hashed, so deterministic colours follow whatever name ships. Carrier names (Sterling LTL, ODFL, Saia, FedEx Freight, ABF, Old Dominion) stay — public B2B identities are safe; customer / contact names aren't.

The fix doesn't ship a new ADR — these are consequential follow-ups to ADRs 0007 (component contract), 0009 (versioning), and 0018 (brand voice / Premium Psychology). The CHANGELOG entry for `[0.12.5]` carries the full architectural notes the would-be ADRs would have held. Brand canvas (v0.12.0), Card corner-clip (v0.12.1), hover-glow ladder (v0.12.2), the v0.12.3 inline-style position math, the v0.12.4 InlineTabs / Combobox / focus-ring fixes, and the single-accent rule are all preserved verbatim.

### v0.12.4 (2026-05-06) — Three primitive-layer fixes (cascade-fix at the right architectural depth)
User-reported screenshots caught three structural UI bugs in the same session: (1) `/foundations` "Inline tabs · pill" — the active "Day" pill's `bg-raised` square corners poked past the parent `rounded-lg` track at the bottom-left, the same v0.12.1-style corner-clip pattern as Card but at smaller-control scale; (2) `/library` Combobox autocomplete — the dropdown rendered as inline `<div absolute>` and was clipped by the Showcase demo frame's `overflow: hidden` (the same trap applies inside `<Card padding="none">` per ADR 0021); (3) Pagination focus rings inside `<Card padding="none">` were partially clipped by the v0.12.1 `overflow-hidden` corner-clip — the global `:focus-visible` rule used `box-shadow` only, which paints into the element's own painting context and respects ancestor overflow. v0.12.4 fixes all three at the primitive layer:
- **InlineTabs pill** — `TabsList` for `variant="pill"` gains `overflow-hidden`. Active pill's smaller-radius corners clip cleanly to the parent's larger curve.
- **Combobox** dropdown migrates from inline `<div absolute>` to `createPortal(<div fixed>, document.body)` with `getBoundingClientRect()` re-tracked on scroll (capture phase) + resize. Escapes every ancestor's overflow context — works inside `Showcase`, inside `<Card padding="none">`, anywhere.
- **Global `:focus-visible`** retunes from box-shadow-only to `outline 2px solid lime-a64; outline-offset: 1px;` PLUS the existing soft box-shadow glow. Outline is painted outside the layout box — structurally immune to ancestor overflow. The `.lumen-btn-primary:focus-visible` dual-ring is unaffected (declares `outline: none` and wins via specificity per ADR 0016).

The fix doesn't ship a new ADR — these are consequential follow-ups to ADRs 0007 + 0015/0016 + 0021 that close the final trade-offs ADR 0021 left open. Brand canvas (v0.12.0), Card corner-clip (v0.12.1), hover-glow ladder (v0.12.2), and the single-accent rule are all preserved verbatim.

### v0.12.3 (2026-05-06) — PricingToggle thumb-escape · Tailwind v4 arbitrary-translate fragility retired
A user-reported screenshot of the `/library` PricingToggle ("Monthly | toggle | Yearly −2 mo") caught the toggle thumb escaping the track on the right side and overlapping the "Y" of "Yearly". DOM inspection confirmed two layered bugs: Tailwind v4's content scanner intermittently drops the `translate-x-[22px]` arbitrary class (the same scanner fragility ADR 0015 / 0016 retired for the Button primitive — `getComputedStyle(thumb).transform` reported `none` despite the className carrying the utility); and the `<button>` element's browser-default `text-align: center` produced a non-zero static-position `left` for the absolute-positioned thumb, which compounded with the (sometimes-firing) translate to push the thumb past the inner-right edge.

v0.12.3 retires the Tailwind arbitrary-translate dependency on both remaining callers (PricingToggle + SwipeAction) by migrating position math to inline `style.left` + a native `transition: left 120ms cubic-bezier(0.2, 0, 0, 1)`. Inline style is scanner-independent; explicit `left` overrides the static-position fallback. Cascade-fix to ADR 0015/0016 in toggle/swipe territory; no new ADR (the pattern is exactly the one ADRs 0015/0016 already established).

### v0.12.2 (2026-05-06) — Primary-button hover bloom dialed down
User screenshot caught the `/library` LoginCard "Send magic link" button blooming ~40 px past its edge on hover — read as "little too much." The bloom came from a three-layer halo recipe stacked on `.lumen-btn-primary:hover` that was system-dialed-up, not button-specific. Token-level fix:
- `--shadow-button-glow-hover` retuned `0 0 24px lime-a40` → `0 0 20px lime-a28`. Cascades into both base `:hover` and the first layer of the layered halo.
- Layered halo middle layer (the "lit boost") trimmed `24px lime-a20` → `20px lime-a14`.
- Layered halo wide outer layer (the "bloom" edge) trimmed `48px lime-a10` → `32px lime-a08`.
- `.lumen-glow-cta:hover` (hero CTAs) trimmed in lockstep so the standard-vs-hero hierarchy stays intact (hero still ~1.5× the standard primary, just both quieter).

Rest (`16px lime-a25`), active (`8px lime-a20`), `--shadow-glow-accent-strong`, every `--lumen-lime-aXX` alpha primitive, the spring-green hex, and the dual-ring focus indicator are unchanged on purpose. Per [ADR 0018](./_meta/decisions/0018-premium-psychology-recolor.md), the rest-state halo is the always-present brand signal — that's the brand voice, not the dial-down target. See [ADR 0022](./_meta/decisions/0022-hover-glow-ladder-retune-v0122.md) for the full rationale.

### v0.12.1 (2026-05-06) — Card corner-clip contract
User screenshot caught the `/saas` pagination "Next" button stair-stepping past the rounded bottom-right corner of its `<Card padding="none">` — a square nub of the inner pagination footer's `bg-[var(--surface-raised)]` poked out from behind the curved card border because the Card had `border-radius: 16px` but `overflow: visible`. Primitive-layer fix:
- `<Card padding="none">` now composes `overflow-hidden`. Edge-touching children (table headers, pagination footers, full-bleed product images, list rows) auto-clip to the rounded shape.
- Other padding tiers (`xs`/`sm`/`md`/`lg`/`xl`/`hero`) unchanged — their `p-N` insets float children off the curved edge entirely.
- Radix-portaled popovers, dropdowns, and tooltips render outside the Card subtree and are unaffected.

Cascade benefits: `/saas` Pagination footer (top-right + bottom-right) clean, `/foundations` Satoshi typeface card clean, `/commerce` related-product Cards lose their hand-added `className="overflow-hidden"` workaround. While in the neighborhood, `DatePickerCalendar` month-nav glyphs upgraded from literal `‹` / `›` to `<ChevronLeft size={12} />` / `<ChevronRight size={12} />` (last remaining literal arrow glyphs in the system, completing the v0.11.15 navigation-chrome cleanup). See [ADR 0021](./_meta/decisions/0021-card-corner-clip-contract-v0121.md).

### v0.12.0 (2026-05-06) — Obsidian recolor (mint retired)
User feedback flagged the v0.11 Obsidian Mint canvas (faint G+2 channel undertone, anchored at `#171A18`) as "weird green" — the canvas read as a hue rather than as a confident dark plate, and the spring-green accent had to share the hue stage with it. v0.12 retunes the brand dark anchor to `#0D0D0D` (true neutral, R = G = B at every dark stop) and strips residual G drift from cool/cream/neutral mid-stops. Mood id renamed `obsidian-mint` → `obsidian` with a localStorage migration. The single-accent rule (Spring Green only) is preserved verbatim — only the canvas underneath moved.

Cascade hits 11 brand-ramp primitive token values + the runtime `--lumen-obsidian-N` ramp + cream/ink/void alpha anchors + 30+ on-screen badge/footer copy updates (all describing the mood). 16/16 contrast pairs continue to pass; the contrast-checker pair list itself was extended from 4 dark-mode pairs to 7. See [ADR 0020](./_meta/decisions/0020-obsidian-recolor-mint-retired-v012.md) (amends [ADR 0018](./_meta/decisions/0018-premium-psychology-recolor.md)).

## Open questions (post-v0.12.5)

1. **Mood lock-in.** Obsidian (neutral, `#0D0D0D`) as system default — confirmed v0.12.0.
2. **Accent calibration.** `#00FA8A` is the user-fixed brand value. AAA contrast verified. Locked.
3. **Component coverage.** v0.12.0 retuned canvas; v0.12.1 fixed corner-clip; v0.12.2 retuned hover bloom; v0.12.3 retired Tailwind v4 arbitrary-translate fragility on toggle/swipe primitives; v0.12.4 fixed three primitive-layer bugs at the structural depth (corner-clip pattern extension, floating-UI portal, focus-ring outline backstop); v0.12.5 hoisted the user-facing version label to a single source of truth, added two micro-interactions (iconography accent-on-hover, pricing card peak-end lift), unified the FAQ chevron icon language, and scrubbed real-person names from fixtures. Visual regression sweep against the full audit dashboard at light + dark + both modes still pending.
4. **Photography policy.** No photography at all (current default), or accept documentary photography for marketing? — open.
5. **E-commerce template direction.** Aspirational (future Warp merch shop) or for client work? — open.
6. **Mobile mood.** Obsidian, or Premium Glass for the mobile operator app? — open.
7. **ADR-less patches as architectural pattern.** v0.12.3 / v0.12.4 / v0.12.5 explicitly ship without new ADRs because the underlying patterns (defensive primitives over Tailwind scanner fragility per ADRs 0015/0016, corner-clip contract per ADR 0021, two-file component contract per ADR 0007, single semver per ADR 0009, brand voice per ADR 0018) are already established. The CHANGELOG entries carry the architectural notes those would-be ADRs would have held. Question: should the ADR floor extend to "every cascade-fix" (heavier governance, easier discovery) or stay at "every new architectural decision" (current — leaner, requires reading CHANGELOG for full picture)? Punted — the current pattern is working; v0.12.5's `lib/version.ts` constant and `lumen-summary` marker contract were both documented as system contracts directly in the CHANGELOG without needing a new ADR.
8. **Live-audit cadence.** v0.12.5 was a two-round audit pass — round 1 walks routes statically, round 2 triggers overlays. The pattern caught issues a single static walk would miss (palette footer drift, FAQ chevron mismatch, missing native-marker suppression). Cadence: ad-hoc per release vs. quarterly vs. CI-automated visual diff? — open.

See [ADR 0018](./_meta/decisions/0018-premium-psychology-recolor.md) (premium-psychology recolor, amended by 0020), [ADR 0020](./_meta/decisions/0020-obsidian-recolor-mint-retired-v012.md) (obsidian recolor — mint retired), [ADR 0021](./_meta/decisions/0021-card-corner-clip-contract-v0121.md) (Card corner-clip contract), [ADR 0022](./_meta/decisions/0022-hover-glow-ladder-retune-v0122.md) (hover-glow ladder retune), [CHANGELOG v0.12.3 + v0.12.4 + v0.12.5 entries](./CHANGELOG.md) (the structural fixes that don't have their own ADRs), and [`/research/lumen-brief.md`](./research/lumen-brief.md) for older open questions.

## License

Lumen itself is internal to Warp.

Bundled fonts:
- **Satoshi** — Indian Type Foundry Free Font License (ITF-FFL). Free for personal + commercial use; must self-host; **must NOT be redistributed in a public repo**. See [`/audit-dashboard/src/fonts/SATOSHI-LICENSE.txt`](./audit-dashboard/src/fonts/SATOSHI-LICENSE.txt).
- **JetBrains Mono** — SIL Open Font License 1.1.

Pre-launch action item: have legal archive a PDF copy of the canonical ITF-FFL text from `https://www.fontshare.com/licenses/itf-ffl`.

## Credits

Lumen is built by Warp's product/software-builder team, in-house. The visual identity inherits Warp's actual brand DNA observed from production CSS at wearewarp.com. Inspiration draws from Apple's Human Interface Guidelines, Dieter Rams's Ten Principles of Good Design (Vitsoe), Jony Ive's body of work, and best-in-class systems by Linear, Stripe, Vercel, Figma, Notion, Things, Bear, Arc, Polaris, Carbon, Material 3, and Primer.
