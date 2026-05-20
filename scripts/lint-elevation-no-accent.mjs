#!/usr/bin/env node
/**
 * lint:elevation-no-accent — enforce the categorical separation between
 *
 *   1. ELEVATION shadows: lift / depth. Color = NEUTRAL ink-alpha. Never green.
 *      Tokens: shadow.xs / sm / md / lg / xl / 2xl / inset / card / lifted /
 *              popover / menu / modal / toast / floating / kbd /
 *              shadow.elevation.sm / md / lg
 *
 *   2. HALO/GLOW shadows: action / liveness. Color IS spring-green-alpha
 *      by brand contract. Tokens that carry an explicit name signaling
 *      the role (focus, accent-glow, glow.accent, button.glow.*, ai-shimmer,
 *      input.focus, input.success).
 *
 * This lint enforces (1) at the token-source layer. It walks the primitive
 * + semantic shadow token files, identifies every leaf whose name maps to
 * the ELEVATION category, and verifies that none of its color references
 * point at `color.alpha.accent.*` (or any other accent / lime / spring-green
 * alpha). Halos and glows are NOT scanned — they're allowed to be green.
 *
 * v0.14 R10 — added to make AGENTS.md hard rule 18 enforceable. Pre-R10 the
 * separation was documented in elevation.md §3 but not verified by CI.
 *
 * Exit codes:
 *   0 — no violations
 *   1 — at least one elevation shadow references an accent / lime token
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Token-path prefixes whose color MUST be neutral. */
const ELEVATION_PREFIXES = [
  "shadow.xs",
  "shadow.sm",
  "shadow.md",
  "shadow.lg",
  "shadow.xl",
  "shadow.2xl",
  "shadow.inset",
  "shadow.card",
  "shadow.lifted",
  "shadow.popover",
  "shadow.menu",
  "shadow.modal",
  "shadow.toast",
  "shadow.floating",
  "shadow.kbd",
  "shadow.elevation.sm",
  "shadow.elevation.md",
  "shadow.elevation.lg",
];

/** Color-reference fragments that indicate ACCENT (would fail an elevation lint). */
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

function isElevationPath(path) {
  return ELEVATION_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}.`),
  );
}

function colorIsAccent(color) {
  if (typeof color !== "string") return false;
  const lower = color.toLowerCase();
  return ACCENT_HINTS.some((h) => lower.includes(h.toLowerCase()));
}

/** Walk an object recursively, accumulating dot-paths to leaf $value entries. */
function walk(node, path, file) {
  if (node === null || typeof node !== "object") return;

  // DTCG leaf — has a $value (and optionally a $type / $description).
  if ("$value" in node) {
    if (!isElevationPath(path)) return;

    // $value can be a single object, an array of objects, or an aliased string ref.
    const values = Array.isArray(node.$value)
      ? node.$value
      : [node.$value];

    for (const v of values) {
      // Aliased ref like "{shadow.sm}" — these get resolved at build, but for
      // the elevation lint, what matters is whether the SOURCE leaf carries
      // an accent color. So if a leaf aliases another elevation token, we
      // trust the recursive walk catches the source.
      if (typeof v === "string") continue;

      const color = v && typeof v === "object" ? v.color : null;
      if (colorIsAccent(color)) {
        violations.push({
          file,
          path,
          color,
          message:
            `elevation token "${path}" must be neutral but references accent color "${color}". Use color.alpha.shadow.* instead, or move this token under a halo/glow name (shadow.focus, shadow.glow.accent, shadow.button.glow.*, etc.).`,
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
    console.error(`[lint:elevation-no-accent] failed to read ${relPath}: ${err.message}`);
    process.exit(1);
  }
  walk(json, "", relPath);
}

if (violations.length > 0) {
  console.error(`[lint:elevation-no-accent] ✖ ${violations.length} violation(s):`);
  for (const v of violations) {
    console.error(`  ${v.file} @ ${v.path}\n    color: ${v.color}\n    ${v.message}`);
  }
  process.exit(1);
}

console.log("[lint:elevation-no-accent] ✓ every elevation shadow is neutral. Halo/glow shadows correctly carry the accent in their own namespace.");
process.exit(0);
