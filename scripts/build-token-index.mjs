#!/usr/bin/env node
// scripts/build-token-index.mjs
//
// Generate TOKEN-INDEX.md from the DTCG token JSON in design-system/01-tokens/.
// Walks the semantic + component-token files (skips primitive files — agents
// and engineers consume semantic, not primitive, per AGENTS.md hard rule 2)
// and emits a flat, alphabetical, copy-pasteable index of every token path
// with its alias target (or resolved primitive value if terminal) and the
// $description line where present.
//
// Re-run on every release. Manual run:
//   node scripts/build-token-index.mjs
//
// The script is idempotent — runs cleanly on a clean checkout.
//
// Introduced v0.13.2 — closes audit item A13 (USING-LUMEN.md §12 has a
// "frequently-asked-for token paths" cheat sheet but no full enumeration;
// agents reading USING-LUMEN.md don't know the full surface of available
// tokens, and the validate:tokens script catches the inverse failure mode —
// component contracts referencing tokens that don't exist).

import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TOKENS_DIR = join(ROOT, "design-system/01-tokens");

const TIERS = [
  { dir: "semantic", label: "Semantic — consume these", priority: 1 },
  { dir: "components", label: "Component-bound — consumed by a single component's contract", priority: 2 },
  // Primitives are intentionally OMITTED — per AGENTS.md hard rule 2,
  // engineers and LLMs only consume semantic. Listing primitives would
  // invite hardcoding.
];

function flattenTokens(obj, prefix, descriptions, values) {
  if (obj == null || typeof obj !== "object") return;
  if (Object.prototype.hasOwnProperty.call(obj, "$value")) {
    // Terminal token node.
    const v = obj.$value;
    let valueStr;
    if (typeof v === "object" && v !== null) {
      // Composite ($type: typography, transition, shadow). Render as a short
      // multi-key recap.
      const keys = Object.keys(v).slice(0, 4);
      valueStr = "{ " + keys.map((k) => {
        const vv = v[k];
        return `${k}: ${typeof vv === "string" ? vv : JSON.stringify(vv).slice(0, 40)}`;
      }).join(", ") + (Object.keys(v).length > 4 ? ", …" : "") + " }";
    } else {
      valueStr = typeof v === "string" ? v : JSON.stringify(v);
    }
    values.push({ path: prefix.join("."), value: valueStr, description: obj.$description ?? "" });
    return;
  }
  for (const k of Object.keys(obj)) {
    if (k.startsWith("$")) {
      if (k === "$description" && prefix.length > 0) descriptions.push({ path: prefix.join("."), description: obj[k] });
      continue;
    }
    flattenTokens(obj[k], [...prefix, k], descriptions, values);
  }
}

const today = new Date().toISOString().slice(0, 10);
const versionFile = (await readFile(join(ROOT, "VERSION"), "utf8")).trim();

const lines = [];
lines.push(`# TOKEN-INDEX.md`);
lines.push("");
lines.push(`> **Auto-generated for Lumen v${versionFile}** (${today}). Run \`node scripts/build-token-index.mjs\` to regenerate. Source of truth: the \`design-system/01-tokens/{semantic,components}/*.tokens.json\` files. **Never hand-edit this file** — drift is caught by the next regeneration.`);
lines.push("");
lines.push(`> **What this is.** A flat, alphabetical index of every Lumen semantic and component-bound token, with its alias target (or resolved primitive value if terminal) and the description from the source file. **Agents and engineers consume only these** — per AGENTS.md hard rule 2, never reference primitives directly.`);
lines.push("");
lines.push(`> **What this isn't.** The primitive tier is intentionally OMITTED (\`color.warm.50\`, \`dimension.4\`, \`font.weight.bold\`, etc.). Listing them would invite agents to bypass the semantic layer.`);
lines.push("");

let totalSemantic = 0;
let totalComponent = 0;

for (const tier of TIERS) {
  const tierDir = join(TOKENS_DIR, tier.dir);
  if (!existsSync(tierDir)) continue;
  const files = (await readdir(tierDir)).filter((f) => f.endsWith(".tokens.json")).sort();
  lines.push(`## ${tier.label}`);
  lines.push("");
  for (const f of files) {
    const fullPath = join(tierDir, f);
    let parsed;
    try {
      parsed = JSON.parse(await readFile(fullPath, "utf8"));
    } catch (e) {
      console.error(`failed ${f}: ${e.message}`);
      continue;
    }
    const descriptions = [];
    const values = [];
    flattenTokens(parsed, [], descriptions, values);
    if (values.length === 0) continue;
    if (tier.priority === 1) totalSemantic += values.length;
    if (tier.priority === 2) totalComponent += values.length;
    lines.push(`### \`${tier.dir}/${f}\` (${values.length} tokens)`);
    const rootDesc = parsed.$description ?? Object.values(parsed)[0]?.$description ?? null;
    if (rootDesc) {
      const oneLine = rootDesc.replace(/\s+/g, " ").slice(0, 240) + (rootDesc.length > 240 ? "…" : "");
      lines.push("");
      lines.push(`> ${oneLine}`);
    }
    lines.push("");
    lines.push("| Token path | Value / alias | Description |");
    lines.push("|---|---|---|");
    for (const v of values.sort((a, b) => a.path.localeCompare(b.path))) {
      const desc = v.description.replace(/\s+/g, " ").replace(/\|/g, "\\|").slice(0, 180) + (v.description.length > 180 ? "…" : "");
      const value = v.value.replace(/\|/g, "\\|").slice(0, 90) + (v.value.length > 90 ? "…" : "");
      lines.push(`| \`${v.path}\` | \`${value}\` | ${desc} |`);
    }
    lines.push("");
  }
}

lines.push("---");
lines.push("");
lines.push(`**Totals:** ${totalSemantic} semantic tokens · ${totalComponent} component-bound tokens.`);
lines.push("");
lines.push(`> Generated ${today} from VERSION = ${versionFile}. Re-run \`pnpm token-index\` (or \`node scripts/build-token-index.mjs\`) to regenerate.`);
lines.push("");

const indexPath = join(ROOT, "TOKEN-INDEX.md");
await writeFile(indexPath, lines.join("\n"));

console.log(`✓ Wrote ${indexPath}`);
console.log(`  ${totalSemantic} semantic + ${totalComponent} component-bound tokens.`);
