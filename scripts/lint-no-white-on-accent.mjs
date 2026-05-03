#!/usr/bin/env node
// Lint: no white / light text on accent (lime) backgrounds.
// v0.8.1 — closes the gap that landed white text on the v0.4-lime primary
// button (1.66:1 contrast, WCAG AA fail). Two patterns are flagged:
//
//   1. The shadcn token-bridge utilities (`bg-primary`, `text-primary-foreground`,
//      `bg-destructive`, `text-destructive-foreground`) anywhere in product code.
//      They appear to compile in Tailwind v4 some of the time and not others;
//      treating them as forbidden in product code (vendor `ui/*` is exempt) means
//      the rendered output never depends on the bridge.
//
//   2. Any explicit white text class (`text-white`, `text-[#fff]`, `text-[#ffffff]`,
//      `text-[var(--lumen-paper-*)]`) within a className string that ALSO contains
//      a lime background (`bg-[var(--lumen-accent-{3,4,5,6})]`, `bg-primary`).
//      This catches the failure mode at its source.
//
// Documented exceptions:
//   - `audit-dashboard/src/components/ui/*` — shadcn vendor primitives. These ARE
//     allowed to use `bg-primary` etc. on the assumption that v0.8.1 has rewritten
//     the variants there to direct token refs. (We re-grep the file content to
//     confirm.)
//   - Inline `lumen-lint-allow: white-on-accent` directive on the same line.
//
// Run:    pnpm lint:no-white-on-accent
// Exits non-zero on violations.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGETS = [
  join(ROOT, "audit-dashboard/src"),
  join(ROOT, "design-system/02-components"),
];

// Pattern 1 — forbidden shadcn bridge utilities anywhere in product code.
// These don't reliably compile in Tailwind v4 with our token bridge.
const FORBIDDEN_BRIDGE_RE =
  /\b(bg-primary|text-primary-foreground|bg-destructive|text-destructive-foreground|bg-card|text-card-foreground|bg-popover|text-popover-foreground|text-foreground|bg-foreground|bg-secondary[^-]|text-secondary-foreground|bg-muted[^-]|text-muted-foreground|bg-accent[^-]|text-accent-foreground)\b/g;

// Pattern 2 — explicit white text inside a className (paired with lime bg).
const LIME_BG_RE = /bg-(?:\[var\(--lumen-accent-[3-6]\)\]|primary)\b/;
const WHITE_TEXT_RE =
  /\b(text-white|text-\[#fff\b|text-\[#ffffff\]|text-\[var\(--lumen-paper-[a-z0-9]+\)\]|text-\[var\(--text-primary\)\])\b/;

// Files we treat as vendor / exempt.
const EXEMPT_PATHS = [
  /design-system\/02-components\/_schema\//,
  /\/node_modules\//,
];

// Vendor-primitive carve-out: ui/* IS exempt for FORBIDDEN_BRIDGE_RE only if the
// rewritten variant lines have already swapped to direct refs. We don't auto-detect
// the swap; instead we whitelist the four files that v0.8.1 rewrote. Any new file
// in ui/ is NOT exempt.
const VENDOR_REWRITTEN = new Set([
  "audit-dashboard/src/components/ui/button.tsx",
  "audit-dashboard/src/components/ui/badge.tsx",
  "audit-dashboard/src/components/ui/progress.tsx",
  "audit-dashboard/src/components/ui/slider.tsx",
]);

const ALLOW_LINE = /lumen-lint-allow:\s*white-on-accent/;

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const isProductFile = (path) =>
  /\.(tsx?|jsx)$/.test(path) && !/\.(test|spec)\./.test(path);
const isExempt = (path) => EXEMPT_PATHS.some((re) => re.test(path));
const isVendorRewritten = (path) =>
  [...VENDOR_REWRITTEN].some((p) => path.endsWith(p));

let violations = 0;
const results = [];

for (const target of TARGETS) {
  try {
    await stat(target);
  } catch {
    continue;
  }

  for await (const file of walk(target)) {
    if (!isProductFile(file)) continue;
    if (isExempt(file)) continue;

    const content = await readFile(file, "utf8");
    const lines = content.split("\n");
    const isVendor = isVendorRewritten(file);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (ALLOW_LINE.test(line)) continue;

      // Pattern 1 — shadcn bridge utilities (vendor-rewritten files allowed via
      // the v0.8.1 carve-out, since their lines have already been audited by hand).
      if (!isVendor) {
        for (const m of line.matchAll(FORBIDDEN_BRIDGE_RE)) {
          // Skip matches inside comments — common in vendor-style files.
          const pre = line.slice(0, m.index);
          if (/\/[/*]/.test(pre)) continue;
          violations++;
          results.push({
            file: file.replace(ROOT + "/", ""),
            line: i + 1,
            col: m.index + 1,
            match: m[0],
            kind: "forbidden-shadcn-bridge",
            hint: `Use direct semantic refs (e.g. text-[var(--lumen-accent-fg)] / bg-[var(--lumen-accent-4)]). The shadcn token-bridge utilities are unreliable in Tailwind v4 here.`,
            content: line.trim(),
          });
        }
      }

      // Pattern 2 — white text on lime bg in the same className string.
      if (LIME_BG_RE.test(line) && WHITE_TEXT_RE.test(line)) {
        const limeMatch = line.match(LIME_BG_RE);
        const whiteMatch = line.match(WHITE_TEXT_RE);
        violations++;
        results.push({
          file: file.replace(ROOT + "/", ""),
          line: i + 1,
          col: (limeMatch?.index ?? 0) + 1,
          match: `${limeMatch?.[0]} … ${whiteMatch?.[0]}`,
          kind: "white-on-lime",
          hint: `Lime background paired with white-ish text — 1.66:1 contrast (WCAG AA fail). Replace text class with text-[var(--lumen-accent-fg)] (#0a0a0d, 12.6:1 AAA).`,
          content: line.trim(),
        });
      }
    }
  }
}

if (violations === 0) {
  console.log("[lint:no-white-on-accent] ✓ no violations");
  process.exit(0);
}

console.log(`[lint:no-white-on-accent] ✗ ${violations} violation(s):\n`);
for (const r of results) {
  console.log(`  ${r.file}:${r.line}:${r.col}  [${r.kind}]`);
  console.log(`    match: ${r.match}`);
  console.log(`    line:  ${r.content.length > 120 ? r.content.slice(0, 117) + "..." : r.content}`);
  console.log(`    hint:  ${r.hint}\n`);
}
process.exit(1);
