#!/usr/bin/env node
// Lint: components must not reference primitive tokens or hardcoded values.
// Walks design-system/02-components/ and the audit-dashboard/src/ tree.
// Exits non-zero on violations.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGETS = [
  join(ROOT, "design-system/02-components"),
  join(ROOT, "audit-dashboard/src/components"),
];

// Patterns we forbid in component code (component.json files exempt — they declare consumed tokens).
const FORBIDDEN = [
  { re: /color\.(brand|warm|accent\.)\d+/g, msg: "Primitive color reference. Use a semantic token (color.surface.*, color.text.*, color.action.*)." },
  { re: /dimension\.\d+/g,                  msg: "Primitive dimension reference. Use space.*, size.control.*, or radius.*." },
  // Hardcoded hex (only check files that aren't tokens):
  { re: /#[0-9a-fA-F]{6,8}/g,               msg: "Hardcoded hex color. Use a CSS variable (var(--color-...))." },
  // Hardcoded px in JSX className / style strings (heuristic):
  { re: /\b\d{2,4}px\b/g,                   msg: "Hardcoded pixel value. Use a token (var(--space-*), var(--radius-*))." },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const isComponentExample = (path) =>
  /design-system\/02-components\/.*\/examples\/.+\.(tsx?|jsx?|css|swift|kt|liquid|xml)$/.test(path);
const isAuditPrimitive = (path) =>
  /audit-dashboard\/src\/components\/.+\.(tsx?|css)$/.test(path);
const shouldCheck = (path) => isComponentExample(path) || isAuditPrimitive(path);

let violations = 0;
for (const target of TARGETS) {
  try {
    await stat(target);
  } catch {
    continue;
  }
  for await (const file of walk(target)) {
    if (!shouldCheck(file)) continue;
    if (file.endsWith("globals.css")) continue; // tokens themselves live here
    if (file.endsWith("icon.tsx")) continue;    // SVG paths legitimately have hex
    const content = await readFile(file, "utf8");
    for (const { re, msg } of FORBIDDEN) {
      const matches = content.match(re);
      if (matches) {
        // Allowlist: hex in comments
        const reallyOffending = matches.filter(
          (m) => !content.split(m)[0].split("\n").pop().includes("//"),
        );
        if (reallyOffending.length) {
          console.error(`✗ ${file}`);
          console.error(`    ${msg}`);
          console.error(`    found: ${[...new Set(reallyOffending)].slice(0, 4).join(", ")}`);
          violations++;
        }
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n${violations} lint violation(s).`);
  process.exit(1);
}
console.log("No lint violations.");
