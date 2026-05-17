# extension-reference — Lumen v0.13 Chrome MV3 extension

> Chrome Manifest V3 content script that injects a Lumen-themed sidebar over carrier-portal pages (Estes, ODFL, Saia). Three surfaces inside the shadow root: primary button, stat, glass popover. Demonstrates the extension contract from [`design-system/04-platforms/extension.md`](../../design-system/04-platforms/extension.md).

## What this proves

- **Shadow DOM scoping works.** Host-page CSS (carrier portals are aggressively CSS-y) can't reach into the Lumen sidebar. `:host { all: initial }` resets baseline.
- **Lumen CSS injected at runtime.** Vite's `?inline` import bundles `lumen-tokens.css` into the content script as a string; the script appends it to a `<style>` inside the shadow root.
- **`chrome.runtime.getURL`** resolves the Satoshi woff2 URL at runtime per the MV3 web_accessible_resources contract.
- **Hard rule 9** — `.lumen-btn-primary` uses `--color-action-primary-fg` (`#07120D`), never white.
- **Hard rule 11** — focus ring via `outline` + `box-shadow` halo.
- **Hard rule 16** — glass on the popover only. The sidebar canvas, the stat, the button all stay solid.
- **LiveDot pulse** via CSS `@keyframes` with `@media (prefers-reduced-motion: reduce)` fallback.
- **Glass fallback** via `@supports not (backdrop-filter)` + `@media (prefers-reduced-transparency: reduce)`.

## Build

```bash
cd examples/extension-reference
pnpm install
pnpm build       # emits dist/{content-script.js, popup.html, manifest.json, ...}
# Then in Chrome:
#   1. Navigate to chrome://extensions
#   2. Enable "Developer mode" (top right)
#   3. Click "Load unpacked"
#   4. Select the dist/ directory
#   5. Visit a supported carrier portal (estes-express.com / odfl.com / saia.com)
#   6. The Lumen sidebar appears on the right edge of the viewport.
```

For development with auto-rebuild:
```bash
pnpm dev         # rebuilds on every source change
# Click "Reload" on the extension card in chrome://extensions after each rebuild
```

## What's NOT in this reference

- **Satoshi font files.** The `fonts/` directory holds `*.placeholder` markers. Drop the real `Satoshi-Variable.woff2` + `Satoshi-VariableItalic.woff2` at build time. ITF-FFL allows self-hosting; don't commit them to a public git repo.
- **Real icon PNGs.** Same deal — `icons/*.placeholder` markers. Drop 16/48/128px Lumen-branded PNGs at build time.
- **Tests.** A real extension would ship Playwright tests against a Puppeteer-launched Chrome with the extension loaded.
- **The Warp API integration.** The reference is static — clicking "Book shipment" sets local state. Real Warp Companion calls `https://api.warp.dev/v1/quote/...`.

## Files

```
extension-reference/
├── README.md
├── manifest.json                  # Chrome MV3 manifest
├── package.json
├── tsconfig.json
├── vite.config.ts                 # Build emits dist/
├── popup.html                     # Toolbar popup (small static UI)
├── fonts/                         # Satoshi placeholders
├── icons/                         # Icon placeholders
└── src/
    ├── content-script.tsx         # Mount + shadow DOM scoping
    ├── App.tsx                    # The sidebar component (three surfaces)
    └── lumen-tokens.css           # Vendored token subset
```

## Why MV3 + Vite (not Webpack / Parcel / esbuild)

- **MV3 IIFE constraint** — content scripts must be a single self-contained IIFE bundle. Vite's `output.format: "iife"` handles this cleanly.
- **`?inline` CSS imports** — Vite ships this primitive out of the box for stringifying CSS into the bundle, which is exactly what shadow-DOM injection needs.
- **No service-worker compat dance** — this reference doesn't ship a background service worker, but if it did, Vite's `lib` mode handles MV3 service-worker bundling without webpack-extension-config voodoo.

## Related

- [`../../design-system/04-platforms/extension.md`](../../design-system/04-platforms/extension.md) — full extension translation guide.
- [`../../design-system/04-platforms/web.md`](../../design-system/04-platforms/web.md) — content scripts are web at the renderer level; only the scoping differs.
- [Chrome MV3 docs](https://developer.chrome.com/docs/extensions/develop/migrate).
