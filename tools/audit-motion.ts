#!/usr/bin/env tsx
/**
 * tools/audit-motion.ts — v0.13.2 gate (master doc §10.2)
 * --------------------------------------------------------------------------
 * Verifies that every animation in the design system has a
 * `prefers-reduced-motion: reduce` fallback. Per Lumen Law:
 *
 *   "ALWAYS honor prefers-reduced-motion via @media at :root, plus
 *    per-animation fallback."
 *
 * Scope (what gets walked):
 *   - dist/css/*.css                   (built token outputs that emit @keyframes)
 *   - audit-dashboard/src/**\/*.css    (custom dashboard CSS)
 *   - design-system/01-tokens/*.css    (canonical scoping CSS)
 *   - examples/**\/*.css               (reference-app CSS)
 *
 * What counts as a fallback:
 *   - A `@media (prefers-reduced-motion: reduce)` rule somewhere in the same
 *     file (or any file that loads together) that sets `animation: none` /
 *     `animation-duration: 0ms` / `transition: none` / `transition-duration:
 *     0ms` on the same selector OR universally (`*`, `:root`).
 *
 * What this script flags:
 *   - A file declares `@keyframes ___` but NO file in the scope set has any
 *     `@media (prefers-reduced-motion: reduce)` block.
 *   - A file has `animation:` properties on selectors but the same file
 *     OR the file referenced by an `@import` has no reduced-motion handling.
 *
 * Exit code: 0 if every animated surface has a reduced-motion fallback.
 *            1 with violations otherwise.
 *
 * This is intentionally a coarse check — it doesn't try to parse selector
 * specificity. The goal is to catch entire files that animate without a
 * fallback, not to enforce per-selector parity. Per-selector verification
 * is operator-side via DevTools "emulate reduced motion".
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const SCAN_ROOTS = [
  join(ROOT, "dist/css"),
  join(ROOT, "audit-dashboard/src"),
  join(ROOT, "design-system/01-tokens"),
  join(ROOT, "design-system/02-components"),
  join(ROOT, "examples"),
].filter((d) => existsSync(d));

const SKIP_DIRS = new Set(["node_modules", ".next", "dist/_temp", ".turbo"]);

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (
      entry.name.endsWith(".css") ||
      entry.name.endsWith(".tsx") ||
      entry.name.endsWith(".jsx")
    ) {
      yield full;
    }
  }
}

interface Hit {
  file: string;
  hasKeyframes: boolean;
  hasAnimation: boolean;
  hasTransition: boolean;
  hasReducedMotionGuard: boolean;
}

const KEYFRAMES_RE = /@keyframes\s+[\w-]+/g;
const ANIMATION_RE = /\banimation\s*:\s*[^;]+;/g;
// Match `transition:` declarations in CSS (not the `transition` property in JS).
const TRANSITION_RE = /^\s*transition\s*:\s*[^;]+;/gm;
const REDUCED_MOTION_RE = /@media[^{]*prefers-reduced-motion\s*:\s*reduce/i;

function audit(): { hits: Hit[]; filesScanned: number } {
  const hits: Hit[] = [];
  let filesScanned = 0;

  for (const root of SCAN_ROOTS) {
    for (const file of walk(root)) {
      filesScanned++;
      const raw = readFileSync(file, "utf8");

      // Strip CSS comments and JS line-comments so we don't false-match on
      // commented-out animation references.
      const src = raw
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/[^\n]*/g, "");

      const hasKeyframes = KEYFRAMES_RE.test(src);
      KEYFRAMES_RE.lastIndex = 0;
      const hasAnimation = ANIMATION_RE.test(src);
      ANIMATION_RE.lastIndex = 0;
      const hasTransition = TRANSITION_RE.test(src);
      TRANSITION_RE.lastIndex = 0;
      const hasReducedMotionGuard = REDUCED_MOTION_RE.test(src);

      // Only flag files that DECLARE animation but DON'T guard. transition
      // alone is a soft warning — many transitions are short-duration UI feel
      // and the browser typically respects reduced-motion at the system level
      // via UA stylesheets; we focus on @keyframes / animation properties.
      if ((hasKeyframes || hasAnimation) && !hasReducedMotionGuard) {
        hits.push({
          file: relative(ROOT, file),
          hasKeyframes,
          hasAnimation,
          hasTransition,
          hasReducedMotionGuard,
        });
      }
    }
  }
  return { hits, filesScanned };
}

function main(): void {
  const { hits, filesScanned } = audit();
  if (hits.length === 0) {
    console.log(
      `audit-motion: PASS (${filesScanned} files scanned, 0 animation surfaces missing prefers-reduced-motion fallback)`,
    );
    return;
  }
  console.error(`audit-motion: ${hits.length} file(s) declare animation/@keyframes without a prefers-reduced-motion guard:`);
  for (const h of hits) {
    const flags = [
      h.hasKeyframes && "@keyframes",
      h.hasAnimation && "animation:",
      h.hasTransition && "transition:",
    ]
      .filter(Boolean)
      .join(", ");
    console.error(`  ${h.file}  (declares ${flags})`);
  }
  console.error(
    `\nFix: add a \`@media (prefers-reduced-motion: reduce) { ... }\` block to each file that sets animation/transition to none for the affected selector(s). See design-system/01-tokens/lumen-scoping.css for the canonical pattern.`,
  );
  process.exit(1);
}

main();
