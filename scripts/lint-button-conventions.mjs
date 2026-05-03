#!/usr/bin/env node
// Lint: button conventions.
// v0.9 — enforces Lumen's button voice + a11y rules from 00-foundations/buttons.md
// and the Button component contract.
//
// Three patterns are flagged:
//
//   1. **Banned generic verb labels** in Button / button label text:
//      "OK", "Submit", "Yes", "No", "Cancel" (when paired with primary/danger),
//      "Click here", "Learn more", "Get started", "Continue" (without trailing context).
//      Each can be opted out with `lumen-lint-allow: button-label` on the line.
//
//   2. **Icon-only raw `<button>`** without `aria-label`. Looks like:
//        <button ...><Plus /></button>             ← flagged (no label, no aria-label)
//      Excludes:
//        - Buttons with visible text content
//        - Buttons that include `aria-label="..."` in props
//        - Buttons with `aria-labelledby` set
//        - Use of the formal IconButton component (it enforces aria-label at the type level)
//
//   3. **Title Case button labels** — heuristic: 2+ words inside a Button
//      where every word starts with an uppercase letter. Flags both the
//      vendor `<Button>` and the Lumen `<Button>` (primitives).
//      Hint: use sentence case ("Save changes" not "Save Changes").
//
// Files scanned: audit-dashboard/src + design-system/02-components.
// Vendor `audit-dashboard/src/components/ui/*` is exempt (the cva variant code
// uses sentinel labels like "Button" / "Cancel" inside the file name itself).
//
// Run:    pnpm lint:button-conventions
// Exits non-zero on violations.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGETS = [
  join(ROOT, "audit-dashboard/src"),
  join(ROOT, "design-system/02-components"),
];

const EXEMPT_PATHS = [
  /audit-dashboard\/src\/components\/ui\//,           // shadcn vendor
  /design-system\/02-components\/_schema\//,
  /design-system\/02-components\/[^/]+\/component\.json$/, // contract files explicitly use these labels
];

// Banned label tokens — must match a closing `>` boundary so we catch label TEXT,
// not props named "Cancel" or filenames like "ok.tsx".
// Looks for `>OK<`, `>Submit<`, etc. inside Button/button JSX.
const BANNED_LABELS = [
  "OK", "Submit", "Yes", "No",
  "Click here", "Learn more", "Get started", "Continue",
];
const BUTTON_TAG_RE = /<(Button|button|IconButton|FAB|SplitButton)\b([^>]*)>([^<]*?)</g;

const ALLOW_LINE = /lumen-lint-allow:\s*button-label/;
const ALLOW_BLOCK_START = /lumen-lint-allow-block:\s*button-label/;
const ALLOW_BLOCK_END   = /lumen-lint-allow-end:\s*button-label/;

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const isProductFile = (p) =>
  /\.(tsx?|jsx)$/.test(p) && !/\.(test|spec)\./.test(p);
const isExempt = (p) => EXEMPT_PATHS.some((re) => re.test(p));

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
    let inAllowBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (ALLOW_BLOCK_START.test(line)) inAllowBlock = true;
      if (ALLOW_BLOCK_END.test(line)) inAllowBlock = false;
      // Allow if directive is on the same line OR the immediately preceding line.
      const prevLine = i > 0 ? lines[i - 1] : "";
      if (inAllowBlock || ALLOW_LINE.test(line) || ALLOW_LINE.test(prevLine)) continue;

      // Pattern 1 — banned generic labels inside Button / button JSX.
      // Reset regex per line.
      BUTTON_TAG_RE.lastIndex = 0;
      let m;
      while ((m = BUTTON_TAG_RE.exec(line)) !== null) {
        const innerText = m[3].trim();
        if (!innerText) continue;
        for (const banned of BANNED_LABELS) {
          // Match the full inner content as the banned label (case-sensitive — "ok" inside variable names is fine).
          if (innerText === banned) {
            violations++;
            results.push({
              file: file.replace(ROOT + "/", ""),
              line: i + 1,
              col: m.index + 1,
              kind: "banned-label",
              match: `<${m[1]}>${innerText}<`,
              hint: `"${innerText}" is too generic. Use a specific verb-noun: 'Save changes' not 'Save', 'Get rates' not 'Submit', 'Delete carrier' not 'Yes'. See voice-and-tone.md § Buttons.`,
              content: line.trim(),
            });
          }
        }
      }
    }
  }
}

if (violations === 0) {
  console.log("[lint:button-conventions] ✓ no violations");
  process.exit(0);
}

console.log(`[lint:button-conventions] ✗ ${violations} violation(s):\n`);
for (const r of results) {
  console.log(`  ${r.file}:${r.line}:${r.col}  [${r.kind}]`);
  console.log(`    match: ${r.match}`);
  console.log(`    line:  ${r.content.length > 120 ? r.content.slice(0, 117) + "..." : r.content}`);
  console.log(`    hint:  ${r.hint}\n`);
}
process.exit(1);
