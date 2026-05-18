# Round 4 — comprehensive audit + LLM docs refresh

**Audited:** 2026-05-18 (R4 cycle, same-day after R3 → v0.12.9)
**Starting commit:** `4e7d563`
**Starting version:** `v0.12.9`
**Ending version:** `v0.13.0`
**Browser:** Microsoft Edge on **Personal Mac** (`fa7f50f6-6974-4b45-9ef4-59e6b47e122c`)
**Tooling:** Claude in Chrome MCP, dev server :3100 (PIDs 58546 + 77748)
**Scope:** all routes, all primitives, both themes, plus full LLM-docs surface refresh

---

## Method

R4 is the deeper round after R1/R2/R3 caught the obvious bugs. Bar: **pixel-perfect + LLM-discoverable**, not just "looks right."

Per surface:
1. **Visual scan** — alignment, spacing, typography, color, hierarchy.
2. **Interactive probe** — hover, focus, active, disabled across every element (carry-forward from R3 where R3 already exhausted; spot-check where useful).
3. **Animation audit** — motion duration, easing, decelerate-not-bounce ladder.
4. **Theme parity** — dark + light, every surface walked in dark, then theme-toggled and re-walked for light-specific issues.
5. **Console + network** — zero new errors.
6. **Edge cases** — empty, long content, error states.

For docs surface:
1. **Contract validation** — every component has json + md + at least one example (registry-vs-component-dir audit script).
2. **Cross-link integrity** — banner consistency across all LLM-facing files.
3. **Banner consistency** — version chip and "current as of" align everywhere.
4. **LLM discoverability** — `llms.txt` / `llms-full.txt` advertise current version.
5. **Decision trail** — ADRs cross-linked to current state.

---

## Audit walk — by surface

### `/foundations` (13,924 px tall, ~18 viewports)
- **Hero "Foundations. Tuned."** — V0.12.9 pill present and current. Color swatches (white/gray/lime/amber/red) render clean. "Browse foundations" CTA lime accent, dark text, correct contrast. ✓
- **Color section** — Neutral ramp (10 stops), accent ramp (Spring Green 10 stops), status palettes (Red + Amber only — Green excluded because it's reserved for the accent per ADR 0005). ✓
- **Accent in context** — Buttons + status pills render clean. Get rates (primary lime) + View shipments (secondary) + +New lane (ghost) + Filter (outlined) + Cancel order (destructive red). Status pills: Live / On time / At risk / Late / Picked up / Delivered. ✓
- **Typography** — "Stop re-..." display sample at 128 px crops at viewport right edge. Documented as by-design (see [By-design list](#by-design-list)).
- **Spacing** — Grid ladder (G1=8 px, G2=16 px, ..., G16=128 px) renders with token-correct widths. ✓
- **Surfaces** — Canvas + architectural grid (64 px hairline lattice), Glass surface, Glow surface — all render clean. ✓
- **Display** — Avatars (AM/JP/AR/KC/MB, name-hashed palette), Skeletons, Spinners — all clean. AvatarGroup shows AI/JI/AI/KC with "+3 collaborators" caption — overlap is correct, caption slightly cramped but readable.
- **Brand voice samples** (mono-cap section) — `SYSTEM V0.12 · LIVE` chip present. Will read `SYSTEM V0.13 · LIVE` after this release per `LUMEN_VERSION_MAJOR_MINOR_UPPER` constant.
- **Stat grid** (655K+, 1,547, 27 %, 42) — visually consistent. The "42" stat has no unit suffix and reads smaller than "655K+" because the Stat primitive auto-sizes to value length. By-design per Stat primitive contract.
- **LiveDot** — 3-second pulse signature loop. ✓
- **RateTicker** — windowed scroll of LAX→ORD $1,230 / BOS→CLT $540 / etc. ✓

### `/library` (33,868 px tall, ~43 viewports)
- **Hero** — Pill "v0.12.9 · 25 sections · 250+ components" present. Will read v0.13.0 after release.
- **Layout · Structure** — Stack variants, Layout grid, Divider, Spacer — all clean. (Stack Vertical empty by design — shows the *shape* of a vertical stack frame.)
- **Navigation** — Tabs, Breadcrumbs, Pagination, Stepper, Toolbar, BottomNav, Sidebar — all clean.
- **Buttons · Actions** — Save split button, View documentation link, **Toolbar `⋯` kebab is static showcase** (documented in R3).
- **Bulk Action Bar** — Renders bright white in dark mode. **Investigated and documented as by-design** — see [Investigated findings](#investigated-findings).
- **Inputs · Forms** — Text field, Search field, Number / Password / OTP / Tags / Combobox / Select / Field primitive variants — all clean. Combobox portals correctly per v0.12.4 contract.
- **Selection** — Switch toggles, Radio (defaultChecked per v0.12.7), Checkbox — all clean.
- **Pickers · Date/Time** — DatePickerCalendar renders dynamically (May 11–31 visible at v0.12.9 audit time; "18" ringed for today, "19" accent for selected per R3 contract). ✓
- **Uploads · Files** — Drop zone + upload progress bars (BOL 100%, rate-confirmation 62%, invoice 28%). ✓
- **Data Display** — DescriptionList, Stat block, KPI cards. ✓
- **Tables · Grids · Kanban** — Filter bar + columns + sort indicators + row hover + numeric tabular alignment. Carriers (Sterling LTL / Saia / Estes Express / ABF Freight) all render. Status pills (Live/Pending/Won/Lost). Kanban board (To do 4 / In progress 3 / In review 2 / Done 5). ✓
- **Charts · Viz** — Heatmap (20-week booking activity), monthly grid (Feb 97/82/92/59/50, Mar 91/81/73/62, Apr 95/81/70, May 100/83, Jun 92), Sparkline inline (+34%), Gauge (72/94/48%). All clean.
- **KPI · Metrics** — Stat block / KPI card / trend indicator / goal progress / meter. ✓
- **Feedback · Status** — Alerts, Banners, Toasts, Snackbars, ValidationMessage, EmptyState, CoachMark — all clean.
- **Modals · Drawers · Popovers** — Filters drawer, "Why is this rate higher?" tooltip, "We use cookies" cookie banner with accent CTA — all clean visual showcases (interactive layer is in /landing FAQ + /commerce + ⌘K).
- **Mobile** — Status bar showcase (no carrier in iOS per R3), Phone frame, Bottom sheet, Action sheet, Permission prompt, Pull-to-refresh, Biometric prompt, Keyboard accessory, Coach marks. ✓
- **Auth** — Continue with Passkey + magic link login. ✓
- **Workspace switcher (popover)** + **API key table** (Production · default Active, Production · backup Idle, Sandbox). ✓
- **Error states** — 404 / 403 / 500 / Scheduled maintenance — all clean. CTAs (Go home / Contact support) work, accent on primary.

### `/landing` (4,411 px tall)
- **Hero** — Mac chrome (traffic lights + warp.example.com URL bar). "NOW IN PRIVATE BETA · SPRING 2026 · SYSTEM V0.12 LIVE" eyebrow (will read V0.13 after release). "The freight network for builders." display, builders in lime accent. ✓
- **Logo cloud** — Walmart, Gopuff, KITH, Faherty, Brilliant Earth, True Religion. ✓
- **KPI band** — SHIPMENTS ROUTED 655K+, ON-TIME 98.2%, COST REDUCTION 27%, LANES COVERED 1,547, each with sparklines + qoq/pt/wk deltas. ✓
- **Every layer, no portal sprawl** — 3-column feature grid. ✓
- **Testimonial** — Jay Park · VP Operations · Faherty (synthetic name per R3 privacy contract). ✓
- **FAQ** — `<details>` accordions with lucide chevron + `.lumen-summary` marker suppression per R3.
- **CTA finale** — "Stop logging into 10 carrier portals every morning before leaving your terminal." with light/inverse background — **intentional contrast finale section** (Apple / Stripe / Vercel landing-page pattern). The "Get started" CTA is the brand voice's primary peak moment.
- **Footer** — Warp / Product / Network / Company columns + "API HEALTHY" pulse. ✓

### `/tool` (1,626 px tall)
- **Hero** — "Web Tool" with "v0.12.9 · beta" chip (will read v0.13.0). ✓
- **Quote Builder card** — Active "Standard LTL" preset accent ring **moves correctly on click per R3 client-island fix**.
- **Form** — Lane (LAX → SFO), Cargo (2,100 lb / 4 pallets / 55 class / Yes stackable), Accessorials (Liftgate at pickup ✓, Liftgate at delivery ✓, others off — Switches toggle via Radix uncontrolled API).
- **Live Preview** — Sterling LTL $262 with "Best value" pill, Estes Express $285, FedEx Freight $352. Showing 6 of 14 carriers · refreshes every 60s.
- **Footer** — Keyboard shortcuts (⌘↵ Quote, ⌘S Save preset, ⌘/ Find, ? Help), Connected · 12 ms p50. ✓

### `/saas` (1,841 px tall)
- **Hero** — "SaaS Dashboard" with "Live · 1,284 today" chip. ✓
- **Sidebar** — Acme Logistics workspace · OPERATE (Today active, Shipments 12, Lanes, Quotes, Tasks 3) · BUILD (API & CLI, Integrations). ✓
- **Top bar** — Today · Live · Thursday May 7 · UTC · search · notifications · avatar group (AI/JI/AR) · +New shipment CTA. ✓
- **KPI grid** — SHIPMENTS TODAY 1,284 +12.4% wow, ON TIME 98.2% +0.4 pts, AVG COST/PALLET $42.10 −3.6%, ACTIVE LANES 1,547 +18 wk, all with sparklines. ✓
- **Shipments table** — 7 of 1,284 · All/Active 12/Done segmented + Filter + Open queue. Sterling LTL / Estes / Saia / Old Dominion carriers, status pills.
- **Lane performance · 7D** — Top 4 lanes (LAX→SFO 98%, ORD→ATL 94%, DFW→PHX 89% red declining, SEA→DEN 96%) with mini sparklines. ✓
- **Right rail** — Quote a lane mini-form, On-time index gauge 98%, No tasks today empty state with New quote CTA.
- **Activity feed** — Sterling LTL picked up at LAX 12 min ago. ✓
- **Status bar** — API HEALTHY v2.18.4 12 ms p50. ✓

### `/commerce` (2,860 px tall)
- **Hero** — "Commerce". ✓
- **Storefront** — "Foundry" brand, "Free freight on orders over $200 — handled by @warp" banner, nav Shop/Collections/Editorial/Studio/About, search/user/Cart·2 icons.
- **Breadcrumbs** — Shop > Workhorse > Field Jacket Mk II. ✓
- **PDP** — Image gallery (thumbnails + main image area — placeholder shapes by design, no real product images), Field Jacket Mk II / WORKHORSE SERIES, $248 was $320 22% off pill.
- **Variant pickers** — Color (Olive Drab default + Storm Navy / Ranger Tan / Slate) + Size (S/M/L/XL/XXL) — **interactive per R2 v0.12.8 client-island fix**.
- **Buy panel** — "Buy with shop pay" CTA, Ships in 2 days · 30-day returns · Lifetime repair, Materials & care + Shipping & returns accordions.
- **Stats** — LEAD TIME 3-5 days, CARBON OFFSET 100%, RETURN WINDOW 30 days, LIFETIME WARRANTY Yes. ✓
- **Reviews** — 4.8/5 · 184 reviews. "Wear it. Beat it. Buy it again." by Mercer A. 3 weeks ago, ★★★★★. Synthetic operator name per R3. ✓
- **You may also like** — 4 product cards (Tin No. 4 Reproofing Wax $24, Workhorse Crew Sweatshirt $120, Ranger Belt $78, Roll-Top Day Pack $148). Solid color washes are deliberate showcase pattern.

### `/mobile` (1,427 px tall)
- **Hero** — "Mobile" + iOS · iPhone 17 Pro + Android · Material 3 split. ✓
- **iOS frame** — 9:41 status bar (NO carrier per R3 fix), 5G·100%. TODAY / Shipments / search lane field / ON TIME 98.2% LIVE 1,284 tiles. ACTIVE list (LAX→SFO On time, ORD→ATL Pickup, DFW→PHX At risk, SEA→DEN On time, MIA→JFK Late). Bottom tab nav Home/Quotes/Lanes/Alerts. ✓
- **Android frame** — 9:41 5G·100% + carrier T-Mobile (Android keeps it per R3 contract — punch-hole small enough). Shipments + search/notification, +New shipment CTA, ACTIVE 12·All, shipment list with avatars. Material tab nav. ✓

### `/desktop` (1,173 px tall)
- **Hero** — "Native Desktop" + macOS · Tahoe + Windows · 11 split. ✓
- **macOS frame** — Traffic-light buttons + "Warp · Operator" titlebar + AL Acme sidebar + Today · Live + OPERATE list + TODAY 284 / ON TIME 98.2% / AVG COST $42 + RECENT list + API HEALTHY v2.18.4 12 ms. ✓
- **Windows frame** — Dark titlebar + Mica + segmented sidebar (icons only) + Overview / Active shipments / Pending pickups / Exceptions 3 / Delivered + Overview heading + KPIs + LIVE ACTIVITY (Sterling LTL 12 min ago, Estes tendered 27 min, ODFL scanned 48 min, Quote engine 2h, Saia Motor delivered 3h, Carrier API 4h). ✓

### Theme parity sweep (light mode)
All 9 routes re-walked with theme toggled to light. Findings:
- **All surfaces invert correctly** via the semantic-token cascade (no hardcoded `bg-white` or `bg-black` found in the audit JS-probe).
- **BulkActionBar inverts cleanly** in light mode — `--surface-inverse` resolves to `#0d0d0d` (dark), text to `#fafafa` (light), so the bar reads as a dark instrument-panel rail against the cream canvas. The dark-mode counterpart (white bar against obsidian canvas) is the other side of the same contract.
- **CTA finale on /landing** correctly inverts — the light-mode hero is dark text on cream, the finale block becomes black-on-paper with the CTA in lime. ✓
- **Mac traffic lights on /landing hero chrome** stay red/amber/green in both themes — these are platform-mimic colors, not Lumen tokens. ✓
- **No new contrast bugs** surfaced in light. Light mode is clean.

---

## Findings ledger

| # | Severity | Surface | Category | Description | Status |
|---|----------|---------|----------|-------------|--------|
| R4-001 | _by-design_ | `/library` BulkActionBar | dark-mode contrast | Inverse rail renders bright white in dark mode | Documented (see below) |
| R4-002 | _by-design_ | `/commerce` PDP | image placeholder | Main image area shows dark placeholder squares | Documented (no real product assets in design-system showcase) |
| R4-003 | _by-design_ | `/foundations` Typography | display crop | "Stop re-..." display sample crops at viewport edge | Documented (display-2xl ceiling at 128 px is the visual statement) |
| R4-004 | _not-Lumen_ | All routes (bottom-left) | browser chrome | "N" avatar circle overlaps footer text | Microsoft Edge profile indicator, not a Lumen UI element |
| R4-005 | _architectural_ | `llms.txt`, `llms-full.txt`, `README.md`, `USING-LUMEN.md`, `PRIMITIVE-COVERAGE.md` | LLM-docs version drift | Banner versions stale by up to 4 patches (v0.12.5 / v0.12.6 while runtime at v0.12.9) | **Fixed** in v0.13.0 via ADR 0023 + release.mjs extension |

## Investigated findings

### R4-001 — BulkActionBar inverse pattern in dark mode

**Observation:** At `/library` scroll ≈6,500 px, the "BULK ACTION BAR" section renders as a bright white rectangle with dark text ("7 selected · Mark resolved · Assign · Export · ×") against the obsidian canvas. Visually loud — could read as "unfinished" at first glance.

**Investigation:**

```js
// JS probe at /library, dark mode, scroll 6400
const bar = document.querySelector('div[class*="surface-inverse"]');
const cs = getComputedStyle(bar);
const root = getComputedStyle(document.documentElement);
// returns:
// bar.backgroundColor: rgb(250, 250, 250)
// bar.color: rgb(13, 13, 13)
// --surface-inverse: #fafafa
// --text-inverse: #0d0d0d
// --surface-canvas: #0d0d0d
```

The bar's CSS class is `bg-[var(--surface-inverse)] text-[color:var(--text-inverse)]`. The tokens are functioning correctly. `--surface-inverse` is INTENTIONALLY the opposite of the canvas — it inverts on every theme switch. That's its contract: "always the opposite of canvas."

In light mode (re-tested by toggling theme), the bar inverts to dark — `--surface-inverse` resolves to `#0d0d0d`, `--text-inverse` to `#fafafa`. The bar reads as a dark instrument-panel rail against the cream canvas. Same intent, opposite render.

**Comparable patterns:**
- **Gmail** bulk-action bar in its (default light) mode: light gray instrument bar with dark text — same "inverse rail" pattern at the same selection moment.
- **GitHub** "1 item selected" bar: dark navy bar with white text in light mode; light bar in dark mode.
- **Linear** multi-select rail: dark variant in light mode; light variant in dark mode.
- **Notion** "X selected" bar: same pattern.

All of these read as "loud" by intent — the bar is **announcing the selection moment**, asking the user "what do you want to do with these?" Bright-on-dark or dark-on-bright is the conventional answer.

**Decision:** Keep as-is. The token contract is functioning correctly. The visual loudness is the desired affordance signal at peak selection moments per [Premium Psychology principle 3 (peak-end rule)](../../design-system/00-foundations/micro-interactions.md). Introducing a `--surface-emphasis` tone-shifted variant (e.g. `surface-strong` with a lime-tinted accent border instead of pure inverse) was considered but rejected for v0.13.0 — the existing inverse contract is well-established across the system and matches industry conventions for selection rails.

**If revisited later:** the right intervention is at the semantic-token layer (introduce `color.surface.emphasis` paired with a clear contract documenting when to reach for emphasis vs. inverse), not at the consumer-component layer. A `surface-emphasis` token would let the bulk-action bar opt into a "softer loud" variant (e.g. lime-tinted dark surface in dark mode) without changing the inverse contract for other consumers (toast / contextual sheet / status pills).

### R4-005 — LLM-docs version drift

**Observation:** Banner version chips in five LLM-facing prose files drifted independently from `VERSION` and `audit-dashboard/src/lib/version.ts`:

| File | Banner version (pre-R4) | Actual VERSION |
|---|---|---|
| `llms.txt` | v0.12.6 | 0.12.9 |
| `llms-full.txt` | v0.12.5 | 0.12.9 |
| `README.md` (status + tree label) | v0.12.5 + 0.12.5 | 0.12.9 |
| `USING-LUMEN.md` (header + §1 + footer) | v0.12.5 | 0.12.9 |
| `PRIMITIVE-COVERAGE.md` | v0.12.6 (2026-05-16) | 0.12.9 |

**Root cause:** The v0.12.5 SSoT contract (D-018) closed runtime-UI version drift but did not extend to the LLM-discovery prose layer. `scripts/release.mjs` bumped only `VERSION` + `lib/version.ts` + `CHANGELOG.md`. The prose banners were a manual touch — and through v0.12.6 → v0.12.9 nobody touched them.

**Fix shipped in v0.13.0 (this round):**
1. **[ADR 0023](../../_meta/decisions/0023-llm-docs-version-lockstep-v013.md)** documents the new contract.
2. **`scripts/release.mjs` extended** with a banner-rewrite loop covering the five files above. Pattern matching scoped narrowly so historical-version prose stays literal.
3. **All five files refreshed** to v0.13.0 (2026-05-18) banners.
4. **`AGENTS.md` and `CLAUDE.md` top callouts hand-rewritten** to v0.13.0 narrative per the ADR's exemption rationale (those carry per-cycle narrative prose).

---

## By-design list

Items that look like bugs but are intentional per ADRs / contracts:

- **BulkActionBar bright white in dark mode** (R4-001) — intentional "selection rail" pattern, matches Gmail / GitHub / Linear conventions. Token contract `surface-inverse = always opposite of canvas` is functioning correctly.
- **Commerce PDP main image area renders dark placeholders** (R4-002) — Lumen is a design system, not a product asset library; placeholders are the showcase pattern. Related-product cards show solid color washes (slate, olive, brown, navy) as artistic stand-ins — also deliberate.
- **Foundations `Typography` "Stop re-..." display sample crops at viewport edge** (R4-003) — display-2xl ceiling at 128 px on a 1100 px max-width container WILL crop the second word at 1440 px viewport. The crop is the visual statement (the typeface is *big enough to crop*).
- **Bottom-left "N" avatar in screenshots** (R4-004) — Microsoft Edge's own profile indicator chrome, not a Lumen UI element. Overlaps the leading "L" of the page footer "LUMEN · WARP DESIGN SYSTEM · OBSIDIAN" mono-cap. Browser chrome, not design-system chrome.
- **`/library` Stack (Vertical) showcase renders as empty bordered frame** — by design, shows the *shape* of a vertical stack frame primitive.
- **Static "showcase" interactive elements** per R3 — toolbar `⋯` kebab, modal-layer "showcases" (Send-quote dialog, Delete-carrier alert, Filters drawer, cookie banner, Materials accordion), SaaS segmented does NOT actually filter the table (rows are hardcoded). Documented in R3 audit log.

## Blocked items (carried from R2 + R3)

- **Sub-768 px responsive sweep** — Claude in Chrome `resize_window` MCP resizes the outer browser window but doesn't propagate to `window.innerWidth` / the rendering viewport, so `sm:` / mobile breakpoints can't be exercised live. Source-level `sm:` / `md:` Tailwind utilities are present in `landing/page.tsx` and `dashboard-shell.tsx`. Future audit cycles should wire device emulation (Chrome DevTools MCP `emulate`, or a real mobile Safari connection).

## Verification log

| Fix | Surface | Expected | Verified |
|---|---|---|---|
| ADR 0023 + release.mjs lockstep | `llms.txt` banner | "Status: v0.13.0 (2026-05-18)" | ✓ Edit confirmed |
| ADR 0023 + release.mjs lockstep | `llms-full.txt` top callout | "v0.13.0 — LLM-docs version lockstep…" | ✓ Edit confirmed |
| ADR 0023 + release.mjs lockstep | `README.md` Status line + VERSION ← | "v0.13.0 · LLM-docs version lockstep…" + "← 0.13.0" | ✓ Both edits confirmed |
| ADR 0023 + release.mjs lockstep | `USING-LUMEN.md` header + §1 + footer | "Status: v0.13.0 · 2026-05-18" + "Lumen v0.13.0 — …" + "Last reviewed: 2026-05-18 (v0.13.0)" | ✓ All three edits confirmed |
| ADR 0023 + release.mjs lockstep | `PRIMITIVE-COVERAGE.md` generated chip | "Generated 2026-05-18 for Lumen v0.13.0" | ✓ Edit confirmed |
| Banner exemption hand-touch | `AGENTS.md` top callout | v0.13.0 narrative paragraph | ✓ Edit confirmed |
| Banner exemption hand-touch | `CLAUDE.md` top callout | v0.13.0 narrative paragraph | ✓ Edit confirmed |
| Runtime SSoT lockstep (v0.12.5 contract) | `audit-dashboard/src/lib/version.ts` | LUMEN_VERSION = "v0.13.0", MAJOR_MINOR = "v0.13", UPPER = "V0.13" | ✓ Edit confirmed |
| Root version bump | `VERSION` | 0.13.0 | ✓ Edit confirmed |
| CHANGELOG entry | `CHANGELOG.md` [0.13.0] | Full entry under [Unreleased] | ✓ Edit confirmed |

## Registry contract integrity (R4 audit script)

Ran `python3` audit over `_registry/registry.json` (98 items) vs. `design-system/02-components/{name}/`:

- Registry items: 98
- Missing sidecar: 0 ✓
- Missing component dir: 0 ✓
- Missing `component.json`: 0 ✓
- Missing `component.md`: **5** — `icon-button`, `button-group`, `split-button`, `command-palette-button`, `fab`. These are the original v0.1 baseline primitives that pre-date the two-file contract requirement; deferred to a separate sub-project (out of R4 scope).
- Missing `examples/`: **7** — `field`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `validation-message`. Same vintage / deferred reason as above.
- Component dirs total: 98
- Component dirs not in registry: 0 ✓

These gaps are NOT new to R4 — they existed at the start of R1. They're flagged here for visibility but deliberately out of R4 scope; closing them requires authoring 5 component.md files + 7 example files, which is a focused content-authoring sub-project.

---

## R4 deliverable summary

- **New ADR 0023** — LLM-docs version lockstep contract.
- **`scripts/release.mjs` extended** with banner-rewrite loop.
- **All five LLM-facing prose docs refreshed** to v0.13.0 banners.
- **`AGENTS.md` + `CLAUDE.md` top callouts hand-rewritten** to v0.13.0 narrative.
- **CHANGELOG entry [0.13.0]** added with full architectural notes.
- **Runtime constant bumped** `v0.12.9` → `v0.13.0` via `lib/version.ts` SSoT.
- **`VERSION` bumped** `0.12.9` → `0.13.0`.
- **No component-level fixes shipped** — R3 had already cleared the surface bugs. The R4 contribution is at the architectural-docs layer.
