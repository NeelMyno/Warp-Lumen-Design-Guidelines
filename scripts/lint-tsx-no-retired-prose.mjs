#!/usr/bin/env node
/**
 * lint:tsx-no-retired-prose — enforce v0.14.4 R15 / ADR 0034 docs↔tokens↔TSX-prose sync.
 *
 * Third tier in the lint architecture. The first two:
 *   - `lint:shadow-no-accent` polices the TOKEN-source layer (DTCG JSON).
 *   - `lint:docs-no-retired-tokens` polices the DOCS-prose layer (.md / .txt).
 *
 * R14's audit closed the doc-prose gap that R11 left. R15's MCP walk caught
 * a THIRD gap: TSX files carry rendered prose (showcase `description` props,
 * JSX text children, JSDoc that an LLM agent would read to reconstruct the
 * contract) that NEITHER prior lint catches. Two rendered-prose defects
 * (foundations Elevation preamble; Live-data signatures preamble) and one
 * focus-visible outline color leak (tool preset list) ALL passed the R14
 * lint umbrella because the offending content sits in .tsx, not .md/.txt.
 *
 * This lint walks `.tsx` / `.ts` files in:
 *   - audit-dashboard/src/                       (rendered Next.js routes + primitives)
 *   - design-system/02-components/(name)/examples/   (per-component example surfaces)
 *
 * And fails CI when:
 *   - A retired PROSE PHRASE appears in a PRESCRIPTIVE context (current
 *     contract being recommended).
 *
 * Why this is a PROSE lint, not a TOKEN lint:
 *   - TSX legitimately references `--lumen-lime-aN` tokens for backgrounds,
 *     surface tints, status pills, AI action surfaces, selection BG — all
 *     R11-EXEMPT (per ADR 0030: green retired from SHADOWS, not BG fills).
 *   - A token-based scan would flag thousands of legitimate uses.
 *   - But phrases like "lime-tinted" / "spring-green glow" / "primary glow
 *     ladder" / "lime ambient" are post-R11 false signals — these describe
 *     the RETIRED shadow ambient that the green BG fill replaced.
 *
 * What counts as "prescriptive":
 *   - Inside a `description=`, `title=`, or other rendered-prop assignment
 *   - Inside JSX text children
 *   - Inside JSDoc that describes the CURRENT contract (no retirement marker
 *     in the same paragraph)
 *
 * What's exempt (allowed even when phrase appears):
 *   - The retirement ADRs themselves (sibling tier exemption)
 *   - This lint script and its sibling lint scripts
 *   - `lumen-lint-allow: retired-prose` directive (block-level or line-level)
 *   - Any paragraph containing a retirement marker (same heuristic as the
 *     docs lint — "retired", "superseded", "was X", "pre-R11", "ADR 0030"...)
 *
 * Exit codes:
 *   0 — no violations
 *   1 — at least one TSX file cites retired prose prescriptively
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ────────────────────────────────────────────────────────────────────────── */
/* Data-driven retired-PROSE list. Add a phrase when retiring a contract.    */
/* Each entry's `pattern` is matched case-insensitively (i flag is added).   */
/* ────────────────────────────────────────────────────────────────────────── */

const RETIRED_PROSE = [
  {
    id: "R11-prose-lime-tinted",
    pattern: /\blime[-\s]tinted\b/i,
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement:
      "Use 'neutral' for shadows. 'Accent-tinted' is OK for BG fills, surface tints, " +
      "status pill backgrounds — those are R11-exempt.",
  },
  {
    id: "R11-prose-spring-green-glow",
    pattern: /\bspring[-\s]green[-\s]glow\b/i,
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement:
      "The spring-green-glow ambient was the pre-R11 shadow halo on primary CTAs / hero surfaces. " +
      "It's retired. Primary CTAs now ride their green BG fill — no halo.",
  },
  {
    id: "R11-prose-lime-glow",
    pattern: /\blime[-\s]glow\b/i,
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement: "Same retirement as spring-green-glow — see R11-prose-spring-green-glow.",
  },
  {
    id: "R11-prose-lime-halo",
    pattern: /\blime[-\s]halo\b/i,
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement:
      "The lime halo on hero CTAs is retired. The .lumen-glow-cta class now lays a NEUTRAL atmospheric lift; " +
      "the brand green lives in the BG fill, not the shadow.",
  },
  {
    id: "R11-prose-lime-ambient",
    pattern: /\blime[-\s]ambient\b/i,
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement:
      "The lime ambient layered behind primary surfaces is retired. Use 'neutral elevation' or 'paper-channel lift'.",
  },
  {
    id: "R11-prose-glow-ladder",
    pattern: /\b(?:primary|standard|md primary|three[-\s]state)\s+glow\s+ladder\b/i,
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement:
      "The 3-stop primary-CTA glow ladder is retired. Refer to it as the 'primary shadow ladder' (now neutral) " +
      "or 'pre-R11 primary glow ladder' if citing history.",
  },
  {
    id: "R11-prose-lime-alpha-NN",
    pattern: /\blime\s+alpha[-\s]?(?:16|20|25|28|32|40|64)\b/i,
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement:
      "Lime alpha values still exist as primitive tokens (--lumen-lime-aNN) for BG / border / text use. " +
      "But citing one as a shadow recipe is the retired contract — rewrite to the neutral shadow token.",
  },
  // --- Future retirements append here. Pattern: { id, pattern, retiredIn, replacement }. ---
];

/* ────────────────────────────────────────────────────────────────────────── */
/* Paragraph-level retirement markers — same heuristic as the docs lint.     */
/* If any of these appear in the SAME paragraph as a retired-prose mention,  */
/* the lint allows it as historical citation.                                 */
/* ────────────────────────────────────────────────────────────────────────── */

const RETIREMENT_MARKERS = [
  /\bretired\b/i,
  /\bsuperseded\b/i,
  /\bhistorical\b/i,
  /\bdeprecated\b/i,
  /\bbefore R\d+/i,
  /\bpre-R\d+/i,
  /\bpre-v0\./i,
  /\bbefore v0\./i,
  /\bthrough v0\./i,
  /\bneutralized\b/i,
  /\bno longer\b/i,
  /\bADR 003\d\b/i,
  /\bv0\.14 R1\d\b/i,
  /\bR11\s+retired\b/i,
  /\bR11\s+(?:retunes?|narrows)/i,
  /\bR11 \(/i,
  /\bR11\b.*\bretired\b/i,
  /\bretires?\b/i,
  /\bR1[1-5]\b/i,
  /\blost the halo war\b/i,         // documented narrative phrase
  /\beach token\.\b/i,
  /\bdemonstrated tokens whose color values have since been neutralized\b/i,
];

/* ────────────────────────────────────────────────────────────────────────── */
/* Block-level lint-allow directive: `lumen-lint-allow: retired-prose` in a   */
/* comment near the start of a file exempts the whole file. Mirrors the      */
/* convention used by lint-no-arbitrary-typography + lint-no-off-grid-spacing.*/
/* ────────────────────────────────────────────────────────────────────────── */

const FILE_ALLOW_DIRECTIVE = /lumen-lint-allow:\s*retired-prose\b/i;

/* ────────────────────────────────────────────────────────────────────────── */
/* File-level exemptions. Sibling lint scripts and the retirement ADR        */
/* itself need the strings to ban / cite.                                    */
/* ────────────────────────────────────────────────────────────────────────── */

const EXEMPT_FILES = new Set([
  "scripts/lint-shadow-no-accent.mjs",
  "scripts/lint-docs-no-retired-tokens.mjs",
  "scripts/lint-tsx-no-retired-prose.mjs",
]);

const EXEMPT_DIRS = [
  ".audit-runs",
  "_meta/audits",
  "_meta/decisions",          // ADRs cite retired contracts by definition
  "node_modules",
  "_build",
  "audit-dashboard/.next",
  "audit-dashboard/node_modules",
  "audit-dashboard/tests",
  "examples",
];

const INCLUDE_DIRS = [
  "audit-dashboard/src",
  "design-system/02-components",
];

/* ────────────────────────────────────────────────────────────────────────── */
/* Walk + lint.                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

function shouldSkipDir(rel) {
  if (rel.startsWith(".")) return true;
  return EXEMPT_DIRS.some((d) => rel === d || rel.startsWith(d + "/"));
}

function shouldLintFile(rel) {
  const ext = extname(rel);
  if (ext !== ".tsx" && ext !== ".ts") return false;
  if (EXEMPT_FILES.has(rel)) return false;
  if (rel.endsWith(".d.ts")) return false;       // declarations are noise
  if (rel.endsWith(".stories.tsx")) return false; // Storybook fixtures
  // Only walk files under an INCLUDE_DIR
  if (!INCLUDE_DIRS.some((d) => rel === d || rel.startsWith(d + "/"))) return false;
  return true;
}

function collectFiles(dir, acc) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // dir doesn't exist — skip
  }
  for (const e of entries) {
    const abs = resolve(dir, e.name);
    const rel = relative(ROOT, abs);
    if (e.isDirectory()) {
      if (shouldSkipDir(rel)) continue;
      collectFiles(abs, acc);
    } else if (e.isFile()) {
      if (shouldLintFile(rel)) acc.push(rel);
    }
  }
}

/** Find paragraph (blank-line-delimited block) containing a given line index. */
function paragraphContaining(lines, idx) {
  let start = idx;
  while (start > 0 && lines[start - 1].trim() !== "") start--;
  let end = idx;
  while (end < lines.length - 1 && lines[end + 1].trim() !== "") end++;
  return lines.slice(start, end + 1).join(" ");
}

function hasRetirementMarker(paragraph) {
  return RETIREMENT_MARKERS.some((re) => re.test(paragraph));
}

const violations = [];
const files = [];
collectFiles(ROOT, files);

for (const rel of files) {
  const abs = resolve(ROOT, rel);
  let content;
  try {
    content = readFileSync(abs, "utf8");
  } catch (err) {
    console.error(`[lint:tsx-no-retired-prose] failed to read ${rel}: ${err.message}`);
    process.exit(1);
  }

  // File-level allow directive (in the first 20 lines)
  const head = content.split(/\r?\n/).slice(0, 20).join("\n");
  if (FILE_ALLOW_DIRECTIVE.test(head)) continue;

  const lines = content.split(/\r?\n/);

  for (const retire of RETIRED_PROSE) {
    const re = new RegExp(retire.pattern.source, retire.pattern.flags.includes("g") ? retire.pattern.flags : retire.pattern.flags + "g");
    let m;
    while ((m = re.exec(content)) !== null) {
      const upto = content.slice(0, m.index);
      const lineIdx = upto.split("\n").length - 1;
      const paragraph = paragraphContaining(lines, lineIdx);

      if (hasRetirementMarker(paragraph)) continue;

      violations.push({
        file: rel,
        line: lineIdx + 1,
        match: m[0],
        retire: retire.id,
        retiredIn: retire.retiredIn,
        replacement: retire.replacement,
      });
    }
  }
}

if (violations.length > 0) {
  console.error(`[lint:tsx-no-retired-prose] ✖ ${violations.length} prescriptive citation(s) of retired prose in TSX/TS:`);
  console.error("");
  console.error("    Each violation is a TSX surface that cites a retired CONTRACT");
  console.error("    AS IF IT WERE CURRENT. The rendered prose (description props,");
  console.error("    JSX children, JSDoc) would teach an LLM agent the wrong contract.");
  console.error("");
  console.error("    To resolve: (a) rewrite the surrounding prose to reflect the");
  console.error("    current contract, (b) add a retirement marker to the same");
  console.error("    paragraph ('retired in R11', 'was X; now Y'), or (c) add the");
  console.error("    `lumen-lint-allow: retired-prose` directive near the file head");
  console.error("    if the entire file is documenting historical context.");
  console.error("");

  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}`);
    console.error(`    match: "${v.match}"`);
    console.error(`    retired in: ${v.retiredIn}`);
    console.error(`    fix: ${v.replacement}`);
    console.error("");
  }
  process.exit(1);
}

console.log(`[lint:tsx-no-retired-prose] ✓ ${files.length} TSX/TS files scanned; no prescriptive citations of retired prose. Docs ↔ tokens ↔ TSX prose all stay in sync.`);
process.exit(0);
