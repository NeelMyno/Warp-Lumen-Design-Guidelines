#!/usr/bin/env node
/**
 * lint:shadow-no-accent — enforce the v0.14 R11 mandate: NO green in any
 * `box-shadow` color value, anywhere in the system.
 *
 * Pre-R11 this script was `lint:elevation-no-accent` and only enforced the
 * rule on the elevation subset (shadow.xs/sm/md/lg/xl/2xl/inset/popover/
 * menu/modal/toast/floating/lifted/card/kbd + shadow.elevation.{sm,md,lg}).
 * R11 collapsed the categorical split and broadens the scan to EVERY shadow
 * token — including the formerly-allowed halo / focus / glow / button-glow
 * / ai-shimmer / input-focus / input-success / focus-dual lines.
 *
 * The lint walks the primitive + semantic shadow token files, descends to
 * every leaf $value, and fails CI if any references an accent / lime /
 * spring-green / 00FA8A color.
 *
 * Allowed colors in a shadow $value:
 *   - color.alpha.shadow.* (the neutral ink-anchored shadow ramp)
 *   - color.alpha.paper.*  (white-alpha — visible halos on dark surfaces)
 *   - color.alpha.ink.*    (black-alpha — visible halos on light surfaces)
 *   - color.alpha.danger.* (red validation halo — exempt per R11 carve-out)
 *   - color.alpha.warning.* (amber validation halo — exempt per R11 carve-out)
 *   - color.border.frame   (theme-aware 40 %-alpha neutral)
 *   - color.border.strong  (theme-aware 24 %-alpha neutral)
 *   - color.surface.*      (page / canvas — used as separator rings)
 *   - "transparent"        (lit-edge no-op in light mode)
 *
 * Banned in shadow $value:
 *   - color.alpha.accent.* (any opacity)
 *   - lumen-accent-* / lumen-lime-*
 *   - spring-green / 00FA8A / 00fa8a
 *
 * Exit codes:
 *   0 — no violations
 *   1 — at least one shadow token references a banned green
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Color-reference fragments that indicate GREEN — banned in shadows. */
const ACCENT_HINTS = [
  "color.alpha.accent",
  "color.accent",
  "lumen-accent",
  "lumen-lime",
  "spring-green",
  "00FA8A",
  "00fa8a",
];

const FILES = [
  "design-system/01-tokens/primitives/shadow.tokens.json",
  "design-system/01-tokens/semantic/shadow.tokens.json",
];

const violations = [];

function colorIsAccent(color) {
  if (typeof color !== "string") return false;
  const lower = color.toLowerCase();
  return ACCENT_HINTS.some((h) => lower.includes(h.toLowerCase()));
}

/** Walk an object recursively, validating every leaf $value's color. */
function walk(node, path, file) {
  if (node === null || typeof node !== "object") return;

  if ("$value" in node) {
    const values = Array.isArray(node.$value)
      ? node.$value
      : [node.$value];

    for (const v of values) {
      // Aliased ref like "{shadow.sm}" — the source leaf is what matters;
      // recursion will hit it.
      if (typeof v === "string") continue;

      // String "none" is a valid shadow value (e.g., shadow.button.glow.rest).
      if (v === null || v === undefined) continue;

      const color = v && typeof v === "object" ? v.color : null;
      if (colorIsAccent(color)) {
        violations.push({
          file,
          path,
          color,
          message:
            `shadow token "${path}" references accent color "${color}". Per AGENTS.md hard rule 20 (v0.14 R11), no shadow color value may be green. Replace with a neutral alpha (color.alpha.shadow.* / color.alpha.paper.* / color.alpha.ink.* / color.border.frame / color.border.strong) — or if this is a validation halo, use color.alpha.danger.* or color.alpha.warning.*.`,
        });
      }
    }
    return;
  }

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    walk(child, path ? `${path}.${key}` : key, file);
  }
}

for (const relPath of FILES) {
  const abs = resolve(ROOT, relPath);
  let json;
  try {
    json = JSON.parse(readFileSync(abs, "utf8"));
  } catch (err) {
    console.error(`[lint:shadow-no-accent] failed to read ${relPath}: ${err.message}`);
    process.exit(1);
  }
  walk(json, "", relPath);
}

if (violations.length > 0) {
  console.error(`[lint:shadow-no-accent] ✖ ${violations.length} violation(s):`);
  for (const v of violations) {
    console.error(`  ${v.file} @ ${v.path}\n    color: ${v.color}\n    ${v.message}`);
  }
  process.exit(1);
}

console.log("[lint:shadow-no-accent] ✓ every shadow token color is neutral. No green leaks into the cast / halo / focus / glow layer.");
process.exit(0);
