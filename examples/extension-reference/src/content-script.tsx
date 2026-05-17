/**
 * content-script.tsx — Chrome MV3 content script that injects a Lumen-themed
 * sidebar over the host carrier-portal page (Estes, ODFL, Saia).
 *
 * Demonstrates the extension contract from design-system/04-platforms/extension.md:
 *  - Shadow DOM scoping (`:host { all: initial }` prevents host CSS bleed-in)
 *  - Lumen CSS injected into the shadow root via Vite ?inline import
 *  - Satoshi font URL resolved at runtime via chrome.runtime.getURL
 *  - prefers-reduced-motion / prefers-reduced-transparency honored via @media
 */

import { createRoot } from "react-dom/client";
import App from "./App";
import lumenTokensCss from "./lumen-tokens.css?inline";

(function mountWarpCompanion() {
    if (document.getElementById("warp-lumen-extension-root")) return;

    // 1. Host element
    const host = document.createElement("div");
    host.id = "warp-lumen-extension-root";
    document.body.appendChild(host);

    // 2. Shadow root
    const shadow = host.attachShadow({ mode: "open" });

    // 3. Inject Lumen CSS — :host { all: initial } resets host-page bleed
    const fontUrl = chrome.runtime.getURL("fonts/Satoshi-Variable.woff2");
    const styles = document.createElement("style");
    styles.textContent = `
        @font-face {
            font-family: 'Satoshi Variable';
            src: url('${fontUrl}') format('woff2');
            font-weight: 300 900;
            font-display: swap;
        }
        ${lumenTokensCss}
    `;
    shadow.appendChild(styles);

    // 4. React mount target inside the shadow tree
    const mount = document.createElement("div");
    shadow.appendChild(mount);
    createRoot(mount).render(<App />);
})();
