#!/usr/bin/env node
// Lint: form/input chrome must come from the .lumen-field shell (and its
// dedicated tokens), not from arbitrary Tailwind values or primitive reach-throughs.
// Per ADR 0011, the v0.5 bug class — where every consumer rolled its own
// focus-ring / error-ring / disabled / autofill recipe — is forbidden in v0.6.
// Walks audit-dashboard/src/**/*.{ts,tsx,jsx} and exits non-zero on violations.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGET = join(ROOT, "audit-dashboard/src");

// Patterns we forbid in product code. Each carries a description used in the
// violation report. The directives are inline-disablable via `lumen-lint-allow:
// form-values` on the same or next line, or via a block-disable (start/end).
const FORBIDDEN = [
  {
    re: /focus-within:shadow-\[[^\]]+\]/g,
    msg: "Arbitrary focus-within box-shadow on a form wrapper. Wrap the control in <Field> (or .lumen-field) and let the shell paint the ring; never roll your own.",
  },
  {
    re: /aria-invalid:focus-visible:shadow-\[[^\]]+\]/g,
    msg: "Arbitrary error+focus-visible recipe. Use the var(--shadow-input-error) token via the .lumen-field shell.",
  },
  {
    re: /focus-visible:shadow-\[0 0 0 \d/g,
    msg: "Inline focus-ring shadow recipe on a form control. Use --shadow-input-focus or the .lumen-field shell which already paints the ring.",
  },
  // Note: direct primitive color reaches (bg/text/border-[var(--lumen-red-N)],
  // --lumen-amber-N) have legitimate non-form uses (spacing demos, workspace
  // icons, swatch grids). They are caught only when paired with form-state
  // selectors below. lint-no-primitives handles the broader case.
  {
    re: /aria-invalid:[^"\s]*border-\[var\(--lumen-red-\d+\)\]/g,
    msg: "Direct primitive reach for the error-state border. Use semantic --border-error token (added in v0.6).",
  },
  {
    re: /focus-visible:[^"\s]*border-\[var\(--lumen-red-\d+\)\]/g,
    msg: "Direct primitive reach for the focus-error border. Use semantic --border-error token (added in v0.6).",
  },
  // Note: hardcoded pixel radii are caught by lint-no-primitives.
  // Form-values lint focuses on form-specific recipes.
];

const isProductFile = (path) => /\.(tsx?|jsx)$/.test(path);
const isTestFile = (path) => /\.(test|spec)\.[a-z]+$/.test(path);

// Path-based exemptions. Showcase / demo code legitimately renders the full
// scale of every primitive's variants and may need raw recipes; product code
// must not.
const EXEMPT_PATHS = [
  // Primitive showcase components — render every state for the demo tab.
  /\/audit-dashboard\/src\/components\/primitives\//,
  // shadcn/ui base components — Tailwind chains here are intentionally raw
  // because they declare the base shell that .lumen-field overrides.
  /\/audit-dashboard\/src\/components\/ui\//,
];
const isPathExempt = (path) => EXEMPT_PATHS.some((re) => re.test(path));

const ALLOW_LINE = /lumen-lint-allow:\s*(form-values|all)/i;
const ALLOW_BLOCK_START = /lumen-lint-allow-block:\s*(form-values|all)/i;
const ALLOW_BLOCK_END = /lumen-lint-allow-end:\s*(form-values|all)/i;

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
      // Also exempt the next non-empty line so the directive can sit ABOVE.
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === "") continue;
        exempt.add(j);
        break;
      }
    }
  }

  for (const { re, msg } of FORBIDDEN) {
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
  console.error(`\n${violations} arbitrary-value form/input violations found.`);
  process.exit(1);
}

console.log("No arbitrary-value form/input recipes. ✓");
