---
name: Browser extension (Manifest V3 · shadow DOM)
type: platform-guide
platform: extension
runtime: Chrome MV3 · Firefox WebExt · Edge add-on · shadow DOM scoping
lumen_version: 0.13.0
last_updated: 2026-05-17
status: stable
related: [./web.md, ../00-foundations/modes.md]
---

# Browser extension — Lumen v0.13 platform guide

> Manifest V3 (Chrome / Edge / Brave) and WebExtensions (Firefox) content scripts inject Lumen UI into host pages. Every Lumen rule scopes under a shadow root so host-page CSS doesn't leak in, and Lumen CSS doesn't leak out.

## 1. What this platform is

The browser extension is the **carrier-portal scrape-and-overlay surface** — the Warp Companion extension that turns 10 legacy carrier portals into one Lumen surface. The products that live here:

- **Warp Companion (Chrome / Edge)** — drop-in extension that overlays a Lumen sidebar on carrier portals (Estes, ODFL, Saia, FedEx Freight, ABF, etc.) so dispatchers don't switch tabs. The bulk of extension surface area.
- **Lane-rate browser plugin** — quick rate-check overlay on any freight quote page.
- **BOL signature extension** — capture-and-sign workflow on PDF-rendered BOLs in the browser.
- **Tracking overlay** — injects Warp tracking into Shopify storefronts the merchant hasn't yet themed.

## 2. Token mapping table

Lumen tokens carry verbatim inside the shadow root. The shadow root creates a CSS sandbox: host-page CSS cannot reach in, Lumen CSS cannot reach out. Token consumption is identical to web — but with three structural differences:

1. **CSS is bundled into the extension package and injected programmatically**, not linked from a stylesheet URL.
2. **The `:host` element resets** with `all: initial` to neutralize host-page CSS inheritance.
3. **CSS variables defined on `:host` (rather than `:root`)** so they scope to the shadow tree.

### Wiring pattern

```ts
// content-script.ts
import { createRoot } from "react-dom/client";
import LumenStyles from "@lumen/tokens/lumen.css?inline";  // Vite ?inline import
import LumenScopingStyles from "@lumen/tokens/lumen-scoping.css?inline";

// 1. Create the host element on the page
const host = document.createElement("div");
host.id = "warp-lumen-extension-root";
host.style.position = "fixed";
host.style.top = "0";
host.style.right = "0";
host.style.zIndex = "2147483647";  // Max int, so we sit above host UI
document.body.appendChild(host);

// 2. Attach a shadow root
const shadow = host.attachShadow({ mode: "open" });

// 3. Inject Lumen CSS into the shadow root
const style = document.createElement("style");
style.textContent = `
    :host { all: initial; }
    ${LumenStyles}
    ${LumenScopingStyles}
`;
shadow.appendChild(style);

// 4. React mount target inside the shadow tree
const container = document.createElement("div");
shadow.appendChild(container);
createRoot(container).render(<LumenExtensionApp />);
```

### Token availability inside the shadow tree

| Token category | Status in shadow root | Notes |
|---|---|---|
| Color (`--surface-*`, `--text-*`, `--border-*`, `--action-*`) | ✓ Full | Defined in injected lumen.css, inherits through the shadow tree. |
| Spacing (`--space-*`, `--size-*`) | ✓ Full | Same. |
| Radius (`--radius-*`) | ✓ Full | |
| Elevation (`--shadow-*`) | ✓ Full | |
| Motion (`--motion-duration-*`, `--motion-easing-*`) | ✓ Full | |
| Typography (`--type-*`, `--font-sans`) | ✓ Full | Satoshi must be loaded via the extension's web_accessible_resources (see §6). |
| Glass (`--glass-*`) | ✓ Full | backdrop-filter works inside shadow roots. |
| Mesh / noise (expressive only) | ✓ Full | Lumen scope CSS works. |

### Mode scoping inside the shadow root

The Lumen `<ModeScope>` primitive works inside the shadow tree. Default mode is `restrained` (an extension overlay shouldn't be visually loud). Switch to `expressive` only for narrowly-scoped overlays (an onboarding tutorial overlay, a celebration moment).

## 3. Identity budget

**Lumen claim inside the shadow root: 100% of the shadow tree's surface area.** That's the point — the shadow root is a sealed Lumen surface.

**Lumen claim of the host page's pixel area** depends on how the extension paints:

- **Sidebar overlay** — Lumen claims a strip on the right (or left) of the viewport, typically 320–400px wide. ~20–30% of viewport on desktop.
- **Modal overlay** — Lumen claims a centered card during specific moments. ~10–15% of viewport on average; 100% momentarily.
- **Inline injection** — Lumen claims a tiny widget injected into the host page DOM (e.g., a "Quote this lane" button next to the host's "Get rate" button). <2% of pixels.
- **Action button replacement** — Lumen replaces a single host-page button with a Lumen-styled equivalent (highest-leverage carrier-portal scenario). <1% of pixels.

## 4. Glass / blur translation

`backdrop-filter` works inside shadow roots in all modern Chromium / WebKit / Firefox builds. The Lumen Phase 1 lumen-scoping.css carries verbatim — `@supports not (backdrop-filter)` fallback, `@media (prefers-reduced-transparency: reduce)` fallback, all wired.

```css
:host {
    --surface-glass-fallback: var(--surface-raised);
}

.lumen-glass {
    background: var(--surface-glass);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
}

@supports not (backdrop-filter: blur(20px)) {
    .lumen-glass {
        background: var(--surface-glass-fallback);
        backdrop-filter: none;
    }
}

@media (prefers-reduced-transparency: reduce) {
    .lumen-glass {
        background: var(--surface-glass-fallback);
        backdrop-filter: none;
    }
}
```

### Glass on host page content

When the extension paints a glass overlay (sidebar, modal), `backdrop-filter` samples whatever the host page is rendering beneath. This is the killer feature for the carrier-portal use case — the Lumen sidebar shows a softly blurred Estes / ODFL / Saia page beneath, so dispatchers see context without distraction. Honor the floating-shell rule (hard rule 16): glass only on overlay surfaces, never on dense data tables inside the overlay.

### Constraint — host page CSS overrides

The host page's `* { all: initial }` reset doesn't apply to the shadow tree (`:host { all: initial }` does the reverse — resets Lumen against the host). But the host page might apply `iframe`-level transforms or filters that propagate to the shadow root. Defensive pattern:

```css
:host {
    all: initial;
    /* Re-establish baseline Lumen visual contract */
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: var(--type-14);
    line-height: var(--leading-normal);
}
```

## 5. Motion translation

Same as web — `@media (prefers-reduced-motion: reduce)` honored, all five durations + six easings + two springs work in CSS / Framer Motion / @lumen/motion.

One extension-specific caveat: **don't animate the extension overlay's appearance with anything more than `motion.duration.fast` (140ms)**. Extension overlays should feel instant — users invoked them, they want to act. A slow fade-in feels like the extension is buffering.

```css
.lumen-extension-overlay {
    animation: extension-appear var(--motion-duration-fast) var(--motion-easing-decelerate) both;
}

@keyframes extension-appear {
    from { opacity: 0; transform: translateX(8px); }
    to { opacity: 1; transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
    .lumen-extension-overlay {
        animation: none;
    }
}
```

## 6. Typography translation

### Loading Satoshi

Bundle Satoshi files in the extension package under `web_accessible_resources`:

```json
// manifest.json (Chrome MV3)
{
    "manifest_version": 3,
    "name": "Warp Companion",
    "version": "0.13.0",
    "web_accessible_resources": [
        {
            "resources": [
                "fonts/Satoshi-Variable.woff2",
                "fonts/Satoshi-VariableItalic.woff2"
            ],
            "matches": ["<all_urls>"]
        }
    ]
}
```

Inject the `@font-face` declaration into the shadow root via the styles bundle:

```css
@font-face {
    font-family: 'Satoshi Variable';
    src: url('chrome-extension://__MSG_@@extension_id__/fonts/Satoshi-Variable.woff2') format('woff2');
    font-weight: 300 900;
    font-style: normal;
    font-display: swap;
}
```

For cross-browser portability, use the runtime URL resolution:

```ts
const fontUrl = chrome.runtime.getURL('fonts/Satoshi-Variable.woff2');
// inject @font-face with this URL into the shadow root styles
```

### OpenType features

Identical to web. `font-feature-settings: 'tnum' 1, 'lnum' 1, 'zero' 1` works inside the shadow tree.

### What carries / what doesn't

| Capability | Status |
|---|---|
| Variable font weight | ✓ Full |
| Italic VF | ✓ Full |
| OpenType features | ✓ Full |
| Dynamic Type / OS font scaling | ◐ Browser-level zoom honored; Lumen body sizes stay fixed at spec |
| Subpixel rendering | ✓ Browser-default |

## 7. Specific don'ts (Extension Lumen Law)

- **Don't render Lumen UI outside a shadow root.** Without the shadow root, host-page CSS will mangle Lumen layout, and Lumen CSS will leak onto the host page. Both directions break.
- **Don't use absolute URLs to bundled assets.** Use `chrome.runtime.getURL(...)` (Chrome / Edge) or `browser.runtime.getURL(...)` (Firefox) to resolve at runtime.
- **Don't store Lumen state in `localStorage` or `sessionStorage`** on the host page's origin. Use `chrome.storage.local` so the host page can't read it.
- **Don't ship a content script that paints on EVERY page** (`matches: ["<all_urls>"]`). Scope to specific carrier-portal hosts via manifest. The user explicitly opted into Warp Companion on those hosts.
- **Don't use `eval` or `Function()`** in content scripts — MV3's CSP forbids it. Most React / Vite / Webpack bundles need a tweak to avoid these.
- **Don't paint into the host page's main DOM tree.** Lumen lives in the shadow root only. If a feature requires modifying host-page DOM (e.g., replacing a host button), use a Mutation Observer + targeted replacement; never broad mutations.
- **Don't run the LiveDot pulse animation when the user is on a slow / mobile connection.** Extensions are often heavy; the pulse loop is one more rAF tick. Detect via `navigator.connection.effectiveType` and pause on `slow-2g` / `2g`.
- **Don't ship `prefers-color-scheme` toggles inside the extension shadow root.** The Lumen dark canvas is the contract. Carrier portals are bright white; a Lumen sidebar on a bright host is a strong visual moment and a feature, not a problem.

## 8. Reference snippets

### Extension entry point (content-script + shadow-DOM mount)

```ts
// src/content-script.ts
import { createRoot } from "react-dom/client";
import App from "./App";
import lumenCss from "@lumen/tokens/lumen.css?inline";
import lumenScopingCss from "@lumen/tokens/lumen-scoping.css?inline";

(function mountWarpCompanion() {
    if (document.getElementById("warp-lumen-extension-root")) return;

    const host = document.createElement("div");
    host.id = "warp-lumen-extension-root";
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });

    const fontUrl = chrome.runtime.getURL("fonts/Satoshi-Variable.woff2");
    const styles = document.createElement("style");
    styles.textContent = `
        :host {
            all: initial;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 360px;
            z-index: 2147483647;
            font-family: 'Satoshi Variable', system-ui, sans-serif;
            color: var(--text-primary);
        }
        @font-face {
            font-family: 'Satoshi Variable';
            src: url('${fontUrl}') format('woff2');
            font-weight: 300 900;
            font-display: swap;
        }
        ${lumenCss}
        ${lumenScopingCss}
    `;
    shadow.appendChild(styles);

    const mount = document.createElement("div");
    shadow.appendChild(mount);
    createRoot(mount).render(<App />);
})();
```

### Sidebar surface (Lumen contract inside the shadow tree)

```tsx
import { Stat, LiveDot, Button } from "@lumen/...";

export default function SidebarApp() {
    return (
        <div style={{
            height: "100vh",
            background: "var(--surface-canvas)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 16,
            color: "var(--text-primary)",
        }}>
            <header style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LiveDot status="live" />
                <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                }}>
                    WARP COMPANION
                </span>
            </header>

            <Stat value="$2,840" label="QUOTE · LAX→SFO · 12 pallets" />

            <Button intent="primary" size="lg">Book shipment</Button>
        </div>
    );
}
```

A complete reference extension (Chrome MV3) with these surfaces lives at [`examples/extension-reference/`](../../examples/extension-reference/). Load the unpacked extension via `chrome://extensions → Load unpacked`.

## Related

- [`./web.md`](./web.md) — content scripts are web at the renderer level; only the scoping differs.
- [`../../examples/extension-reference/`](../../examples/extension-reference/) — Chrome MV3 reference.
- [`../00-foundations/modes.md`](../00-foundations/modes.md) — mode scoping inside the shadow tree.
