#!/usr/bin/env node
// Lint: product code must use Lumen v0.5 semantic typography utilities.
// Per ADR 0010, raw `text-[var(--type-N)] tracking-[...] leading-[...] font-[...]`
// arbitrary-value chains are forbidden in audit-dashboard product code.
// Use semantic classes instead: text-display-*, text-heading-*, text-body-*,
// text-data-*, text-metric-*, text-eyebrow-*, text-prose-*.
// Walks audit-dashboard/src/**/*.{ts,tsx,jsx} and exits non-zero on violations.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGET = join(ROOT, "audit-dashboard/src");

// Patterns we forbid in product code.
// Each pattern carries a description used in the violation report.
const FORBIDDEN = [
  {
    re: /text-\[var\(--type-\d+\)\]/g,
    msg: "Arbitrary type-scale class. Use a semantic typography utility (text-display-*, text-heading-h*, text-body-*, text-data-*, text-metric-*, text-eyebrow-*, text-prose-*).",
  },
  {
    re: /tracking-\[var\(--tracking-[^\]]+\)\]/g,
    msg: "Arbitrary tracking class. Tracking is bundled into the semantic typography utility.",
  },
  {
    re: /leading-\[var\(--leading-[^\]]+\)\]/g,
    msg: "Arbitrary leading class. Line-height is bundled into the semantic typography utility.",
  },
  {
    // font-[var(--font-...)] but NOT --font-sans (the only Lumen family root var post-v0.10 / ADR 0017).
    // --font-mono / --font-serif / --font-alt-sans / --font-jetbrains were retired in v0.10
    // and now flag — references in product code should use --font-sans (or a semantic typography utility).
    re: /font-\[var\(--font-(?!sans\))[^\]]+\)\]/g,
    msg: "Arbitrary font weight/family class. Weight is bundled into the semantic typography utility; only --font-sans is exempt (Lumen is Satoshi-only post-v0.10 / ADR 0017).",
  },
];

// Allow the new utility class definitions themselves (CSS), tests, and globals.css.
const isProductFile = (path) => /\.(tsx?|jsx)$/.test(path);
const isTestFile = (path) => /\.(test|spec)\.[a-z]+$/.test(path);

// Path-based exemptions. These directories contain DEMO/showcase code whose job is
// to render the type system at every size — including intermediate stops that have
// no semantic preset. They are not product code.
const EXEMPT_PATHS = [
  // Primitive showcase components — render every size to demo the scale.
  /\/audit-dashboard\/src\/components\/primitives\//,
  // shadcn/ui base components — installed verbatim from upstream registry; their
  // text classes follow shadcn conventions (text-sm, text-xs) which are unrelated
  // to Lumen semantic tokens. Wrap a Lumen-styled <Text> over them in product code.
  /\/audit-dashboard\/src\/components\/ui\//,
];
const isPathExempt = (path) => EXEMPT_PATHS.some((re) => re.test(path));

// Inline disable directives. Mirrors common lint conventions.
//   `// lumen-lint-allow: typography` — exempt the SAME line OR the NEXT non-empty line.
//   `/* lumen-lint-allow: typography */` — same.
//   `// lumen-lint-allow-block: typography` — start of a contiguous exempt region.
//   `// lumen-lint-allow-end: typography`  — end of the region.
// The token "typography" can also be the bare word "all" to exempt every check.
const ALLOW_LINE = /lumen-lint-allow:\s*(typography|all)/i;
const ALLOW_BLOCK_START = /lumen-lint-allow-block:\s*(typography|all)/i;
const ALLOW_BLOCK_END = /lumen-lint-allow-end:\s*(typography|all)/i;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let violations = 0;
const violationsByFile = new Map();

try {
  await stat(TARGET);
} catch {
  console.error(`Target directory not found: ${TARGET}`);
  process.exit(1);
}

for await (const file of walk(TARGET)) {
  if (!isProductFile(file)) continue;
  if (isTestFile(file)) continue;
  if (isPathExempt(file)) continue;
  if (file.endsWith("globals.css")) continue;

  const content = await readFile(file, "utf8");
  const lines = content.split("\n");

  // Pre-compute exemption set: which line indices are allowed?
  const exempt = new Set();
  let inBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (ALLOW_BLOCK_START.test(line)) { inBlock = true; continue; }
    if (ALLOW_BLOCK_END.test(line)) { inBlock = false; continue; }
    if (inBlock) { exempt.add(i); continue; }
    if (ALLOW_LINE.test(line)) {
      exempt.add(i);
      // Also exempt the next non-empty line so the directive can sit ABOVE the line it covers.
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === "") continue;
        exempt.add(j);
        break;
      }
    }
  }

  for (const { re, msg } of FORBIDDEN) {
    // Reset regex state for each file (global flag carries lastIndex).
    re.lastIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (exempt.has(i)) continue;
      const line = lines[i];
      const matches = line.match(re);
      if (matches) {
        for (const match of matches) {
          violations++;
          if (!violationsByFile.has(file)) violationsByFile.set(file, []);
          violationsByFile.get(file).push({ line: i + 1, match, msg });
        }
      }
    }
  }
}

if (violations > 0) {
  for (const [file, hits] of violationsByFile) {
    console.error(`\n${file}`);
    for (const { line, match, msg } of hits) {
      console.error(`  ${line}: ${match}`);
      console.error(`     ${msg}`);
    }
  }
  console.error(`\n${violations} arbitrary-value typography violations found.`);
  process.exit(1);
}

console.log("No arbitrary-value typography. ✓");
