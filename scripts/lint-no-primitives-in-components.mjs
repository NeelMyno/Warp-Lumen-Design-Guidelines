#!/usr/bin/env node
// Lint: components must not reference primitive tokens or hardcoded values.
// Walks design-system/02-components/ and the audit-dashboard/src/ tree.
// Exits non-zero on violations.
//
// v0.13.3 — adopts the same `lumen-lint-allow:` directive convention used by
// lint-no-arbitrary-typography + lint-no-off-grid-spacing. Three forms:
//   `// lumen-lint-allow: primitives — <reason>`  — exempts the SAME line OR the
//      first non-empty line below the comment (so directives can sit above the
//      violating className).
//   `// lumen-lint-allow-block: primitives — <reason>` ... `// lumen-lint-allow-end: primitives`
//      — exempts every line between the two markers (good for sweeping a whole
//      JSX block with brand-fixture hex codes).
//   Inline `// hex literal` comments on the same line still allowlist the match.
//
// Use sparingly. Genuine brand fixtures (Shop Pay #5a31f4, Google #4285f4, etc.)
// should be allowlisted; everything else should reference a semantic token.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGETS = [
  join(ROOT, "design-system/02-components"),
  join(ROOT, "audit-dashboard/src/components"),
];

const FORBIDDEN = [
  { re: /color\.(brand|warm|accent\.)\d+/g, msg: "Primitive color reference. Use a semantic token (color.surface.*, color.text.*, color.action.*)." },
  { re: /dimension\.\d+/g,                  msg: "Primitive dimension reference. Use space.*, size.control.*, or radius.*." },
  { re: /#[0-9a-fA-F]{6,8}/g,               msg: "Hardcoded hex color. Use a CSS variable (var(--color-...))." },
  { re: /\b\d{2,4}px\b/g,                   msg: "Hardcoded pixel value. Use a token (var(--space-*), var(--radius-*))." },
];

const ALLOW_LINE = /lumen-lint-allow:\s*(primitives|all)/i;
const ALLOW_BLOCK_START = /lumen-lint-allow-block:\s*(primitives|all)/i;
const ALLOW_BLOCK_END = /lumen-lint-allow-end:\s*(primitives|all)/i;

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

function computeExemptLineSet(lines) {
  const exempt = new Set();
  let inAllowBlock = false;
  let inCmtBlock = false; // /* ... */ or {/* ... */} block comments span multiple lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (ALLOW_BLOCK_START.test(line)) { inAllowBlock = true; exempt.add(i); continue; }
    if (ALLOW_BLOCK_END.test(line))   { inAllowBlock = false; exempt.add(i); continue; }
    if (inAllowBlock) { exempt.add(i); continue; }

    // Block-comment detection: covers `/* ... */`, `{/* ... */}`, multi-line spans.
    // We strip ONE-LINE complete comments first, then check for unclosed openers.
    let scratch = line.replace(/\/\*.*?\*\//g, "").replace(/\{\/\*.*?\*\/\}/g, "");
    if (inCmtBlock) {
      // line opens still inside a comment; check for closing
      const closeIdx = scratch.indexOf("*/");
      if (closeIdx === -1) {
        // Whole line still inside a block comment — exempt fully.
        exempt.add(i);
        continue;
      }
      // Closes mid-line; clip the comment portion off scratch and keep going.
      scratch = scratch.slice(closeIdx + 2);
      inCmtBlock = false;
    }
    // Detect a NEW unclosed opener on this line.
    const openIdx = scratch.lastIndexOf("/*");
    if (openIdx !== -1 && scratch.slice(openIdx).indexOf("*/") === -1) {
      // Comment opens on this line and doesn't close — switch to in-comment for next line.
      inCmtBlock = true;
      // If the comment opener consumes the rest of the line, exempt the whole line.
      // Otherwise the rest of the line could still hold a hit before the opener — leave it un-exempt.
      const beforeOpen = scratch.slice(0, openIdx);
      if (beforeOpen.trim() === "") {
        exempt.add(i);
        continue;
      }
      // Else: violation matches BEFORE the opener stay live; matches AFTER are inside the comment.
      // The matcher already runs on the full line text, not on `scratch`. We approximate
      // by NOT exempting the line — false positives possible on mixed-content lines.
    }

    if (ALLOW_LINE.test(line)) {
      exempt.add(i);
      // Exempt the first non-empty line below the directive (so the comment
      // can sit ABOVE the line it covers).
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === "") continue;
        exempt.add(j);
        break;
      }
    }
  }
  return exempt;
}

let violations = 0;
const byFile = new Map();

for (const target of TARGETS) {
  try { await stat(target); } catch { continue; }
  for await (const file of walk(target)) {
    if (!shouldCheck(file)) continue;
    if (file.endsWith("globals.css")) continue; // tokens themselves live here
    if (file.endsWith("icon.tsx")) continue;    // SVG paths legitimately have hex

    const content = await readFile(file, "utf8");
    const lines = content.split("\n");
    const exempt = computeExemptLineSet(lines);

    // Old-style counting: 1 violation per (file, regex) that has any non-exempt non-comment hits.
    // Preserves the v0.13.2 violation count baseline so triage stays anchored.
    const fileMessages = [];
    for (const { re, msg } of FORBIDDEN) {
      re.lastIndex = 0;
      const hits = [];
      for (let i = 0; i < lines.length; i++) {
        if (exempt.has(i)) continue;
        const line = lines[i];
        const matches = line.match(re);
        if (!matches) continue;
        // Per-match allowlist: `//` comment preceding the hit on the same line still wins.
        const reallyOffending = matches.filter(
          (m) => !line.split(m)[0].includes("//"),
        );
        if (reallyOffending.length) hits.push(...reallyOffending);
      }
      if (hits.length) {
        fileMessages.push({ msg, found: [...new Set(hits)].slice(0, 4).join(", ") });
        violations++;
      }
    }
    if (fileMessages.length) byFile.set(file, fileMessages);
  }
}

if (violations === 0) {
  console.log("No lint violations.");
  process.exit(0);
}

for (const [file, items] of byFile) {
  console.error(`✗ ${file}`);
  for (const it of items) {
    console.error(`    ${it.msg}`);
    console.error(`    found: ${it.found}`);
  }
}
console.error(`\n${violations} lint violation(s).`);
process.exit(1);
