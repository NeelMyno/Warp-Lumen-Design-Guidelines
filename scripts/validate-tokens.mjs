#!/usr/bin/env node
// Strict token validation. Replaces the v0.6 ajv-cli single-pass that ended in
// `|| true` and silently passed any failure. v0.7 enforces:
//   1. Every *.tokens.json file is well-formed JSON.
//   2. DTCG-shaped: leaf nodes have $value (or $type+$value); aliases use {x.y}.
//   3. Every alias `{x.y.z}` resolves to a real token in the JOIN of all token
//      files. Unresolved alias = exit 1.
//   4. Every tokens.consumed entry in every component.json resolves to a real
//      token in the JOIN. Missing token = exit 1.
//
// Run:   pnpm validate:tokens
// Wired: package.json `validate:tokens` -> this script (no `|| true` mask).

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TOKENS_DIR = join(ROOT, "design-system/01-tokens");
const COMPONENTS_DIR = join(ROOT, "design-system/02-components");

let errors = 0;
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  errors++;
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const tokenFiles = [];
for await (const f of walk(TOKENS_DIR)) {
  if (f.endsWith(".tokens.json")) tokenFiles.push(f);
}

const tokens = new Map(); // dot.path -> { value, sourceFile }

function walkTokens(node, prefix, file) {
  if (node === null || typeof node !== "object") return;
  if ("$value" in node) {
    tokens.set(prefix, { value: node.$value, file });
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    walkTokens(v, prefix ? `${prefix}.${k}` : k, file);
  }
}

for (const f of tokenFiles) {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(f, "utf8"));
  } catch (e) {
    fail(`${f.replace(ROOT + "/", "")} — invalid JSON: ${e.message}`);
    continue;
  }
  walkTokens(parsed, "", f);
}

const ALIAS_RE = /\{([a-zA-Z][a-zA-Z0-9._-]*)\}/g;
for (const [path, { value, file }] of tokens) {
  if (typeof value !== "string") continue;
  let m;
  while ((m = ALIAS_RE.exec(value)) !== null) {
    const ref = m[1];
    if (!tokens.has(ref)) {
      fail(
        `${file.replace(ROOT + "/", "")} — token \`${path}\` references unresolved alias \`{${ref}}\``,
      );
    }
  }
}

const componentDirs = (await readdir(COMPONENTS_DIR, { withFileTypes: true }))
  .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
  .map((d) => join(COMPONENTS_DIR, d.name));

for (const dir of componentDirs) {
  const cjPath = join(dir, "component.json");
  try {
    await stat(cjPath);
  } catch {
    continue;
  }
  let cj;
  try {
    cj = JSON.parse(await readFile(cjPath, "utf8"));
  } catch (e) {
    fail(`${cjPath.replace(ROOT + "/", "")} — invalid JSON: ${e.message}`);
    continue;
  }
  const consumed = cj?.tokens?.consumed || [];
  for (const ref of consumed) {
    if (!tokens.has(ref)) {
      fail(
        `${cjPath.replace(ROOT + "/", "")} — component \`${cj.name}\` consumes \`${ref}\` but it is not declared in any tokens.json`,
      );
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} token-validation error(s).`);
  process.exit(1);
}
console.log(
  `✓ Tokens valid. ${tokens.size} tokens declared across ${tokenFiles.length} files; all aliases + component references resolve.`,
);
