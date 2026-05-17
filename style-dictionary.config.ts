/**
 * Style Dictionary v5 configuration for Lumen.
 *
 * Source: DTCG JSON in /design-system/01-tokens/{primitives,semantic,components,modes}/.
 * Outputs (v0.13 — `dist/` per master doc Phase 0):
 *   - dist/css/lumen.css           — :root + [data-mode='restrained'] CSS variables
 *   - dist/css/lumen.dark.css      — [data-theme='dark'] + dark mode rebind
 *   - dist/tailwind/lumen.css      — Tailwind v4 @theme inline block
 *   - dist/tailwind/lumen.preset.ts — Tailwind v4 preset re-export
 *   - dist/swift/Lumen+Colors.swift (and friends — single LumenTokens.swift for Phase 0)
 *   - dist/compose/LumenColors.kt  (single LumenTokens.kt for Phase 0)
 *   - dist/json/tokens.json        — flattened key→value map
 *   - dist/ts/tokens.ts            — TS const declarations
 *   - dist/ios/LumenTokens.swift   — legacy iOS path
 *   - dist/android/colors.xml + dimens.xml
 *   - dist/flutter/lumen_tokens.dart
 *   - dist/liquid/css-variables.liquid
 *   - dist/scss/tokens.scss
 *
 * The v0.12.6 `_build/` path is retired in v0.13 per the master doc; the gitignore
 * keeps it covered for any local stragglers. Component example tsx comments still
 * mention `_build/` — those are stale documentation, scheduled for Phase 2 cleanup.
 *
 * Phase 0 alias-namespace tokens (`color.obsidian.*`, `color.spring.*`,
 * `color.lumen-red.*`, `color.lumen-amber.*`) emit alongside the existing
 * `color.brand.*` / `color.accent.*` / `color.status.danger.*` /
 * `color.status.warning.*`. Both namespaces ship — no breaking changes for v0.12.6
 * consumers.
 *
 * Run: pnpm tokens
 */

import StyleDictionary from "style-dictionary";

// Style Dictionary v5 has native DTCG (Design Tokens Community Group) support,
// so the @tokens-studio/sd-transforms preprocessor (which targets SD v4) is not needed.

const sourceGlob = "design-system/01-tokens/**/*.tokens.json";

const verboseLog = process.argv.includes("--verbose")
  ? { log: { verbosity: "verbose" as const } }
  : {};

const lightConfig = {
  ...verboseLog,
  source: [
    sourceGlob,
    "!design-system/01-tokens/semantic/color.dark.tokens.json",
    "!design-system/01-tokens/semantic/color.hc-light.tokens.json",
    "!design-system/01-tokens/semantic/color.hc-dark.tokens.json",
    "!design-system/01-tokens/modes/expressive.tokens.json",
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "dist/css/",
      files: [
        {
          destination: "lumen.css",
          format: "css/variables",
          options: {
            selector:
              ":root, [data-mode='restrained'], [data-mood='quiet-industrial']",
          },
        },
      ],
    },
    tailwind: {
      transformGroup: "css",
      buildPath: "dist/tailwind/",
      files: [
        {
          destination: "lumen.css",
          format: "css/variables",
          options: { selector: "@theme inline" },
        },
      ],
    },
    "tailwind-preset": {
      transformGroup: "js",
      buildPath: "dist/tailwind/",
      files: [
        {
          destination: "lumen.preset.ts",
          format: "javascript/es6",
        },
      ],
    },
    ts: {
      transformGroup: "js",
      buildPath: "dist/ts/",
      files: [
        { destination: "tokens.ts", format: "typescript/es6-declarations" },
      ],
    },
    ios: {
      transformGroup: "ios-swift",
      buildPath: "dist/ios/",
      files: [
        {
          destination: "LumenTokens.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenTokens" },
        },
      ],
    },
    swift: {
      transformGroup: "ios-swift",
      buildPath: "dist/swift/",
      files: [
        {
          destination: "Lumen+Colors.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenColors" },
        },
      ],
    },
    android: {
      transformGroup: "android",
      buildPath: "dist/android/",
      files: [
        { destination: "colors.xml", format: "android/colors" },
        { destination: "dimens.xml", format: "android/dimens" },
      ],
    },
    compose: {
      transformGroup: "compose",
      buildPath: "dist/compose/",
      files: [
        {
          destination: "LumenColors.kt",
          format: "compose/object",
          options: {
            className: "LumenColors",
            packageName: "dev.warp.lumen",
          },
        },
      ],
    },
    flutter: {
      transformGroup: "flutter",
      buildPath: "dist/flutter/",
      files: [
        {
          destination: "lumen_tokens.dart",
          format: "flutter/class.dart",
          options: { className: "LumenTokens" },
        },
      ],
    },
    liquid: {
      transformGroup: "css",
      buildPath: "dist/liquid/",
      files: [
        {
          destination: "css-variables.liquid",
          format: "css/variables",
          options: { selector: ":root" },
        },
      ],
    },
    scss: {
      transformGroup: "scss",
      buildPath: "dist/scss/",
      files: [{ destination: "tokens.scss", format: "scss/variables" }],
    },
    json: {
      transformGroup: "js",
      buildPath: "dist/json/",
      files: [{ destination: "tokens.json", format: "json/flat" }],
    },
  },
};

const darkConfig = {
  source: [
    "design-system/01-tokens/primitives/**/*.tokens.json",
    "design-system/01-tokens/semantic/color.dark.tokens.json",
    "design-system/01-tokens/semantic/space.tokens.json",
    "design-system/01-tokens/semantic/type.tokens.json",
    "design-system/01-tokens/semantic/motion.tokens.json",
    "design-system/01-tokens/semantic/radius.tokens.json",
    "design-system/01-tokens/semantic/shadow.tokens.json",
    "design-system/01-tokens/semantic/surface.tokens.json",
    "design-system/01-tokens/semantic/text.tokens.json",
    "design-system/01-tokens/semantic/border.tokens.json",
    "design-system/01-tokens/semantic/action.tokens.json",
    "design-system/01-tokens/components/**/*.tokens.json",
    "design-system/01-tokens/modes/restrained.tokens.json",
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "dist/css/",
      files: [
        {
          destination: "lumen.dark.css",
          format: "css/variables",
          options: {
            selector:
              "[data-theme='dark'], [data-mode='restrained'][data-theme='dark']",
          },
        },
      ],
    },
    tailwind: {
      transformGroup: "css",
      buildPath: "dist/tailwind/",
      files: [
        {
          destination: "lumen.dark.css",
          format: "css/variables",
          options: { selector: "[data-theme='dark']" },
        },
      ],
    },
    ios: {
      transformGroup: "ios-swift",
      buildPath: "dist/ios/",
      files: [
        {
          destination: "LumenTokensDark.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenTokensDark" },
        },
      ],
    },
  },
};

const expressiveConfig = {
  source: [
    "design-system/01-tokens/primitives/**/*.tokens.json",
    "design-system/01-tokens/semantic/**/*.tokens.json",
    "!design-system/01-tokens/semantic/color.dark.tokens.json",
    "!design-system/01-tokens/semantic/color.hc-light.tokens.json",
    "!design-system/01-tokens/semantic/color.hc-dark.tokens.json",
    "design-system/01-tokens/modes/expressive.tokens.json",
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "dist/css/",
      files: [
        {
          destination: "lumen.expressive.css",
          format: "css/variables",
          options: { selector: "[data-mode='expressive']" },
        },
      ],
    },
  },
};

async function build() {
  for (const config of [lightConfig, darkConfig, expressiveConfig]) {
    const sd = new StyleDictionary(config);
    await sd.buildAllPlatforms();
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
