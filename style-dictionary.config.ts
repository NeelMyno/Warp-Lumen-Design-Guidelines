/**
 * Style Dictionary v5 configuration for Lumen.
 *
 * Source: DTCG JSON in /design-system/01-tokens/{primitives,semantic,components}/.
 * Outputs: /_build/{css,tailwind,ts,ios,android,compose,flutter,liquid,json}/...
 *
 * Run: pnpm build
 */

import StyleDictionary from "style-dictionary";
import { globSync } from "@bundled-es-modules/glob";

// Style Dictionary v5 has native DTCG (Design Tokens Community Group) support,
// so the @tokens-studio/sd-transforms preprocessor (which targets SD v4) is not needed.
// If you later round-trip tokens through Tokens Studio in Figma, add it back and
// downgrade style-dictionary to v4 OR upgrade sd-transforms to a SD-v5-compatible version.

// v0.13.3 (ADR 0026) — pre-resolve the source list explicitly.
// SD v5's lib/utils/combineJSON.js runs `globSync(pattern)` per source-array entry
// individually, then concatenates. The `!negative` exclusion syntax does NOT survive
// — globSync treats `!` as a literal character and the main `**/*.tokens.json` glob
// keeps pulling the excluded files. So we resolve once here, filter by file path,
// and pass an explicit file list to SD. Same fix for both lightConfig + darkConfig.
const ALL_TOKEN_FILES = globSync("design-system/01-tokens/**/*.tokens.json").sort();
const isDarkOrHC = (f: string) =>
  /\/(color\.dark|color\.hc-(?:light|dark))\.tokens\.json$/.test(f);
const isLightOrInvariant = (f: string) =>
  /\/(color\.light|color\.invariant)\.tokens\.json$/.test(f);

const LIGHT_SOURCE = ALL_TOKEN_FILES.filter((f) => !isDarkOrHC(f));
const DARK_SOURCE = ALL_TOKEN_FILES.filter((f) => !isLightOrInvariant(f) && !/\/color\.hc-(?:light|dark)\.tokens\.json$/.test(f));

const lightConfig = {
  source: LIGHT_SOURCE,
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "_build/css/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: { selector: ":root, [data-mood='quiet-industrial']" },
        },
      ],
    },
    tailwind: {
      transformGroup: "css",
      buildPath: "_build/tailwind/",
      files: [
        {
          destination: "theme.css",
          format: "css/variables",
          options: { selector: "@theme inline" },
        },
      ],
    },
    ts: {
      transformGroup: "js",
      buildPath: "_build/ts/",
      files: [
        { destination: "tokens.ts", format: "typescript/es6-declarations" },
      ],
    },
    ios: {
      transformGroup: "ios-swift",
      buildPath: "_build/ios/",
      files: [
        {
          destination: "LumenTokens.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenTokens" },
        },
      ],
    },
    android: {
      transformGroup: "android",
      buildPath: "_build/android/",
      files: [
        { destination: "colors.xml", format: "android/colors" },
        { destination: "dimens.xml", format: "android/dimens" },
      ],
    },
    compose: {
      transformGroup: "compose",
      buildPath: "_build/compose/",
      files: [
        {
          destination: "LumenTokens.kt",
          format: "compose/object",
          options: {
            className: "LumenTokens",
            packageName: "dev.warp.lumen",
          },
        },
      ],
    },
    flutter: {
      transformGroup: "flutter",
      buildPath: "_build/flutter/",
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
      buildPath: "_build/liquid/",
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
      buildPath: "_build/scss/",
      files: [{ destination: "tokens.scss", format: "scss/variables" }],
    },
    json: {
      transformGroup: "js",
      buildPath: "_build/json/",
      files: [{ destination: "tokens.flat.json", format: "json/flat" }],
    },
  },
};

const darkConfig = {
  source: DARK_SOURCE,
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "_build/css/",
      files: [
        {
          destination: "tokens.dark.css",
          format: "css/variables",
          options: {
            selector:
              "[data-theme='dark'], [data-mood='quiet-industrial'][data-theme='dark']",
          },
        },
      ],
    },
    tailwind: {
      transformGroup: "css",
      buildPath: "_build/tailwind/",
      files: [
        {
          destination: "theme.dark.css",
          format: "css/variables",
          options: { selector: "[data-theme='dark']" },
        },
      ],
    },
    ios: {
      transformGroup: "ios-swift",
      buildPath: "_build/ios/",
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

async function build() {
  for (const config of [lightConfig, darkConfig]) {
    const sd = new StyleDictionary(config);
    await sd.buildAllPlatforms();
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
