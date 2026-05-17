# 04-platforms — Lumen v0.13 platform translation guides

> Per-platform consumption guides for the **v0.13 component graph**. The token graph from [`01-tokens/`](../01-tokens/) and the component graph from [`02-components/`](../02-components/) translate to nine target platforms. This folder explains the API mapping, the identity budget, the glass / motion / typography translation, and the platform-specific don'ts for each.

## What ships here

| File | Platform | Distribution |
|---|---|---|
| [`web.md`](./web.md) | Web (Next.js + React + Tailwind v4) | shadcn registry (`@lumen/*` — Phase 2) |
| [`ios.md`](./ios.md) | iOS 17+ (SwiftUI, Swift 5.10+) | Swift Package + `Lumen+Colors.swift` |
| [`android.md`](./android.md) | Android (Jetpack Compose, Haze) | Kotlin module + `LumenColors.kt` |
| [`macos.md`](./macos.md) | macOS 14+ (SwiftUI, NSVisualEffectView bridge) | Same Swift Package as iOS |
| [`windows.md`](./windows.md) | Windows (Electron default, WinUI 3 documentary) | Web bundle via Electron `vibrancy: 'acrylic'` |
| [`shopify.md`](./shopify.md) | Shopify (Polaris GA + App Bridge) | `css-variables.liquid` snippet |
| [`extension.md`](./extension.md) | Browser extension (Manifest V3, shadow DOM) | Bundled CSS injected into shadow root |
| [`cli.md`](./cli.md) | CLI / TUI (Go-Lipgloss, Node-Ink) | Color constants emitted to language libs |
| [`mcp-host.md`](./mcp-host.md) | MCP server (voice & tone only) | Pattern doc, no runtime ship |
| [`responsive.md`](./responsive.md) | Responsive web (container queries) | Same Phase 2 components, different viewport rules |

## Reference implementations

Minimum-viable reference apps live under [`/examples/`](../../examples/) at the repo root:

- [`examples/ios-reference/`](../../examples/ios-reference/) — Swift Package, three surfaces (button, stat, glass popover)
- [`examples/android-reference/`](../../examples/android-reference/) — Compose with Haze, three surfaces
- [`examples/macos-reference/`](../../examples/macos-reference/) — SwiftUI macOS app, NSVisualEffectView bridge
- [`examples/extension-reference/`](../../examples/extension-reference/) — Chrome MV3 popup, shadow-DOM scoped
- [`examples/cli-go-reference/`](../../examples/cli-go-reference/) — Go + Lipgloss, `warp quote --interactive` mock
- [`examples/cli-node-reference/`](../../examples/cli-node-reference/) — Ink + chalk, same mock surface

Windows native and Shopify get no reference apps. The Windows path defaults to Electron (web bundle); the Shopify identity budget (≤15%) doesn't justify a reference. See the respective MD files for the integration pattern.

## Relationship to legacy [`03-platforms/`](../03-platforms/)

The v0.12.6 `03-platforms/` folder stays in place (additive principle — hard rule 18). Its READMEs document the v0.11.13 visual reality and remain valid for legacy consumers. `04-platforms/` is the **v0.13 canonical reference** going forward — token names align to DTCG 2025.10, glass / mesh / dual-mode flows reflect Phase 0 + 1, component names align to the Phase 2 shadcn registry.

When a consumer is on v0.13.0+, read from `04-platforms/`. When on v0.12.x, the legacy folder still applies.

## Universal rules (apply on every platform)

These re-state the hard rules from [`AGENTS.md`](../../AGENTS.md) in platform-translation form:

1. **Consume semantic tokens only — never primitives.** The Style Dictionary pipeline emits semantic-only outputs to platform-specific files. Don't reach for `LumenColors.brand800` — reach for `LumenColors.surfaceCanvas`.
2. **No hex literals in app code.** Use the platform's token API: `var(--color-surface-canvas)` on web, `LumenColors.surfaceCanvas` on iOS / Android, `{{ lumen.surface.canvas }}` in Liquid.
3. **Honor `prefers-reduced-motion` / `prefers-reduced-transparency`** on every platform that surfaces an OS-level accessibility setting. Document the per-platform API in each MD.
4. **Glass only on floating shells.** Page canvas, data tables, table rows, table cells never get glass — on any platform. (Hard rule 16.)
5. **Spring Green is the only loud accent.** Status palettes (lumen-red, lumen-amber) are pair-only. No second loud color, on any platform.
6. **Components do not branch on mode** — semantic tokens rebind under the scope. iOS / Android consumers expose the same `data-mode` analog via environment object or composition local. (Hard rule 15.)

## Token output reality

Phase 0's Style Dictionary pipeline emits everything platforms need under [`dist/`](../../dist/):

```
dist/
├── css/lumen.css                    # Web — semantic CSS variables
├── css/lumen.dark.css               # Web — dark theme rebind
├── css/lumen.expressive.css         # Web — expressive mode rebind
├── tailwind/lumen.preset.ts         # Web — Tailwind v4 preset
├── tailwind/lumen.css               # Web — Tailwind @theme inline
├── ts/tokens.ts                     # Web / React Native — TypeScript constants
├── swift/Lumen+Colors.swift         # iOS / macOS — UIColor extensions
├── ios/LumenTokens.swift            # iOS / macOS — full token class
├── ios/LumenTokensDark.swift        # iOS / macOS — dark theme variant
├── compose/LumenColors.kt           # Android — Compose Color object
├── android/colors.xml               # Android — XML colors resource
├── android/dimens.xml               # Android — XML dimensions resource
├── flutter/lumen_tokens.dart        # Flutter — Dart constants
├── liquid/css-variables.liquid      # Shopify — Liquid CSS-variable snippet
├── scss/tokens.scss                 # Universal — SCSS variables
└── json/tokens.json                 # Universal — flat JSON dump
```

`dist/` is gitignored. CI publishes to a CDN-fronted `lumen-dist` repo so platform consumers fetch built artifacts directly without running Style Dictionary themselves.

## How to read a platform MD

Every `04-platforms/<platform>.md` follows the same eight-section shape:

1. **What this platform is** — runtime, target version, which Warp products live there.
2. **Token mapping table** — Lumen semantic → platform API.
3. **Identity budget** — what percentage of pixel surface Lumen can realistically claim, what claims the rest.
4. **Glass / blur translation** — exact API mapping, fallback under reduced-transparency.
5. **Motion translation** — durations + easings + springs in the platform's idiom, reduce-motion handling.
6. **Typography translation** — Satoshi loading, OpenType feature flag coverage, what platforms can't render.
7. **Specific don'ts** — platform-specific Lumen law translations.
8. **Reference snippets** — primary button, stat, glass surface in the platform's idiom.

If you're an LLM agent retrieving a platform doc to answer "how do I render a Lumen primary button on iOS?" — read [`ios.md`](./ios.md) §8. Same shape on every platform.
