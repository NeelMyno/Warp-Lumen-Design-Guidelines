# Phase 10 — Surface-page mode-toggle screenshot pairs

> 16 PNGs (8 routes × 2 modes) that prove the v0.13.4 retrofit. The visual record ships with the phase report — the operator opens this folder, sees 16 PNGs, and can verify the visual change without spinning up the dev server.

## Status: operator-side capture pending

Per Phase 10 prompt §"Group F", the PNGs are captured via
[`tools/capture-mode-screenshots.ts`](../../../tools/capture-mode-screenshots.ts) which uses Playwright
**headed mode** for accurate Satoshi font rendering (Chrome on macOS == operator's
runtime). The script needs Playwright Chromium materialized in `node_modules`
(~200 MB binary), which is deferred to operator-side per the same `pnpm install`
gate that defers the Lighthouse runner (Phase 1) and the gpt-image-2 PNG
materialization (Phase 4).

## How to capture

```bash
# 1. Install Playwright + binaries (one-time)
cd audit-dashboard
pnpm install
pnpm exec playwright install chromium

# 2. Boot the dev server (separate shell)
pnpm dev

# 3. From repo root: capture the 16 PNGs
cd ..
pnpm capture-screenshots
```

After the third command finishes you'll see 16 files in this folder:

```
foundations-restrained.png        foundations-expressive.png
library-restrained.png            library-expressive.png
saas-restrained.png               saas-expressive.png
landing-restrained.png            landing-expressive.png
tool-restrained.png               tool-expressive.png
commerce-restrained.png           commerce-expressive.png
mobile-restrained.png             mobile-expressive.png
desktop-restrained.png            desktop-expressive.png
```

## How to verify visual change in-browser (manual smoke test)

The Playwright pixel-diff test is the automated proof. Manual verification:

1. `cd audit-dashboard && pnpm dev`
2. Open <http://localhost:3000/foundations> in Chrome
3. Click the **Restrained / Expressive** chip in the chrome utility row (top-right)
4. The hero panel — the `Foundations. Tuned.` brutalist frame — should transition from flat obsidian to aurora-spring mesh + 8% Spring Green wash + 8% feTurbulence grain in ≤ 200ms
5. Repeat for `/library`, `/saas`, `/landing`, `/tool`, `/commerce`, `/mobile`, `/desktop`

## What the screenshots demonstrate

Each pair captures the **viewport** (not full page) so the hero is above the fold.
The expressive screenshot should show:

- **Aurora-spring mesh** — three soft radial-gradient blobs (Spring Green + deep teal + deep indigo) at 8% over obsidian
- **Atmospheric wash** — 8% Spring Green tint layered on top
- **Noise grain** — 8% SVG `<feTurbulence>` fractalNoise (visible as subtle film grain, not pixelation)
- **Same content** — eyebrow + H1 + description (or sectional layout for foundations) — unchanged JSX

The restrained screenshot should look **identical to the v0.12.6 visual** — flat obsidian, no mesh, no atmosphere, no grain. The mode toggle truly is a zero-cost preserved state when restrained.
