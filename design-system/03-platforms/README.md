# Platforms — Lumen

> Per-platform consumption guides. Tokens live in `01-tokens/`; components live in `02-components/`. This folder explains HOW to consume Lumen on each target.

## Supported platforms

| Platform | Status | Distribution |
|---|---|---|
| [Web (Next.js + React + Tailwind v4)](./web-react/README.md) | stable | shadcn registry |
| [React Native (NativeWind)](./react-native/README.md) | stable | shadcn-style copy |
| [iOS native (SwiftUI)](./ios-native/README.md) | stable | Swift Package |
| [Android native (Jetpack Compose)](./android-native/README.md) | stable | Kotlin module |
| [Desktop · macOS (SwiftUI / AppKit)](./desktop-mac/README.md) | beta | Swift Package shared with iOS |
| [Desktop · Windows (WinUI 3)](./desktop-windows/README.md) | beta | XAML + JSON tokens |
| [Shopify Liquid](./shopify-liquid/README.md) | stable | css-variables.liquid snippet |
| [BigCommerce Stencil](./bigcommerce-stencil/README.md) | beta | tokens.scss include |
| [WooCommerce / WordPress](./woo-wordpress/README.md) | beta | enqueue tokens.css |

## Universal rules

These apply on every platform.

1. **Consume only semantic tokens** — never primitives. The build pipeline emits semantic-only outputs to platform-specific files.
2. **Keep components in sync with the spec.** When the spec changes, the example must update. CI verifies.
3. **Honor accessibility floor** (WCAG 2.2 AA) on every platform — see `00-foundations/accessibility.md`.
4. **Honor reduced-motion** — every platform exposes a system preference; respect it.
5. **No raw hex/px in component code.** Use the platform's token API (CSS var, Swift constant, Kotlin object, Liquid var).

## Build outputs you'll need

```
dist/
├── css/lumen.css                    # Web — global CSS variables (restrained default)
├── css/lumen.dark.css               # Web — dark-theme overrides
├── css/lumen.expressive.css         # Web — [data-mode="expressive"] rebinds (v0.13)
├── tailwind/lumen.css               # Web — Tailwind v4 @theme
├── tailwind/lumen.preset.ts         # Web — Tailwind preset (non-CSS-import consumers)
├── ts/tokens.ts                     # Web / RN — TypeScript constants
├── ios/LumenTokens.swift            # iOS / macOS — Swift class
├── swift/Lumen+Colors.swift         # iOS — color-only extension for granular import
├── android/colors.xml + dimens.xml  # Android — XML resources
├── compose/LumenColors.kt           # Android — Compose Color object
├── flutter/lumen_tokens.dart        # Flutter (future)
├── liquid/css-variables.liquid      # Shopify — CSS-in-Liquid
├── scss/tokens.scss                 # SCSS pipelines
└── json/tokens.json                 # Universal flat JSON
```

`dist/` is gitignored. CI publishes built outputs to a separate `lumen-dist` repo (or CDN) so platform consumers don't need to run Style Dictionary.

_v0.13 note: the output directory was renamed `_build/` → `dist/` per Phase 0 of the v0.13 refactor; consumers updating from v0.12 should swap `_build/` paths for `dist/` paths._
