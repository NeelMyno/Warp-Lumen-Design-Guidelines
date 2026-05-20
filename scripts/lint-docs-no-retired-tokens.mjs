#!/usr/bin/env node
/**
 * lint:docs-no-retired-tokens — enforce v0.14.3 R14 / ADR 0033 docs↔code sync.
 *
 * Companion to `lint:shadow-no-accent`. That script polices the TOKEN-source
 * layer (DTCG JSON in `01-tokens/`). This script polices the DOCS-prose layer
 * (every `.md` and `.txt` in the design-system + root index files).
 *
 * The R11 audit caught four doc surfaces still describing the retired green-
 * glow ladder as the canonical button contract — `buttons.md`, `USING-LUMEN.md`,
 * `llms.txt`, `llms-full.txt`. ADR 0030 shipped the docs↔code sync mandate but
 * its "docs updated" list only named 3 docs, missing the four most prominent.
 * An LLM agent reading `buttons.md` after R11 shipped would have written
 * `box-shadow: 0 0 16px var(--lumen-lime-a25)` literally and passed the token
 * lint because the offending value was INLINED, not token-referenced.
 *
 * This lint walks every `.md` and `.txt` in:
 *   - design-system/        (foundations, components, platforms, content, patterns, tokens README)
 *   - root index files      (README.md, USING-LUMEN.md, AGENTS.md, CLAUDE.md, llms.txt, llms-full.txt, etc.)
 *   - audit-dashboard/      (its README, ROUTES, AGENTS, CLAUDE)
 *
 * And fails CI when:
 *   - A retired token (e.g. `lumen-lime-a25`, `shadow-button-glow-rest = 16px lime-aXX`)
 *     appears in a PRESCRIPTIVE context (current contract being recommended) rather
 *     than a HISTORICAL context (documented as retired / superseded / pre-Rxx).
 *
 * What counts as "prescriptive":
 *   - Inside a code fence, a JSON object, a CSS rule block, or a "use this" callout
 *   - In a sentence whose nearest paragraph DOES NOT contain a retirement marker
 *     ("retired", "historical", "superseded", "was ", "pre-R11", "deprecated",
 *      "replaced", "no longer", "before R11", "before v0.14", "ADR 0030 retired")
 *
 * What's exempt (allowed even when token name appears):
 *   - The retirement ADR itself (the file documenting the retirement)
 *   - CHANGELOG.md narrative (per-release history is allowed to cite old token names)
 *   - Files under `_meta/audits/` (historical audit logs)
 *   - Files under `.audit-runs/` (historical Lighthouse / contrast / visual audit logs)
 *   - This lint script and its sibling lint scripts (need the strings to ban)
 *   - The audit-dashboard's source code (uses tokens at runtime — that's a different lint surface)
 *   - JSON token sources (lint-shadow-no-accent.mjs polices those)
 *
 * Retire-list is data-driven; future retirements add an entry to RETIRED below
 * instead of grep-replacing across the doc tree.
 *
 * Exit codes:
 *   0 — no violations
 *   1 — at least one doc cites a retired token prescriptively
 */

import { readFileSync, statSync, readdirSync } from "node:fs";
import { resolve, dirname, relative, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ────────────────────────────────────────────────────────────────────────── */
/* Data-driven retire-list. Add an entry here when retiring a token / contract. */
/* Each pattern can be a regex (for fuzzy match) or a string (for exact match). */
/* The "context" field describes WHERE the retired thing must NOT be cited as   */
/* current — used in the error message so a future agent fixing the violation  */
/* understands what to write instead.                                          */
/* ────────────────────────────────────────────────────────────────────────── */

const RETIRED = [
  // --- v0.14 R11 / ADR 0030 — no green in any box-shadow color ---
  {
    id: "R11-lime-shadow",
    pattern: /\blumen-lime-a(?:08|14|18|20|25|28|32|40|64)\b/g,
    context: "box-shadow color value",
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement:
      "for box-shadow: var(--border-frame), var(--shadow-focus), var(--shadow-md), or none. " +
      "Lime alphas are still valid for backgrounds, borders, text, leading dots, and aurora gradients.",
    /** A line is OK if it carries one of these contextual cues — historical citation. */
    contextHints: [
      "non-shadow",
      "background",
      "border",
      "text",
      "leading dot",
      "aurora",
    ],
  },
  {
    id: "R11-glow-recipe",
    pattern: /\b0 0 (?:8|16|20|24|32|48)px\s+(?:var\(--)?lumen-lime-a\d+/gi,
    context: "primary-CTA / focus-ring / input glow recipe",
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement:
      "shadow-button-glow-rest = none; hover = var(--shadow-md); active = none. " +
      "Focus = var(--shadow-focus) (theme-aware neutral). The 3-stop atmospheric halo retired.",
    contextHints: [],
  },
  {
    id: "R11-focus-outline",
    pattern: /\boutline:\s*\d+px\s+(?:solid\s+)?var\(--lumen-(?:lime|accent)-a\d+\)/gi,
    context: ":focus-visible outline color",
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement: "outline: 2px solid var(--border-frame); outline-offset: 1px;",
    contextHints: [],
  },
  {
    id: "R11-focus-dual-outer",
    pattern: /\b0 0 0 4px\s+var\(--lumen-(?:accent|lime)-(?:4|a64)\)/gi,
    context: "dual-ring outer ring (primary-CTA :focus-visible)",
    retiredIn: "v0.14 R11 / ADR 0030",
    replacement: "0 0 0 4px var(--border-frame) — neutral outer ring",
    contextHints: [],
  },
  // --- Future retirements append here. Pattern: { id, pattern, context, retiredIn, replacement, contextHints }. ---
];

/* ────────────────────────────────────────────────────────────────────────── */
/* Paragraph-level retirement markers — if any of these appear in the SAME    */
/* paragraph as a retired-token mention, the lint allows it as historical.    */
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
  /\bunchanged across v0\.1[12]/i,    // historical preserved-through-version phrasing
  /\bwas\s+`?0\s+0\s+\d+px/i,         // "was 0 0 16px lime-..." marker for old recipe
  /\bwas\s+`?\d+px\s+lime/i,
  /\bwas\s+`?var\(--lumen-(?:lime|accent)/i,
  /\bwas\s+`var\(--lumen-(?:lime|accent)/i,
  /\bno longer\b/i,
  /\bADR 0030\b/i,
  /\bv0\.14 R11\b/i,
  /\bR11\s+retired\b/i,
  /\bR11\s+retunes?\b/i,
  /\bR11 \(/i,
  /\bretires?\b/i,
  /\bv0\.14\.3\b/i,                   // R14 retirement-ADR self-references
  /\bR14\b/i,
];

/* ────────────────────────────────────────────────────────────────────────── */
/* File-level exemptions. These files document HISTORY (changelogs, audit     */
/* logs, the retirement ADR itself, sibling lint scripts that need the        */
/* strings to ban). Skipped entirely.                                         */
/* ────────────────────────────────────────────────────────────────────────── */

const EXEMPT_FILES = new Set([
  "CHANGELOG.md",
  "_meta/decisions/0022-hover-glow-ladder-retune-v0122.md",
  "_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md",
  "_meta/decisions/0033-r14-docs-tokens-drift-lint-v0143.md",
  "_meta/decisions/0034-r15-tsx-prose-lint-third-tier-v0144.md",
  "scripts/lint-shadow-no-accent.mjs",
  "scripts/lint-docs-no-retired-tokens.mjs",
  "scripts/lint-tsx-no-retired-prose.mjs",
]);

const EXEMPT_DIRS = [
  ".audit-runs",
  "_meta/audits",
  "node_modules",
  "_build",
  "audit-dashboard/.next",
  "audit-dashboard/node_modules",
  "examples", // user's ad-hoc work folder
];

/* ────────────────────────────────────────────────────────────────────────── */
/* Walk the repo, collect .md and .txt files, lint each.                       */
/* ────────────────────────────────────────────────────────────────────────── */

function shouldSkipDir(rel) {
  if (rel.startsWith(".")) {
    // allow ".audit-runs" through the EXEMPT_DIRS check; skip ".git", ".turbo", etc.
    if (rel === ".audit-runs") return true;
    return true;
  }
  return EXEMPT_DIRS.some((d) => rel === d || rel.startsWith(d + "/"));
}

function shouldLintFile(rel) {
  const ext = extname(rel);
  if (ext !== ".md" && ext !== ".txt") return false;
  if (EXEMPT_FILES.has(rel)) return false;
  return true;
}

function collectFiles(dir, acc) {
  const entries = readdirSync(dir, { withFileTypes: true });
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

function hasContextHint(paragraph, hints) {
  return hints.some((h) => new RegExp(`\\b${h}\\b`, "i").test(paragraph));
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
    console.error(`[lint:docs-no-retired-tokens] failed to read ${rel}: ${err.message}`);
    process.exit(1);
  }
  const lines = content.split(/\r?\n/);

  for (const retire of RETIRED) {
    // reset regex state for global flag
    retire.pattern.lastIndex = 0;
    let m;
    while ((m = retire.pattern.exec(content)) !== null) {
      // Find which line this match is on
      const upto = content.slice(0, m.index);
      const lineIdx = upto.split("\n").length - 1;
      const paragraph = paragraphContaining(lines, lineIdx);

      // Skip if the paragraph documents this AS retired (historical context)
      if (hasRetirementMarker(paragraph)) continue;
      // Skip if a context hint matches (e.g. "background" allows lime references)
      if (retire.contextHints.length && hasContextHint(paragraph, retire.contextHints)) continue;

      violations.push({
        file: rel,
        line: lineIdx + 1,
        match: m[0],
        retire: retire.id,
        retiredIn: retire.retiredIn,
        context: retire.context,
        replacement: retire.replacement,
      });
    }
  }
}

if (violations.length > 0) {
  console.error(`[lint:docs-no-retired-tokens] ✖ ${violations.length} prescriptive citation(s) of retired token(s):`);
  console.error("");
  console.error("    Each violation is a docs surface that cites a retired token / recipe");
  console.error("    AS IF IT WERE THE CURRENT CONTRACT. To resolve: either (a) rewrite");
  console.error("    the surrounding prose to reflect the current value, or (b) add a");
  console.error("    retirement marker to the same paragraph (e.g. 'retired in R11',");
  console.error("    'was X; now Y', 'historical — superseded by ADR 00XX').");
  console.error("");

  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}`);
    console.error(`    match: ${v.match}`);
    console.error(`    retired in: ${v.retiredIn}`);
    console.error(`    context: ${v.context}`);
    console.error(`    use: ${v.replacement}`);
    console.error("");
  }
  process.exit(1);
}

console.log(`[lint:docs-no-retired-tokens] ✓ ${files.length} doc files scanned; no prescriptive citations of retired tokens. Docs ↔ tokens stay in sync.`);
process.exit(0);
