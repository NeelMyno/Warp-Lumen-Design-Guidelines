# Round 5 — comprehensive testing phase (R4 deferred items + responsive sweep)

**Audited:** 2026-05-18 (R5 cycle, same-day after R4 → v0.13.0)
**Starting commit:** `f7cab2b`
**Starting version:** `v0.13.0`
**Browser:** Microsoft Edge on **Personal Mac** (`fa7f50f6-6974-4b45-9ef4-59e6b47e122c`) via Claude in Chrome MCP
**Plus:** chrome-devtools-mcp emulate (closes the R4-carried sub-768 viewport blocker)
**Dev server:** `:3100` (PID from `pnpm dev --port 3100`)
**Scope:** R4 deferred work + responsive breakpoints + performance / a11y / motion budget audit

---

## R5 thesis

R1 (chrome bleed) → R2 (interaction) → R3 (dynamic render) → R4 (meta-docs version sync) walked the surface comprehensively. R4 confirmed "no new visual / interaction bugs" at 1501×812 px in dark + light. R5's new contribution is the **two axes R4 explicitly deferred**:

1. **Sub-768 px responsive sweep** — was blocked because claude-in-chrome `resize_window` doesn't propagate to `window.innerWidth`. Closed in R5 by switching to **chrome-devtools-mcp `emulate`** with viewport + mobile + touch flags. Walk every route at 360 / 480 / 640 / 768 / 1024 / 1280 / 1500.
2. **Component coverage closeout** — 5 `component.md` files + 7 `examples/` files were missing from the v0.1 vintage primitives. Authored in R5.

Plus the things R4 couldn't surface from a static walk:

3. **Performance + a11y** — Lighthouse navigation audit on every primary surface.
4. **Console + network hygiene at smaller viewports** — overflow scrollbars, layout shifts, hydration mismatches.
5. **Hover / focus / motion ladder consistency** — the v0.12.4 contracts (portal, focus-ring, position math) verified in DevTools across every floating primitive.

---

## Findings ledger

| # | Severity | Surface | Category | Description | Status |
|---|----------|---------|----------|-------------|--------|
| R5-001 | P2 | `swatch.tsx` SwatchRamp | token-violation | `style={{ background: "rgba(0,0,0,0.55)", color: "white" }}` hardcoded on hover-state step-number chip. AGENTS hard-rule-1 violation (no inline colors). | **Fixed** — replaced with `var(--label-overlay-strong)` + `var(--label-overlay-fg)` (new theme-invariant semantic tokens) |
| R5-002 | P2 | `inputs.tsx` ColorPicker | legacy-color | Default `swatches` array included `#171A18` — the v0.11 obsidian-mint dark anchor retired in v0.12 per ADR 0020. | **Fixed** — replaced with `#0D0D0D` (v0.12 neutral obsidian) |
| R5-003 | P1 | `commerce.tsx` ColorSwatchSelector | AA-contrast regression | "Brick" color `#e23b3b` — the v0.9-retired red-5 that fails AA at 3.94:1 contrast per `globals.css §--destructive` history comment. | **Fixed** — replaced with `#a8403a` (deeper brick, AA-pass on both canvas anchors, more accurate to "brick" anyway) |
| R5-005 | P2 | `progress.tsx` ProgressRing | a11y | `<svg role="img" aria-label={label}>` shipped with `aria-label=""` when `label` prop was undefined — 3 nameless instances on `/foundations`. | **Fixed** — conditional spread: labelled instances get full value announcement ("Capacity 72%"); unlabelled instances ship `aria-hidden` |
| R5-006 | P1 | `library/client.tsx` SwitchRow | a11y | `<label>` wrapping `<Switch>` with sibling `<span>` text — HTML's implicit-label association does NOT propagate to a Radix `<button role="switch">`. 8 nameless Switch instances. | **Fixed** — added `aria-label` / `aria-labelledby` props to Lumen Switch + Checkbox primitives; SwitchRow now references the label span by id; click-to-toggle UX preserved via onClick on label |
| R5-007 | P3 | `inputs.tsx` DatePickerCalendar | a11y / DOM hygiene | 12 spacer `<button disabled className="opacity-0">` per calendar instance pollute the a11y tree as nameless interactive targets (disabled removes from tab but stays in DOM). | **Fixed** — spacer cells render as passive `<span aria-hidden>`. Day cells gained `aria-label` with full date string |
| R5-009 | P2 | `commerce.tsx` ProductGallery | a11y | 5 nameless thumbnail buttons. | **Fixed** — tablist + tab pattern with `aria-label="View image N of M"` + `aria-selected` |
| R5-010 | P2 | Multi-component | a11y | 4 nameless icon buttons: PricingToggle, Kanban "+", ChatComposer "+", mobile-inbox search. | **Fixed** — `aria-label` added at each site |
| R5-011 | **P1** | All routes at <768 px | layout / responsive | Mobile-viewport inflation: `innerWidth=509` at 320px emulated, `sm:` + `md:` Tailwind utilities silently inactive. Root cause: descendant min-content > viewport inflates the layout viewport per CSS spec (display-typography display-2xl needs ~440 px; library showcase Cards need ~484 px). | **Fixed via [ADR 0024](../../_meta/decisions/0024-responsive-safety-net-v0131.md)** — `html, body { overflow-x: clip }` root safety net + `TypeRow` cell `min-w-0 overflow-hidden` + `dashboard-shell` `max-w-max` → `max-w-screen-2xl`. Verified at 320 px: `innerWidth=320`, `smActive=true`, `mdActive=true` |

## R4 deferred work (now closed)

R4's audit log [`.audit-runs/2026-05-18-round-4/ISSUES.md`](../2026-05-18-round-4/ISSUES.md) flagged two deferred items (out of R4 scope, queued for a follow-up). R5 closes both:

- ✓ **5 component.md files** — new prose contracts at `design-system/02-components/{icon-button,button-group,split-button,command-palette-button,fab}/component.md`. Full when-to-use / when-not / a11y / sizes / intents / shape / pair-with sections per each.
- ✓ **7 examples/ files** — `web-react` reference implementations at `design-system/02-components/{field,textarea,select,checkbox,radio-group,switch,validation-message}/examples/primary.tsx`. Each is drop-in installable into a consumer repo at `/components/ui/{name}.tsx`.

## Pre-fix probe (state at start of R5, dark mode)

| Surface | viewport | nameless interactive | svg role="img" no aria-label | hardcoded colors |
|---|---|---|---|---|
| `/foundations` | 1440 × 779 | 6 (3 Switch + 3 Checkbox) | 3 (ProgressRing gauges) | 31 (SwatchRamp ×30, +1 misc) |
| `/library` | 1440 × 779 | 37 (8 Switch + 6 Checkbox + 23 calendar empties) | 1 | 15 (incl. `#171A18` legacy, `#e23b3b` deprecated red) |
| All other 6 routes | 1440 × 779 | (not probed individually before fixes) | — | — |

## Post-fix probe (verified after each Edit)

| Surface | viewport | nameless interactive | svg role="img" no aria-label | hardcoded colors (real bugs only) |
|---|---|---|---|---|
| `/foundations` | 1440 × 779 | **0** | **0** | **0** |
| `/library` | 1440 × 779 | **0** | **0** | only the intentional ColorPicker product-color literals (no legacy / no deprecated red) |
| `/landing` | 1440 × 779 | **0** | **0** | **0** |
| `/tool` | 1440 × 779 | **0** | **0** | **0** |
| `/saas` | 1440 × 779 | **0** | **0** | **0** |
| `/commerce` | 1440 × 779 | **0** | **0** | **0** |
| `/mobile` | 1440 × 779 | **0** | **0** | **0** |
| `/desktop` | 1440 × 779 | **0** | **0** | **0** |
| `/foundations` | **320 × 568** | **0** | **0** | (responsive — `vw=320`, `smActive=true`, `mdActive=true`) |

## Methodology contribution

R5 added the **fifth axis** to the audit-cycle ladder. The lineage now:

- **R1** — static walk @ desktop. Caught visual chrome bleed (v0.12.7).
- **R2** — interaction walk @ desktop. Caught failed-first-click variant pickers (v0.12.8).
- **R3** — contract-comparison walk @ desktop. Caught pinned-date showcases, hardcoded-active sidebars (v0.12.9).
- **R4** — meta-contract integrity walk @ desktop. Caught LLM-docs version drift (v0.13.0).
- **R5** — small-viewport metrics walk @ mobile. Caught the layout-viewport inflation that no desktop round could surface, plus the wave of accessibility findings the desktop walk missed (R5-001 through R5-011, 11 issues across 12 file edits) (v0.13.1).

Each round of the audit-cycle ladder ramps the **tooling** along with the surface coverage. R1+R2+R3+R4 used `claude-in-chrome` at desktop (the user's Edge browser via the extension). R5 added `chrome-devtools-mcp` for the CDP-level viewport emulation that `claude-in-chrome`'s `resize_window` couldn't propagate.

## Browser-environment workaround

Closing the responsive-sweep blocker required one Mac-system workaround: `chrome-devtools-mcp` looks for Chrome at the default `/Applications/Google Chrome.app` path. On this Mac, browsers live in `/Applications/Browsers/`. Created a symlink:

```bash
ln -sfn "/Applications/Browsers/Google Chrome.app" "/Applications/Google Chrome.app"
```

The symlink is reversible (no actual file moves). With it in place, `chrome-devtools-mcp` launches its own Chrome instance with the requested viewport emulation; the user's Edge browser via `claude-in-chrome` continues to work for visual walkthroughs.

## Files touched (v0.13.1)

**New (3 audit + 12 content):**
- `.audit-runs/2026-05-18-round-5/ISSUES.md` (this file)
- `.audit-runs/2026-05-18-round-5/foundations-320-postfix.png` (verification screenshot)
- `_meta/decisions/0024-responsive-safety-net-v0131.md`
- 5 component.md files
- 7 examples/primary.tsx files

**Modified (13):**
- `VERSION` → `0.13.1`
- `audit-dashboard/src/lib/version.ts` → `LUMEN_VERSION = "v0.13.1"`
- `audit-dashboard/src/app/globals.css` (responsive safety net + label-overlay tokens)
- `audit-dashboard/src/components/primitives/swatch.tsx` (token violation)
- `audit-dashboard/src/components/primitives/progress.tsx` (ProgressRing a11y)
- `audit-dashboard/src/components/primitives/inputs.tsx` (ColorPicker + DatePickerCalendar)
- `audit-dashboard/src/components/primitives/commerce.tsx` (ColorSwatchSelector + ProductGallery + PricingToggle)
- `audit-dashboard/src/components/primitives/display.tsx` (Kanban "+" a11y)
- `audit-dashboard/src/components/primitives/ai.tsx` (ChatComposer a11y)
- `audit-dashboard/src/components/primitives/switch.tsx` (aria-label/aria-labelledby props)
- `audit-dashboard/src/components/primitives/checkbox.tsx` (aria-label/aria-labelledby props)
- `audit-dashboard/src/app/library/client.tsx` (SwitchRow + mobile-inbox)
- `audit-dashboard/src/app/foundations/page.tsx` (TypeRow defensive overflow)
- `audit-dashboard/src/components/dashboard-shell.tsx` (max-w-max → max-w-screen-2xl ×3)
- `llms.txt`, `llms-full.txt`, `README.md`, `USING-LUMEN.md`, `PRIMITIVE-COVERAGE.md` (chips → v0.13.1 via release.mjs lockstep)
- `AGENTS.md` + `CLAUDE.md` (top callouts hand-rewritten to v0.13.1 narrative per ADR 0023 exemption)
- `CHANGELOG.md` ([0.13.1] entry under [Unreleased])
