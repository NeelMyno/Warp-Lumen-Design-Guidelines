---
name: Print + Export
type: foundation
version: 1.0.0
last_updated: 2026-05-19
audience: [designer, engineer, llm-agent]
target: WCAG-2.2-AA at print + Section 508 1194.24(a)
related: [./os-modes.md, ./color.md, ../../_meta/decisions/0030-print-export-r10-v014.md]
---

# Print + Export

> Print is the forgotten OS mode. R10 of the audit-cycle ladder formalizes how Lumen surfaces render to PDF / paper / share targets without the dashboard chrome that's meaningless off-screen. The rule: **structural content survives, decorative chrome retires, color economy adapts to print constraints.**

## TL;DR — what changes when

| Output | Triggers when | What Lumen does |
|---|---|---|
| `@media print` | User invokes File → Print, Cmd+P, browser print preview, "Save as PDF" | Nav chrome retires (sidebar, top app bar, command palette); cards expand to full width; theme forces to LIGHT (paper canvas); shadows retire in favor of 1px solid borders; the URL is rendered as printed text after every link; page breaks are honored at section boundaries |
| Export to PDF (Chromium headless, Puppeteer) | Audit-dashboard automation, programmatic snapshot | Same `@media print` rules apply; the puppeteer caller sets `displayHeaderFooter: false` so the OS browser-injected page numbers don't double up with our own |
| Export to image (PNG / JPEG snapshot) | Share-to-social, OG image generation, internal screenshot | Not strictly `@media print` — use `data-export="image"` attribute on root + a parallel CSS rule set. Shadows retire; the page renders at the actual viewport without print page-break behavior |
| Export to CSV (data tables) | DataGrid, Kanban export, Reports table | Not visual — handled by per-component export logic; format documented in [`data-visualization.md`](./data-visualization.md) |
| Share affordance (`navigator.share`) | Native Web Share API trigger from a Lumen ShareButton primitive | Triggers an OS share sheet; the surface that's shared is the canonical URL + the page metadata (title + description). No special CSS — share is a JS-level integration |

## 1. Print stylesheet — `@media print`

### Contract

When the document is being printed (or saved as PDF via browser print dialog), Lumen:

1. **Forces light theme regardless of user preference.** Paper is white. Dark mode on paper would burn through toner cartridges + look terrible. The CSS rule `@media print { :root { --surface-canvas: #FFFFFF; --text-primary: #0D0D0D; /* etc */ } }` forces the light token values.
2. **Retires dashboard chrome.** Sidebar, top app bar, command palette, FAB, tab bar — all `display: none`. The reader wants the content, not the navigation.
3. **Expands cards to full width.** Multi-column grid layouts collapse to single column for portrait-page proportions. `display: grid` blocks get `grid-template-columns: 1fr`.
4. **Retires shadows in favor of solid borders.** `box-shadow: var(--shadow-*)` → `box-shadow: none; border: 1px solid var(--border-default)`. Toner doesn't render box-shadow accurately; borders read crisply.
5. **Renders the URL after every link.** Add `a[href]:after { content: " (" attr(href) ")"; }`. The reader has lost click affordance — they need the URL to follow up.
6. **Honors page-break boundaries at section level.** `<section>` blocks get `break-inside: avoid` (don't split mid-section); `<h1>` / `<h2>` get `break-after: avoid` (don't orphan a heading at page bottom).
7. **Strips background images.** Hero images, decorative SVG backdrops retire — `background-image: none`. Foreground images and chart visualizations stay.
8. **Resets `position: sticky` and `position: fixed`.** Sticky headers, floating buttons would either tile on every page or break layout — switch to `position: static`.
9. **Drops `prefers-reduced-motion` overrides as moot.** Animation doesn't print.
10. **Spring Green accent stays as a brand cue.** The action surface (CTAs, status pills, brand chrome) keeps its hex value — print rendering will desaturate it slightly but it survives as a brand signal. Spring Green at 100% saturation prints as a clean accent on white.

### Where this lives in Lumen

`audit-dashboard/src/app/globals.css` — new `@media print` block (R10, v0.14.0). The block re-binds:

```css
@media print {
  /* Force light theme regardless of data-theme attribute */
  :root,
  [data-theme="dark"] {
    --surface-canvas: #FFFFFF;
    --surface-page: #FFFFFF;
    --surface-raised: #FFFFFF;
    --text-primary: #0D0D0D;
    --text-secondary: #404040;
    --text-tertiary: #6B6B6B;
    --border-default: #C8C8C8;
    --border-hairline: #C8C8C8;
    color-scheme: light;
  }
  /* Hide dashboard chrome */
  header[role="banner"],
  nav[role="navigation"],
  aside[role="complementary"],
  [data-lumen-fab],
  [data-lumen-command-palette],
  [data-lumen-tab-bar] {
    display: none !important;
  }
  /* Cards expand to full width; grids collapse */
  [class*="grid-cols-"] {
    display: block !important;
  }
  [data-lumen-card] {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  /* Shadows retire, borders solidify */
  * {
    box-shadow: none !important;
  }
  /* URL after links */
  a[href^="http"]:after {
    content: " (" attr(href) ")";
    font-size: 90%;
    color: #404040;
  }
  /* Don't print URLs for internal anchor links — they're meaningless on paper */
  a[href^="#"]:after { content: none; }
  /* Page-break honors */
  section { page-break-inside: avoid; break-inside: avoid; }
  h1, h2, h3 { page-break-after: avoid; break-after: avoid; }
  /* Position-sticky / fixed retire */
  [class*="sticky"],
  [class*="fixed"] {
    position: static !important;
  }
}
```

### Audit probe

```bash
# Chrome DevTools: Lighthouse → Settings → Emulation tab → "Emulate CSS media type: print"
# Or via the print dialog: Cmd+P / Ctrl+P → "Save as PDF" → inspect output

# Headless puppeteer print-to-PDF test:
node -e "
import puppeteer from 'puppeteer';
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000/foundations');
await page.pdf({ path: 'foundations.pdf', format: 'A4', printBackground: false });
await browser.close();
"
```

## 2. Export to image — `data-export="image"`

For social-share / OG-image / programmatic screenshot generation, the route can be rendered at a fixed viewport with `<html data-export="image">`. CSS rules under `[data-export="image"]` mirror the print stylesheet's chrome-retirement but keep the actual viewport (no portrait-page assumptions, no page-break logic).

```css
[data-export="image"] {
  /* Reuse print's chrome retirement but at the original viewport */
  header[role="banner"],
  nav[role="navigation"] { display: none; }
  /* Keep shadows so the surface chrome reads in the screenshot */
  /* (the contract is "looks like the live page", minus nav) */
}
```

Caller pattern (puppeteer):
```js
await page.evaluate(() => document.documentElement.setAttribute('data-export', 'image'));
await page.screenshot({ path: 'foundations.png', fullPage: true });
```

## 3. Export to CSV — DataGrid, Kanban, Reports

Visual export is not the concern; the data structure is. Lumen primitives that expose tabular data (`DataTable`, `DataGrid`, `Kanban`, future `Reports`) ship an `onExport?: (format: 'csv' | 'json') => void` prop. The default implementation:
- CSV: header row + data rows; UTF-8 BOM for Excel compatibility; date/number/currency formatted per the page's locale (i18n contract — see [`internationalization.md`](./internationalization.md))
- JSON: data array, no headers
- The export trigger lives in the primitive's toolbar — see the canonical `<Toolbar>` primitive and the `DataGrid` `examples/primary.tsx` for the wiring

## 4. Share affordance — `navigator.share` + ShareButton

Lumen ships a `<ShareButton>` primitive (referenced in micro-interactions.md as a peak moment) that uses the Web Share API:
```tsx
<ShareButton 
  title="Lumen v0.14.0 — R10 print + export"
  text="The print stylesheet contract for the Warp design system."
  url="https://design.warp.com/lumen/v0.14/foundations/print"
/>
```

When `navigator.share` is unavailable (Firefox desktop, some browsers), `<ShareButton>` falls back to a copy-link affordance + toast confirmation. The fallback's CSS is in `feedback.tsx` Toast styling.

## 5. R10 verification checklist

When auditing a new surface for print + export compliance:

| # | Check | How |
|---|---|---|
| R10-1 | Print preview shows the content, not the chrome | Cmd+P on the route; verify nav chrome retires, content expands |
| R10-2 | Theme forces to light under print regardless of `data-theme="dark"` | Cmd+P on dark-theme dashboard; verify white background, dark text |
| R10-3 | Cards don't split across pages | Cmd+P on `/foundations`; verify each typography sample stays on one page |
| R10-4 | URLs print after external links | Cmd+P on `/foundations`; verify `<a href="https://...">Foo</a>` prints as "Foo (https://...)" |
| R10-5 | Shadows retire in favor of borders | Inspect print preview; verify visual structure via crisp 1px borders |
| R10-6 | Spring Green accent survives as a brand cue | Print a route with primary buttons; verify spring green prints (slightly desaturated by toner but visible) |
| R10-7 | Position sticky/fixed retire to static | Cmd+P with a scrolled dashboard; verify header doesn't tile on every page |
| R10-8 | data-export="image" produces a viewport-fit screenshot | Run puppeteer screenshot with attribute set; verify chrome retires but viewport stays |
| R10-9 | DataGrid/Kanban CSV export emits UTF-8 BOM | Open exported CSV in Excel; verify special chars render correctly |
| R10-10 | ShareButton falls back to copy-link when Web Share API unavailable | Test on Firefox desktop; verify fallback triggers + toast confirms |

## 6. Cross-references

- WCAG 2.2 Success Criterion 1.4.5 (Images of Text) — Lumen prints live text, not images of text
- Section 508 1194.24(a) — Television content captioning (analog for screen-reader-readable print content)
- CSS Paged Media Level 3 — `@page`, `break-inside`, `break-after`, `widows`, `orphans`
- Chrome DevTools — Lighthouse Emulation tab for "Emulate CSS media type: print"
- Puppeteer `page.pdf()` API — print-to-PDF programmatic export
- Lumen ADR 0030 — R10 round of the audit-cycle ladder (v0.14.0)
- Lumen [`./os-modes.md`](./os-modes.md) — sibling R9 OS-mode contract (reduced-motion, high-contrast, forced-colors)
- Lumen [`./data-visualization.md`](./data-visualization.md) — chart / dataviz export contract (PNG, SVG, CSV)

## 7. Open questions (deliberately deferred)

- **`@page` margins** — Lumen currently uses browser-default print margins. A `@page { margin: 1in 0.75in; }` declaration would standardize margins across paper sizes. Carried to R10.1.
- **Per-page headers / footers** — Browser-injected (URL, page number, date) vs Lumen-controlled. Currently browser-default. Carried to R10.2.
- **Multi-column print layouts** — Long documents (e.g., printed CHANGELOG, printed component contracts) could benefit from 2-column print layouts. Out of scope for R10; would be a separate print-layout primitive.
- **Print preview emulation in CI** — Headless Chromium can `--print-to-pdf` for verification but the audit-dashboard isn't yet wired into a print-test pipeline. Carried to R10.3 + the Testing infrastructure round.
- **Saved-state restoration after print** — The `data-export="image"` pattern modifies `data-` attributes; if the user navigates back without page reload, the attribute persists. Cleanup happens automatically on next page load but a per-component cleanup hook would be tighter. Carried to R10.4.
