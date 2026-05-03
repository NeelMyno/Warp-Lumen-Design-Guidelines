#!/usr/bin/env node
// Lint: no off-grid spacing in audit-dashboard product code.
// v0.8 — flags Tailwind half-step utilities (gap-1.5, px-2.5, mt-0.5, etc.) which
// produce 6/10/14/2 px values that violate the 4-pt base / 8-pt soft grid.
//
// Documented exceptions:
//   - 6 px is the documented sub-grid stop (use `var(--space-1_5)` or `space.1_5`)
//   - 2 px is reserved for hairlines (use `var(--space-px)`)
//   - radius is NOT subject to the grid (rounded-1.5 / rounded-3.5 are not flagged)
//   - shadcn-sourced files in `audit-dashboard/src/components/ui/` are exempt
//     (vendor primitives stay verbatim from upstream)
//
// Run:   pnpm lint:no-off-grid-spacing
// Exits non-zero on violations.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGET = join(ROOT, "audit-dashboard/src");

// Match Tailwind spacing utilities with half/quarter-step suffixes.
// Captures: prefix (gap/p/m/h/w/space-x/space-y), modifier (any-letter), value (0.5/1.5/2.5/3.5).
const HALF_STEP_RE = /\b(gap|p[trblxy]?|m[trblxy]?|space-[xy]|h|w|inset[trbl]?|top|right|bottom|left)-(0\.5|1\.5|2\.5|3\.5)\b/g;

// Match inline style px literals on padding/margin/gap/inset (not radius/border).
// e.g. style={{ padding: "10px" }} or style={{ gap: 14 }}.
const INLINE_PX_RE = /\b(padding|margin|gap|inset|top|right|bottom|left|width|height|min-?width|min-?height|max-?width|max-?height)(-?(left|right|top|bottom|inline|block|x|y))?\s*:\s*["']?(\d{1,3})(?:\s*px)?["']?/gi;

// Path-based exemptions.
const EXEMPT_PATHS = [
  /audit-dashboard\/src\/components\/ui\//,        // shadcn vendor primitives
  /audit-dashboard\/src\/components\/icon\.tsx$/,  // SVG dimensions
];

// Inline directive support (matches lint-no-arbitrary-typography pattern).
const ALLOW_LINE = /lumen-lint-allow:\s*off-grid/;
const ALLOW_BLOCK_START = /lumen-lint-allow-block:\s*off-grid/;
const ALLOW_BLOCK_END = /lumen-lint-allow-end:\s*off-grid/;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const isProductFile = (path) => /\.(tsx?|jsx)$/.test(path) && !/\.(test|spec)\./.test(path);
const isExempt = (path) => EXEMPT_PATHS.some((re) => re.test(path));

let violations = 0;
const results = [];

try {
  await stat(TARGET);
} catch {
  console.log("(target dir missing)");
  process.exit(0);
}

for await (const file of walk(TARGET)) {
  if (!isProductFile(file)) continue;
  if (isExempt(file)) continue;
  const content = await readFile(file, "utf8");
  const lines = content.split("\n");
  let inAllowBlock = false;
  let prevLineHadAllow = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (ALLOW_BLOCK_START.test(line)) inAllowBlock = true;
    if (ALLOW_BLOCK_END.test(line)) inAllowBlock = false;

    const lineHasAllow = ALLOW_LINE.test(line);
    if (inAllowBlock || lineHasAllow || prevLineHadAllow) {
      prevLineHadAllow = lineHasAllow;
      continue;
    }
    prevLineHadAllow = false;

    const halfMatches = [...line.matchAll(HALF_STEP_RE)];
    for (const m of halfMatches) {
      results.push({
        file,
        line: i + 1,
        match: m[0],
        msg: `Off-grid Tailwind half-step "${m[0]}". 6 px → use \`[var(--space-1_5)]\` or round to 4/8. Else round to nearest 4-multiple.`,
      });
      violations++;
    }

    // Inline-style px literals — only count obvious spacing properties (skip radius/border-width).
    const stylelLikely = /\bstyle\s*=\s*\{\{/.test(line) || /\bstyle\s*:\s*\{/.test(line);
    if (stylelLikely) {
      const inlineMatches = [...line.matchAll(INLINE_PX_RE)];
      for (const m of inlineMatches) {
        const val = Number(m[4]);
        // Allow 0, 1 (hairline), and any 4-multiple. Flag others on spacing properties only.
        if (!isNaN(val) && val !== 0 && val !== 1 && val % 4 !== 0) {
          results.push({
            file,
            line: i + 1,
            match: m[0],
            msg: `Inline-style off-grid px value "${m[0]}". Use a token (var(--space-*) or var(--size-*)).`,
          });
          violations++;
        }
      }
    }
  }
}

if (violations === 0) {
  console.log("No off-grid spacing. ✓");
  process.exit(0);
}

const byFile = new Map();
for (const r of results) {
  if (!byFile.has(r.file)) byFile.set(r.file, []);
  byFile.get(r.file).push(r);
}
for (const [file, items] of byFile) {
  console.error(`✗ ${file.replace(ROOT + "/", "")}`);
  for (const it of items) {
    console.error(`    L${it.line}: ${it.msg}`);
  }
}
console.error(`\n${violations} off-grid spacing violation(s). Add inline directive \`// lumen-lint-allow: off-grid\` if intentional + documented.`);
process.exit(1);
