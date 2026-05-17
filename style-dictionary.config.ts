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
//
// v0.13.1 — register two missing-from-built-in transforms so the css transform
// group renders DTCG 2025.10 composite tokens correctly. SD v5 ships:
//   - `time/seconds`  (handles `$type: time` only, NOT `$type: duration`)
//   - `transition/css/shorthand` (TODO comment in source: "add support for
//     DTCG duration object value type" — currently emits `[object Object]`
//     when the embedded duration is the spec-correct `{value, unit}` object).
// Both surface as the silent `[object Object]` regression that Phase 0 report
// flagged under "What's still uncertain" #2. The two custom transforms below
// close that loop without forking sd-transforms.

/**
 * Format a DTCG dimension/duration value object → CSS string.
 * `{value: 480, unit: "ms"}` → `"480ms"`. Falls through if value is already
 * a string (e.g., aliases pre-resolved to "480ms").
 */
function formatDuration(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "value" in v) {
    const obj = v as { value: number; unit?: string };
    return `${obj.value}${obj.unit ?? "ms"}`;
  }
  return String(v);
}

StyleDictionary.registerTransform({
  name: "lumen/duration/css",
  type: "value",
  transitive: true,
  filter: (token) => token.$type === "duration" || token.type === "duration",
  transform: (token) => formatDuration(token.$value ?? token.value),
});

StyleDictionary.registerTransform({
  name: "lumen/transition/css/shorthand",
  type: "value",
  transitive: true,
  filter: (token) =>
    token.$type === "transition" || token.type === "transition",
  transform: (token) => {
    const v = (token.$value ?? token.value) as {
      duration?: unknown;
      delay?: unknown;
      timingFunction?: unknown;
    };
    const duration = formatDuration(v.duration ?? "0ms");
    const delay = formatDuration(v.delay ?? "0ms");
    const timingFunction = String(v.timingFunction ?? "linear");
    return `${duration} ${timingFunction} ${delay}`;
  },
});

// Lumen typography composites — emits the same `font:` shorthand as the
// built-in `typography/css/shorthand`, but silently. SD v5's built-in emits
// a "Unknown CSS Font Shorthand properties" warning when typography composites
// carry letter-spacing / font-feature-settings / text-transform (which DTCG
// permits but CSS `font:` shorthand cannot express). Lumen's typography roles
// carry those properties intentionally; consumers reach for them via the
// `--tracking-*` and `--font-features-*` primitive variables. This transform
// gives the same output without the warning noise.
/**
 * Format a DTCG dimension value (CSS px/em/rem etc.) → CSS string.
 * `{value: 16, unit: "px"}` → `"16px"`. Falls through if value is already
 * a string (e.g., aliases pre-resolved to "16px").
 */
function formatDimension(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number") return v === 0 ? "0" : `${v}px`;
  if (v && typeof v === "object" && "value" in v) {
    const obj = v as { value: number; unit?: string };
    return `${obj.value}${obj.unit ?? "px"}`;
  }
  return String(v);
}

StyleDictionary.registerTransform({
  name: "lumen/typography/css/shorthand",
  type: "value",
  transitive: true,
  filter: (token) =>
    token.$type === "typography" || token.type === "typography",
  transform: (token) => {
    let v = token.$value ?? token.value;
    // Aliases to other typography composites can land here as the unresolved
    // reference string `"{type.body.tabular}"`. SD's transitive resolution
    // doesn't always pre-walk composite-to-composite chains, so re-read the
    // resolved object from `original` if `v` is still a reference string.
    if (typeof v === "string" && v.startsWith("{") && v.endsWith("}")) {
      // Pass through — SD will resolve the alias to its target string in a
      // later pass; we don't try to peek into other tokens from inside a transform.
      // Fall back to original.$value (the pre-alias source if available).
      v = token.original?.$value ?? token.original?.value ?? v;
    }
    if (typeof v !== "object" || v === null) {
      return String(v);
    }
    const obj = v as {
      fontWeight?: string | number;
      fontSize?: unknown;
      lineHeight?: string | number;
      fontFamily?: string | string[];
      fontStyle?: string;
    };
    const weight = obj.fontWeight ?? 400;
    const size = formatDimension(obj.fontSize ?? "16px");
    const lineHeight = obj.lineHeight ?? 1.5;
    const family = Array.isArray(obj.fontFamily)
      ? obj.fontFamily.join(", ")
      : (obj.fontFamily ?? "sans-serif");
    const style = obj.fontStyle ? `${obj.fontStyle} ` : "";
    return `${style}${weight} ${size}/${lineHeight} ${family}`;
  },
});

// Lumen x/y padding composites — `{x: "8px", y: "4px"}` is the
// Lumen-internal shape for paired padding (button.padding, space.inset.squish,
// space.inset.stretch). CSS shorthand emits as `${y} ${x}` (vertical horizontal).
// Pre-resolved values arrive here as strings (`"8px"`, `"4px"`); raw aliases
// arrive as objects. This transform handles both.
StyleDictionary.registerTransform({
  name: "lumen/padding-xy/css",
  type: "value",
  transitive: true,
  filter: (token) => {
    const v = token.$value ?? token.value;
    return (
      v !== null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      "x" in v &&
      "y" in v
    );
  },
  transform: (token) => {
    const v = (token.$value ?? token.value) as { x: unknown; y: unknown };
    const fmt = (n: unknown) => {
      if (typeof n === "string") return n;
      if (typeof n === "number") return n === 0 ? "0" : `${n}px`;
      if (n && typeof n === "object" && "value" in n) return formatDuration(n);
      return String(n);
    };
    return `${fmt(v.y)} ${fmt(v.x)}`;
  },
});

// Lumen's css transform group — extends SD v5's built-in `css` group with
// the two `lumen/*` transforms above. The duration transform must come
// BEFORE the transition transform (transition reads the resolved duration
// string). The Lumen transition transform REPLACES the built-in
// `transition/css/shorthand` (which has a TODO for DTCG duration objects),
// so the built-in is omitted from this group.
StyleDictionary.registerTransformGroup({
  name: "lumen/css",
  transforms: [
    "attribute/cti",
    "name/kebab",
    "lumen/duration/css",
    "time/seconds",
    "html/icon",
    "size/rem",
    "color/css",
    "asset/url",
    "fontFamily/css",
    "cubicBezier/css",
    "strokeStyle/css/shorthand",
    "border/css/shorthand",
    "lumen/typography/css/shorthand",
    "lumen/transition/css/shorthand",
    "lumen/padding-xy/css",
    "shadow/css/shorthand",
  ],
});

// Lumen's scss transform group mirrors `lumen/css` (same composite transforms)
// so the dist/scss output picks up the duration / transition / typography fixes.
StyleDictionary.registerTransformGroup({
  name: "lumen/scss",
  transforms: [
    "attribute/cti",
    "name/kebab",
    "lumen/duration/css",
    "time/seconds",
    "html/icon",
    "size/rem",
    "color/css",
    "asset/url",
    "fontFamily/css",
    "cubicBezier/css",
    "strokeStyle/css/shorthand",
    "border/css/shorthand",
    "lumen/typography/css/shorthand",
    "lumen/transition/css/shorthand",
    "lumen/padding-xy/css",
    "shadow/css/shorthand",
  ],
});

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
      transformGroup: "lumen/css",
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
      transformGroup: "lumen/css",
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
          filter: (token) => token.$type === "color" || token.attributes?.category === "color",
        },
        {
          // v0.13.2 — per master doc Phase 0 §Group C; previously bundled into
          // LumenTokens.swift only. Per-category extension lets consumers import
          // just spacing without pulling colors.
          destination: "Lumen+Spacing.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenSpacing" },
          filter: (token) => token.$type === "dimension"
            || ["space", "size", "radius"].includes(token.attributes?.category as string),
        },
        {
          // v0.13.2 — per master doc Phase 0 §Group C; previously bundled.
          destination: "Lumen+Typography.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenTypography" },
          filter: (token) => ["typography", "fontFamily", "fontWeight", "fontSize", "lineHeight", "letterSpacing"].includes(token.$type as string)
            || ["type", "weight", "tracking", "leading"].includes(token.attributes?.category as string),
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
          filter: (token) => token.$type === "color" || token.attributes?.category === "color",
        },
        {
          // v0.13.2 — per master doc Phase 0 §Group C.
          destination: "LumenSpacing.kt",
          format: "compose/object",
          options: {
            className: "LumenSpacing",
            packageName: "dev.warp.lumen",
          },
          filter: (token) => token.$type === "dimension"
            || ["space", "size", "radius"].includes(token.attributes?.category as string),
        },
        {
          // v0.13.2 — per master doc Phase 0 §Group C.
          destination: "LumenTypography.kt",
          format: "compose/object",
          options: {
            className: "LumenTypography",
            packageName: "dev.warp.lumen",
          },
          filter: (token) => ["typography", "fontFamily", "fontWeight", "fontSize", "lineHeight", "letterSpacing"].includes(token.$type as string)
            || ["type", "weight", "tracking", "leading"].includes(token.attributes?.category as string),
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
      transformGroup: "lumen/css",
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
      transformGroup: "lumen/scss",
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
      transformGroup: "lumen/css",
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
      transformGroup: "lumen/css",
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
      transformGroup: "lumen/css",
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
