#!/usr/bin/env node
// Lint: components must not reference primitive tokens or hardcoded values.
// Walks design-system/02-components/ and the audit-dashboard/src/ tree.
// Exits non-zero on violations.
//
// v0.13.2 — three lint-script upgrades:
//   1. Hex inside `var(--token, #hex)` fallback is exempt (the CSS variable
//      IS the primary reference; the hex is just a safety fallback for
//      consumers that haven't loaded the Lumen token graph yet).
//   2. End-of-line `// lumen-allow: <reason>` comment exempts any literal on
//      the same line (for vendor brand colors, Lumen-color-picker demos, and
//      legitimate per-component layout pixels).
//   3. Vendor brand colors get an inline-allowlist UX via the same mechanism;
//      no new lint config file required.
//
// The audit-tokens.ts gate (hard rule 7 — "no hex outside primitives" — is
// the strict canonical gate; it excludes examples/ and audit-dashboard/.
// This lint is the looser-but-more-thorough check that also walks examples.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
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
  { re: /#[0-9a-fA-F]{6,8}\b/g,             msg: "Hardcoded hex color. Use a CSS variable (var(--color-...))." },
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

/**
 * Decide whether a single match at offset `matchStart` inside `content` is
 * "really offending" (true) or exempt (false).
 *
 * Three exemption paths:
 *   1. Match sits inside a JS `// ...` line comment.
 *   2. Match sits inside a CSS `var(--anything, #hex)` fallback — the var()
 *      IS the primary token reference.
 *   3. Line has an end-of-line `// lumen-allow: <reason>` comment, anywhere
 *      after the match (most ergonomic for inline exemptions).
 *
 * `match` is the matched substring (e.g., "#4285f4" or "480px"). We need it
 * for the var() check.
 */
function isExempt(content, match, matchStart) {
  // Get the line containing the match.
  const lineStart = content.lastIndexOf("\n", matchStart - 1) + 1;
  const lineEndRaw = content.indexOf("\n", matchStart);
  const lineEnd = lineEndRaw === -1 ? content.length : lineEndRaw;
  const line = content.slice(lineStart, lineEnd);
  const colInLine = matchStart - lineStart;

  // 1. In a JS `// ...` line comment.
  const commentIdx = line.indexOf("//");
  if (commentIdx >= 0 && commentIdx < colInLine) {
    return true;
  }

  // 2. In a CSS `var(--anything, #hex)` fallback. Pattern: there's an open
  //    `var(` before the match and a closing `)` after it, and a comma between
  //    the var name and the match.
  const before = line.slice(0, colInLine);
  const after = line.slice(colInLine + match.length);
  const varOpenIdx = before.lastIndexOf("var(");
  if (varOpenIdx >= 0) {
    // After the open var( there must be `--token, ` before the match, and a
    // closing `)` after the match (on the same line).
    const afterVarOpen = before.slice(varOpenIdx + 4);
    const closeIdx = after.indexOf(")");
    if (afterVarOpen.match(/^--[\w-]+\s*,\s*$/) && closeIdx >= 0) {
      return true;
    }
  }

  // 3. End-of-line `// lumen-allow: <reason>` comment.
  if (/\/\/\s*lumen-allow:/.test(line)) {
    return true;
  }

  // 4. JSX `{/* lumen-allow: <reason> */}` block comment on the same line —
  //    required for JSX attribute values where `//` line comments would be
  //    consumed by the className string.
  if (/\{\s*\/\*\s*lumen-allow:/.test(line)) {
    return true;
  }

  // 5. File-level pragma: `// lumen-allow-file: <reason>` anywhere in the
  //    first 10 lines exempts the whole file. Use sparingly — only for files
  //    that are inherently a wall of vendor-brand SVGs or chart-color demos
  //    where per-line exemptions would dwarf the actual code.
  const firstLines = content.split("\n").slice(0, 10).join("\n");
  if (/\/\/\s*lumen-allow-file:/.test(firstLines)) {
    return true;
  }

  return false;
}

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
      const re2 = new RegExp(re.source, re.flags); // fresh state per file/pattern
      const offending = [];
      let m;
      while ((m = re2.exec(content)) !== null) {
        if (!isExempt(content, m[0], m.index)) {
          offending.push(m[0]);
        }
      }
      if (offending.length) {
        console.error(`✗ ${file}`);
        console.error(`    ${msg}`);
        console.error(`    found: ${[...new Set(offending)].slice(0, 4).join(", ")}`);
        violations++;
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n${violations} lint violation(s).`);
  process.exit(1);
}
console.log("No lint violations.");
