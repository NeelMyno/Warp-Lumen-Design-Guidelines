#!/usr/bin/env node
// Lint: token names use kebab-case for multi-word path segments.
// v0.8 — catches camelCase like `litEdge`, `valueDisabled`, `iconLeading`,
// `labelToControl`, `controlToHelp` etc. before they ship.
//
// Walks all *.tokens.json files; flags any path SEGMENT containing an uppercase letter
// after the first character (i.e. camelCase). First-letter uppercase is allowed
// (some components ship as PascalCase namespaces — not Lumen, but defensive).
//
// Documented exemptions:
//   - $-prefixed DTCG metadata keys ($value, $type, $description, etc.)
//   - Width/height value-bearing keys with units in the segment ARE caught — the
//     v0.8 rename moved size.reading.60ch / 75ch to narrow/default/wide.
//
// Run:   pnpm lint:token-naming
// Exits non-zero on violations.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TOKENS_DIR = join(ROOT, "design-system/01-tokens");

// Per-segment naming policy:
const KEBAB_VIOLATION_RE = /^[a-z][a-z0-9_-]*[A-Z]/;
// Allow $-prefixed keys, numeric-only keys (radius scale "2xl" etc.), and explicit underscore-using keys (dimension.0_5 / 1_5).
const ALLOWED_SEGMENT = /^\$|^\d|^\d+_\d+$/;

let violations = 0;
const results = [];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

function visit(node, pathSegments, file) {
  if (node === null || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (!ALLOWED_SEGMENT.test(key) && KEBAB_VIOLATION_RE.test(key)) {
      // Honor deprecation marker — deprecated tokens are allowed to keep their
      // old camelCase names (they're being phased out per ADR 0009).
      const isDeprecated = typeof value === "object" && value !== null && "$deprecated" in value;
      if (!isDeprecated) {
        results.push({
          file,
          path: [...pathSegments, key].join("."),
          msg: `Token segment "${key}" uses camelCase. Rename to kebab-case (e.g. \`label-to-control\`).`,
        });
        violations++;
      }
    }
    if (typeof value === "object" && value !== null && !("$value" in value)) {
      visit(value, [...pathSegments, key], file);
    } else if (typeof value === "object" && value !== null) {
      // Even leaf nodes can have nested object $values; descend cautiously
      visit(value, [...pathSegments, key], file);
    }
  }
}

try {
  await stat(TOKENS_DIR);
} catch {
  console.log("(tokens dir missing)");
  process.exit(0);
}

for await (const file of walk(TOKENS_DIR)) {
  if (!file.endsWith(".tokens.json")) continue;
  let parsed;
  try {
    parsed = JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    console.error(`✗ ${file.replace(ROOT + "/", "")} — invalid JSON: ${e.message}`);
    violations++;
    continue;
  }
  visit(parsed, [], file);
}

if (violations === 0) {
  console.log("All token names kebab-case. ✓");
  process.exit(0);
}

for (const r of results) {
  console.error(`✗ ${r.file.replace(ROOT + "/", "")} — ${r.path}\n    ${r.msg}`);
}
console.error(`\n${violations} naming violation(s). Mark deprecated camelCase tokens with \`"$deprecated": "..."\` to grandfather them through v0.9.`);
process.exit(1);
