#!/usr/bin/env node
/**
 * lint:no-undefined-token-vars — the 5th-tier lint (v0.15 R16, ADR 0035).
 *
 * Closes the typo class surfaced by the TMS consumer (chat 36-A, May 20 2026).
 * The consumer wrote `text-[var(--color-text-on-accent,white)]` 11+ times
 * across an operator console. The token `--color-text-on-accent` DID NOT
 * EXIST in the v0.14 :root token bridge (only `--color-fg-on-accent` did —
 * a confusing lookalike). Tailwind v4 compiled the class with the
 * (intended) fallback `white`, BUT the content scanner dropped the
 * comma-fallback, leaving `color: var(--color-text-on-accent)` to resolve
 * against an undefined variable. The text inherited `currentColor` from
 * the cascade (`--text-primary` = #E6E6E6) and painted at 1.66:1 contrast
 * on Spring Green.
 *
 * This lint walks every TSX / TS / CSS / MD / TXT file in audit-dashboard +
 * design-system + the doc tree, extracts every `var(--lumen-*)` and
 * `var(--color-*)` reference, and asserts that the variable is defined
 * either in `audit-dashboard/src/app/globals.css` :root or in one of the
 * primitive token files. Any reference to a NAME that doesn't exist is a
 * violation.
 *
 * Why this matters:
 *   - v0.14's 5-name sprawl for "text on accent" (--text-on-accent /
 *     --primary-foreground / --color-fg-on-accent / --color-primary-foreground /
 *     --color-accent-foreground) trained authors to guess. The TMS consumer's
 *     `--color-text-on-accent` guess was wrong — but the failure was silent.
 *   - The lint forces the wrong guess to fail loudly at CI time, with a
 *     hint pointing to the canonical name + the defensive class.
 *   - v0.15.0 R16 adds --color-text-on-accent as the canonical alias; this
 *     lint asserts it (and every other --color-* / --lumen-* reference)
 *     stays defined in the token bridge going forward.
 *
 * Allowlist directives:
 *   - inline `lumen-lint-allow: undefined-token-var` on the same line OR
 *     the immediately preceding line. Use for intentionally-fallback-only
 *     patterns like `var(--my-app-override, var(--color-text-on-accent))`.
 *   - file-level `lumen-lint-allow: undefined-token-var` in the first 20
 *     lines for vendor / fixture files that document old contracts.
 *
 * Exempt paths:
 *   - node_modules/, _build/, dist/, .audit-runs/, .next/
 *   - CHANGELOG.md (historical version mentions)
 *   - _meta/decisions/ ADRs (historical token names)
 *   - any path matching /\.(test|spec)\./
 *
 * Run:    pnpm lint:no-undefined-token-vars
 * Exits non-zero on violations.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/** Source files where token DEFINITIONS live. We extract `--lumen-*` and
 *  `--color-*` declarations from these to build the defined-set. */
const TOKEN_DEFINITION_FILES = [
  join(ROOT, "audit-dashboard/src/app/globals.css"),
];

/** Walked roots where token REFERENCES are validated. */
const REFERENCE_TARGETS = [
  join(ROOT, "audit-dashboard/src"),
  join(ROOT, "design-system/02-components"),
  join(ROOT, "design-system/00-foundations"),
  join(ROOT, "design-system/05-patterns"),
];

const EXEMPT_PATHS = [
  /\/node_modules\//,
  /\/_build\//,
  /\/dist\//,
  /\/\.audit-runs\//,
  /\/\.next\//,
  /\/_meta\/decisions\//,            // ADRs may cite historical names
  /CHANGELOG\.md$/,
  /\.(test|spec)\./,
];

const isReferenceFile = (p) =>
  /\.(tsx?|jsx|css|md|mdx|txt)$/.test(p);
const isExempt = (p) => EXEMPT_PATHS.some((re) => re.test(p));

const ALLOW_LINE = /lumen-lint-allow:\s*undefined-token-var/;

async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

/** Extract `--lumen-*` and `--color-*` declarations from a CSS file's source.
 *  Captures the variable name without the leading `--`. */
const DEFINITION_RE = /(--(?:lumen|color)-[a-zA-Z0-9_-]+)\s*:/g;

const definedTokens = new Set();
for (const file of TOKEN_DEFINITION_FILES) {
  let src;
  try { src = await readFile(file, "utf8"); }
  catch (e) {
    console.error(`[lint:no-undefined-token-vars] failed to read token source ${file}: ${e.message}`);
    process.exit(1);
  }
  for (const m of src.matchAll(DEFINITION_RE)) {
    definedTokens.add(m[1]);
  }
}

if (definedTokens.size === 0) {
  console.error("[lint:no-undefined-token-vars] no token definitions found — check TOKEN_DEFINITION_FILES");
  process.exit(1);
}

/** Match `var(--lumen-*)` / `var(--color-*)` references. Capture the
 *  variable name (without leading `--`) AND the index for position
 *  reporting. */
const REFERENCE_RE = /var\(\s*(--(?:lumen|color)-[a-zA-Z0-9_-]+)/g;

let violations = 0;
const results = [];

for (const target of REFERENCE_TARGETS) {
  try { await stat(target); } catch { continue; }

  for await (const file of walk(target)) {
    if (!isReferenceFile(file)) continue;
    if (isExempt(file)) continue;

    const content = await readFile(file, "utf8");
    const lines = content.split("\n");

    // File-level allowlist directive.
    const header = lines.slice(0, 20).join("\n");
    if (ALLOW_LINE.test(header)) continue;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const prevLine = i > 0 ? lines[i - 1] : "";
      if (ALLOW_LINE.test(line) || ALLOW_LINE.test(prevLine)) continue;

      REFERENCE_RE.lastIndex = 0;
      let m;
      while ((m = REFERENCE_RE.exec(line)) !== null) {
        const name = m[1];
        // Skip partial captures — a variable name ending with `-` is a
        // prose-style placeholder like `var(--lumen-accent-N)` referenced
        // inside an explanatory paragraph. CSS variable names always end
        // with a letter / digit / underscore.
        if (/-$/.test(name)) continue;
        if (definedTokens.has(name)) continue;
        violations++;
        results.push({
          file: file.replace(ROOT + "/", ""),
          line: i + 1,
          col: m.index + 1,
          name,
          hint: hintFor(name),
          content: line.trim(),
        });
      }
    }
  }
}

/** Hint generator — surface the canonical alternative when we recognize
 *  the typo class. */
function hintFor(name) {
  // The TMS-class typos.
  if (/^--color-text-on-/.test(name) && !definedTokens.has(name)) {
    return `Did you mean --color-text-on-accent? See defensive-classes.md.`;
  }
  if (/^--color-on-/.test(name) && !definedTokens.has(name)) {
    return `Did you mean --color-on-accent (terse) or --color-text-on-accent (canonical)?`;
  }
  if (/^--color-accent-fg/.test(name) && !definedTokens.has(name)) {
    return `Did you mean --color-text-on-accent? (--color-accent-foreground is shadcn-bridge GREEN TEXT — different semantics.)`;
  }
  if (/^--lumen-(accent|lime|paper|ink|obsidian|cream|red|amber|void)-/.test(name)) {
    return `Primitive token ${name} not defined. Check audit-dashboard/src/app/globals.css :root for the canonical name, or use a semantic alias like --text-primary / --surface-raised / --color-action-primary-fg.`;
  }
  return `Token ${name} not defined in :root. Add to globals.css or use an existing alias. Best: reach for a defensive class (.lumen-btn-primary / .lumen-pill-active / .lumen-empty-state) which consumes audited tokens internally.`;
}

if (violations === 0) {
  console.log(`[lint:no-undefined-token-vars] ✓ ${definedTokens.size} tokens defined; every reference resolves.`);
  process.exit(0);
}

console.error(`[lint:no-undefined-token-vars] ✖ ${violations} undefined-token reference(s):\n`);
for (const r of results) {
  console.error(`  ${r.file}:${r.line}:${r.col}  var(${r.name})`);
  console.error(`    line:  ${r.content.length > 120 ? r.content.slice(0, 117) + "..." : r.content}`);
  console.error(`    hint:  ${r.hint}\n`);
}
process.exit(1);
