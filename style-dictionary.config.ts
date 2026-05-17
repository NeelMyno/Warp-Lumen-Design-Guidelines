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

// ─────────────────────────────────────────────────────────────────────────────
// v0.13.3 — Swift + Compose dimension/string transforms + composite-skip filter
// ─────────────────────────────────────────────────────────────────────────────
//
// Phase-8 (v0.13.2) report logged THREE persistent dist-output bugs as
// "v0.13.3 candidates":
//
//   1. `dist/swift/Lumen+Spacing.swift` values were 16× scaled —
//      `buttonGapLg = CGFloat(128.00)` from an 8 px source. Root cause:
//      SD v5's built-in `size/swift/remToCGFloat` transform assumes the
//      input is REM (16 px ≙ 1 rem); Lumen stores dimensions in px, so the
//      transform multiplies by 16 incorrectly. Fix: ship a custom
//      `lumen/swift/dimension` that emits `CGFloat(N)` from the raw px value.
//
//   2. `dist/compose/LumenTypography.kt` emitted bare identifiers for string
//      tokens — `val fontFamilySans = Satoshi,Satoshi-Fallback,...` (invalid
//      Kotlin syntax). Root cause: SD's `compose/object` format passes
//      through string $values without quoting. Fix: ship a custom
//      `lumen/compose/string-literal` that wraps string values in `"…"`.
//
//   3. ALL composite tokens (typography, padding-xy, transition, shadow)
//      emitted as `[object Object]` in both Swift AND Compose. Root cause:
//      composite $values are JS objects; neither the `ios-swift/class.swift`
//      nor the `compose/object` formatter knows how to materialize them
//      into a native expression (composite typography in SwiftUI = `Font.system(...)`
//      with multiple separate properties; in Compose = `TextStyle(...)`).
//      Fix: filter composite tokens OUT of Swift + Compose outputs entirely.
//      Consumers who want composite typography reach for `Font.system(...)` /
//      `TextStyle(...)` directly using the atomic tokens (fontWeight,
//      fontSize, lineHeight) that ARE emitted. The composite-skip filter
//      below names exactly what's excluded.
//
// Plus an analogous `lumen/swift/string-literal` for fontFamily strings on
// the iOS side (same unquoted-identifier bug as Compose).

/**
 * Resolve a numeric pixel value from a dimension token.
 *
 * Handles every shape SD might hand us:
 *   - DTCG dimension object: `{value: 8, unit: "px"}` → 8
 *   - Raw number: `8` → 8
 *   - CSS string: `"8px"`, `"8rem"`, `"8em"` → 8
 *   - Lumen post-transform string: `"CGFloat(8.00)"`, `"8.dp"`, `"8.sp"` → 8
 *     (extracts the inner number — important for transitive runs where SD
 *     may pass our own prior output back through the filter)
 *   - Anything else → 0 (defensive default; surfaces as `0` in output where
 *     a downstream code reviewer will catch it)
 */
function dimensionToPx(v: unknown): number {
  if (typeof v === "number") return v;
  if (v && typeof v === "object" && !Array.isArray(v) && "value" in v) {
    return Number((v as { value: number }).value) || 0;
  }
  if (typeof v === "string") {
    // Pre-formatted Swift / Compose output — extract the inner number.
    const swiftMatch = v.match(/CGFloat\(\s*([-+]?[0-9.]+)\s*\)/);
    if (swiftMatch) return parseFloat(swiftMatch[1]);
    const dpMatch = v.match(/^\s*([-+]?[0-9.]+)\s*\.(dp|sp)\s*$/);
    if (dpMatch) return parseFloat(dpMatch[1]);
    // CSS-style "8px" / "1.5rem" / "0.25em" — strip the unit and parse.
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/**
 * `lumen/native/dimension/cgfloat` — emits Lumen px dimensions as Swift
 * `CGFloat(N)`. Filter is broad enough to catch DTCG-inherited $type
 * AND aliased values that may have lost their group-level $type during
 * SD's alias-resolution pass. Uses a string-aware parser so transitive
 * runs (which may receive pre-formatted strings like "CGFloat(8.00)"
 * from prior passes, or "8px" from CSS-side transforms) all extract
 * the underlying number correctly.
 */
StyleDictionary.registerTransform({
  name: "lumen/native/dimension/cgfloat",
  type: "value",
  transitive: true,
  filter: (token) => {
    const t = token.$type ?? token.type;
    const cat = token.attributes?.category;
    const v = token.$value ?? token.value;
    // Match: explicit dimension type, OR spacing/size/radius category,
    // OR a value-shape that's a dimension object (handles aliases that
    // bypass $type inheritance).
    if (t === "dimension" || t === "spacing") return true;
    if (["space", "size", "radius", "spacing"].includes(cat as string)) return true;
    if (v !== null && typeof v === "object" && !Array.isArray(v) &&
        "value" in v && "unit" in v) return true;
    return false;
  },
  transform: (token) => {
    const px = dimensionToPx(token.$value ?? token.value);
    return `CGFloat(${px.toFixed(2)})`;
  },
});

/**
 * `lumen/native/dimension/dp` — emits Lumen px dimensions as Kotlin `N.dp`.
 */
StyleDictionary.registerTransform({
  name: "lumen/native/dimension/dp",
  type: "value",
  transitive: true,
  filter: (token) => {
    const t = token.$type ?? token.type;
    const cat = token.attributes?.category;
    const v = token.$value ?? token.value;
    if (t === "dimension" || t === "spacing") return true;
    if (["space", "size", "radius", "spacing"].includes(cat as string)) return true;
    if (v !== null && typeof v === "object" && !Array.isArray(v) &&
        "value" in v && "unit" in v) return true;
    return false;
  },
  transform: (token) => {
    const px = dimensionToPx(token.$value ?? token.value);
    return `${px}.dp`;
  },
});

/**
 * Lumen Swift fontFamily — emits `"comma,joined,list"` quoted.
 * The built-in `ios-swift/class.swift` format passes through string values
 * unquoted, which Swift rejects as syntax error.
 */
StyleDictionary.registerTransform({
  name: "lumen/swift/string-literal",
  type: "value",
  transitive: true,
  filter: (token) =>
    token.$type === "fontFamily" ||
    token.attributes?.category === "fontFamily",
  transform: (token) => {
    const v = token.$value ?? token.value;
    const s = Array.isArray(v)
      ? (v as unknown[]).map(String).join(", ")
      : String(v);
    return `"${s.replace(/"/g, '\\"')}"`;
  },
});

/**
 * Lumen Compose fontFamily — same as Swift but for Kotlin string literals.
 */
StyleDictionary.registerTransform({
  name: "lumen/compose/string-literal",
  type: "value",
  transitive: true,
  filter: (token) =>
    token.$type === "fontFamily" ||
    token.attributes?.category === "fontFamily",
  transform: (token) => {
    const v = token.$value ?? token.value;
    const s = Array.isArray(v)
      ? (v as unknown[]).map(String).join(", ")
      : String(v);
    return `"${s.replace(/"/g, '\\"')}"`;
  },
});

/**
 * Lumen native-atomic filter — returns `true` for tokens that have a
 * meaningful representation in BOTH Swift (CGFloat / UIColor / Int) AND
 * Compose (.dp / Color / Int / String). Returns `false` for composite
 * tokens whose only sensible native form is a class constructor
 * (`Font.system(...)`, `TextStyle(...)`, `Shadow(...)`) — those belong in
 * downstream hand-authored translation layers, not in the auto-generated
 * token dump. Excluding them is what kills the `[object Object]` regression.
 *
 * Returns true for: color, dimension, fontWeight, numeric, fontFamily (as a
 * quoted joined string).
 * Returns false for: typography, transition, shadow, gradient, and any
 * token whose $value is a composite object (x/y padding, multi-layer shadow,
 * etc.).
 */
function isAtomicNativeToken(token: { $type?: string; $value?: unknown; value?: unknown; attributes?: { category?: string } }): boolean {
  const t = token.$type;
  const cat = token.attributes?.category;
  const v = token.$value ?? token.value;

  // CHECK 1 — value shape. Any object OR array post-transform is a composite
  // (multi-layer shadows arrive as arrays, paddings as `{x, y}` objects,
  // typography as `{fontWeight, fontSize, …}`). Skip them regardless of
  // declared $type — a `$type: color` token aliased to a shadow primitive
  // (e.g., `color.action.primary.glow → {shadow.accent-glow}`) still resolves
  // to an array and would emit `[object Object]`.
  if (v !== null && typeof v === "object") {
    return false;
  }

  // CHECK 2 — explicit deny by type. Composite types whose value happens to
  // pre-resolve to a string (rare but possible via prior transforms) still
  // don't have meaningful native Swift / Compose representations as constants.
  if (t === "typography" || t === "transition" || t === "shadow" || t === "gradient") return false;
  if (cat === "type" || cat === "transition" || cat === "shadow") return false;

  // CHECK 3 — explicit allow.
  if (t === "color" || cat === "color") return true;
  if (t === "dimension" || ["space", "size", "radius"].includes(cat as string)) return true;
  if (t === "fontWeight" || cat === "weight") return true;
  if (t === "fontFamily" || cat === "fontFamily") return true;
  if (t === "number") return true;

  // CHECK 4 — default-allow for atomic strings / numbers (cubicBezier strings,
  // durations post-transform) — anything that survived the composite check
  // is atomic enough to ship.
  return true;
}

/**
 * Lumen Swift transform group. Built from `ios-swift`'s exact list but:
 *   - `size/swift/remToCGFloat` REPLACED by `lumen/native/dimension/cgfloat`
 *     (raw px → CGFloat, no 16× scaling; handles all alias / value shapes)
 *   - `lumen/swift/string-literal` ADDED at the end (quotes fontFamily strings)
 *
 * Composite tokens (typography, padding-xy, shadow, transition) are
 * filtered out per-platform via `isAtomicNativeToken` — they'd otherwise
 * emit as `[object Object]`.
 */
StyleDictionary.registerTransformGroup({
  name: "lumen/swift",
  transforms: [
    "attribute/cti",
    "name/camel",
    "color/UIColorSwift",
    "content/swift/literal",
    "asset/swift/literal",
    "lumen/native/dimension/cgfloat",
    "lumen/swift/string-literal",
  ],
});

/**
 * Lumen Compose transform group. Built from `compose`'s exact list but:
 *   - `size/compose/remToDp` REPLACED by `lumen/native/dimension/dp`
 *   - `size/compose/remToSp` DROPPED — not needed since composite typography
 *     is filtered out (no fontSize tokens emit individually).
 *   - `size/compose/em` PRESERVED (it filters on time / font-size which
 *     doesn't collide with our atomic spacing tokens; harmless if it runs).
 *   - `lumen/compose/string-literal` ADDED at the end (quotes fontFamily).
 */
StyleDictionary.registerTransformGroup({
  name: "lumen/compose",
  transforms: [
    "attribute/cti",
    "name/camel",
    "color/composeColor",
    "size/compose/em",
    "lumen/native/dimension/dp",
    "lumen/compose/string-literal",
  ],
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
      // v0.13.3 — moved off the built-in `ios-swift` group onto Lumen's custom
      // group so dimensions emit raw px and string fontFamilies are quoted.
      // Composite tokens (typography, padding-xy, shadow, transition) are
      // filtered out — they have no atomic Swift representation.
      transformGroup: "lumen/swift",
      buildPath: "dist/ios/",
      files: [
        {
          destination: "LumenTokens.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenTokens" },
          filter: (token) => isAtomicNativeToken(token),
        },
      ],
    },
    swift: {
      // v0.13.3 — same migration as `ios` above.
      transformGroup: "lumen/swift",
      buildPath: "dist/swift/",
      files: [
        {
          destination: "Lumen+Colors.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenColors" },
          filter: (token) => isAtomicNativeToken(token)
            && (token.$type === "color" || token.attributes?.category === "color"),
        },
        {
          // v0.13.2 — per master doc Phase 0 §Group C; previously bundled into
          // LumenTokens.swift only. Per-category extension lets consumers import
          // just spacing without pulling colors. v0.13.3 — also applies the
          // atomic-only filter so composite paddings (button.padding.{md,lg,…})
          // are excluded — they belong in EdgeInsets() helpers, not as raw
          // CGFloat constants.
          destination: "Lumen+Spacing.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenSpacing" },
          filter: (token) => isAtomicNativeToken(token)
            && (token.$type === "dimension"
              || ["space", "size", "radius"].includes(token.attributes?.category as string)),
        },
        {
          // v0.13.2 — per master doc Phase 0 §Group C; previously bundled.
          // v0.13.3 — composite `typography` tokens are filtered out (they emit
          // [object Object]); only atomic fontFamily / fontWeight / fontSize
          // ship as Swift constants. Consumers compose composite typography
          // with Font.system(size:weight:design:) using these atomics.
          destination: "Lumen+Typography.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenTypography" },
          filter: (token) => isAtomicNativeToken(token)
            && (["fontFamily", "fontWeight", "fontSize", "lineHeight", "letterSpacing"].includes(token.$type as string)
              || ["weight", "tracking", "leading"].includes(token.attributes?.category as string)),
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
      // v0.13.3 — moved off the built-in `compose` group onto Lumen's custom
      // group so dimensions emit `N.dp` from raw px (no 16x scaling) and
      // string fontFamilies are properly quoted. Composite tokens are filtered
      // out — they'd emit as `[object Object]` Kotlin literals.
      transformGroup: "lumen/compose",
      buildPath: "dist/compose/",
      files: [
        {
          destination: "LumenColors.kt",
          format: "compose/object",
          options: {
            className: "LumenColors",
            packageName: "dev.warp.lumen",
          },
          filter: (token) => isAtomicNativeToken(token)
            && (token.$type === "color" || token.attributes?.category === "color"),
        },
        {
          // v0.13.2 — per master doc Phase 0 §Group C.
          // v0.13.3 — composite button-padding-xy tokens excluded; consumers
          // build PaddingValues() from the atomic dimensions.
          destination: "LumenSpacing.kt",
          format: "compose/object",
          options: {
            className: "LumenSpacing",
            packageName: "dev.warp.lumen",
          },
          filter: (token) => isAtomicNativeToken(token)
            && (token.$type === "dimension"
              || ["space", "size", "radius"].includes(token.attributes?.category as string)),
        },
        {
          // v0.13.2 — per master doc Phase 0 §Group C.
          // v0.13.3 — composite `typography` tokens excluded; only atomic
          // fontFamily / fontWeight / fontSize ship. Consumers compose
          // TextStyle(fontFamily=..., fontWeight=..., fontSize=...) at
          // call-sites using these atomics.
          destination: "LumenTypography.kt",
          format: "compose/object",
          options: {
            className: "LumenTypography",
            packageName: "dev.warp.lumen",
          },
          filter: (token) => isAtomicNativeToken(token)
            && (["fontFamily", "fontWeight", "fontSize", "lineHeight", "letterSpacing"].includes(token.$type as string)
              || ["weight", "tracking", "leading"].includes(token.attributes?.category as string)),
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
      // v0.13.3 — moved off the built-in `ios-swift` group onto Lumen's custom
      // group for dimension correctness + string quoting + composite-skip.
      transformGroup: "lumen/swift",
      buildPath: "dist/ios/",
      files: [
        {
          destination: "LumenTokensDark.swift",
          format: "ios-swift/class.swift",
          options: { className: "LumenTokensDark" },
          filter: (token) => isAtomicNativeToken(token),
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
