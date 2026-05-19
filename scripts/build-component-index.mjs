#!/usr/bin/env node
// scripts/build-component-index.mjs
//
// Generate COMPONENT-INDEX.md from the 98 component.json files in
// design-system/02-components/. Output is grouped by category (categories are
// declared in CATEGORY_MAP at the top of this file) and lists each component
// with link, one-line summary, version, status, and examples present.
//
// Re-run on every release (wire into pnpm release or pre-commit). Manual run:
//   node scripts/build-component-index.mjs
//
// The script is idempotent — runs cleanly on a clean checkout and stays
// stable across re-runs as long as component.json summaries are stable.
//
// Introduced v0.13.2 — closes audit item A12 (no LLM-readable component
// index existed; USING-LUMEN.md §5 was stale at "35 components" through
// v0.13.1).

import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const COMPONENTS_DIR = join(ROOT, "design-system/02-components");

const CATEGORY_MAP = {
  "Signature primitives (Warp-specific)": ["badge","copy-button","icon-button","kbd","live-dot","rate-ticker","stat","trend"],
  "Buttons + actions": ["button","button-group","split-button","fab","command-palette-button","toggle","segmented"],
  "Inputs + forms": ["input","textarea","number-input","password-input","otp-input","select","combobox","tags-input","date-picker","time-picker","range-slider","file-dropzone","checkbox","radio-group","switch","field","validation-message","form","color-picker","slider","search-field"],
  "Feedback + messaging": ["alert","banner","snackbar","toast","spinner","progress","skeleton","empty-state","tag"],
  "Display + data": ["calendar","sparkline","kpi-card","chart","timeline","tree-view","kanban","data-grid","carousel","list","code-block","citation-card","presence-indicator","avatar"],
  "Containers + surfaces": ["card","dialog","drawer","sheet","panel","table","popover","tooltip","divider","link"],
  "Navigation": ["tabs","breadcrumbs","pagination","stepper","dropdown-menu","navbar","sidebar","bottom-nav","toolbar","action-sheet","accordion","notification-center"],
  "Mobile-specific": ["phone-frame","status-bar","swipe-action","pull-to-refresh","permission-prompt","coach-mark"],
  "AI + collaboration": ["ai-prompt-input","ai-suggestion","ai-badge","chat-bubble","comment-thread","reaction-bar"],
  "Commerce + marketing": ["pricing-card","testimonial-card","logo-cloud","inventory-status","cart-drawer"],
};

function firstSentence(s) {
  if (!s) return "";
  const m = s.match(/^[^.!?]*[.!?]/);
  return (m ? m[0] : s).trim();
}

const dirs = (await readdir(COMPONENTS_DIR, { withFileTypes: true }))
  .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
  .map((d) => d.name);

const allComponents = new Map();
for (const name of dirs) {
  const cjPath = join(COMPONENTS_DIR, name, "component.json");
  if (!existsSync(cjPath)) continue;
  try {
    const cj = JSON.parse(await readFile(cjPath, "utf8"));
    const examples = [];
    const examplesDir = join(COMPONENTS_DIR, name, "examples");
    if (existsSync(examplesDir)) {
      const exFiles = await readdir(examplesDir);
      for (const f of exFiles.sort()) examples.push(f);
    }
    allComponents.set(name, {
      name: cj.name ?? name,
      version: cj.version ?? "?",
      status: cj.status ?? "?",
      deprecated: cj.deprecated === true,
      summary: firstSentence(cj.summary ?? cj.description ?? ""),
      examples,
    });
  } catch (e) {
    console.error(`failed ${name}: ${e.message}`);
  }
}

const seen = new Set();
for (const cs of Object.values(CATEGORY_MAP)) cs.forEach((c) => seen.add(c));
const uncategorized = [...allComponents.keys()].filter((n) => !seen.has(n));

const lines = [];
const today = new Date().toISOString().slice(0, 10);
const versionFile = (await readFile(join(ROOT, "VERSION"), "utf8")).trim();

lines.push(`# COMPONENT-INDEX.md`);
lines.push("");
lines.push(`> **Auto-generated for Lumen v${versionFile}** (${today}). Run \`node scripts/build-component-index.mjs\` to regenerate. Source of truth: the \`design-system/02-components/*/component.json\` files. **Never hand-edit this file** — drift is caught by the next regeneration.`);
lines.push("");
lines.push(`Lumen ships **${allComponents.size} components** in the [\`_registry/registry.json\`](_registry/registry.json) shadcn catalog. Each component has \`component.md\` (human contract), \`component.json\` (machine contract validating against [\`_schema/component.schema.json\`](design-system/02-components/_schema/component.schema.json)), and per-platform \`examples/{platform}.{ext}\` where authored.`);
lines.push("");
lines.push(`## Quick install`);
lines.push("");
lines.push("```bash");
lines.push(`pnpm dlx shadcn@latest add <cdn>/lumen/v${versionFile}/registry/{name}.json`);
lines.push("```");
lines.push("");
lines.push("## How to read this index");
lines.push("");
lines.push("- **Component** — kebab-case name, links to `component.md` for prose contract.");
lines.push("- **Purpose** — first sentence of `component.json`'s `summary` field.");
lines.push("- **Version** — version the contract last stabilised at.");
lines.push("- **Status** — `stable` / `alpha` / `beta` / `deprecated`.");
lines.push("- **Examples** — platform code examples present in the `examples/` directory.");
lines.push("");

for (const [cat, comps] of Object.entries(CATEGORY_MAP)) {
  const filtered = comps.filter((c) => allComponents.has(c));
  if (filtered.length === 0) continue;
  lines.push(`## ${cat} (${filtered.length})`);
  lines.push("");
  lines.push("| Component | Purpose | Version | Status | Examples |");
  lines.push("|---|---|---|---|---|");
  for (const c of [...filtered].sort()) {
    const info = allComponents.get(c);
    const examples = info.examples.length > 0 ? info.examples.join(", ") : "—";
    const status = info.deprecated ? "**deprecated**" : info.status;
    lines.push(`| [\`${c}\`](design-system/02-components/${c}/component.md) | ${info.summary || "(see component.md)"} | ${info.version} | ${status} | ${examples} |`);
  }
  lines.push("");
}

if (uncategorized.length > 0) {
  lines.push(`## Uncategorized (${uncategorized.length})`);
  lines.push("");
  lines.push(`> These components exist in \`design-system/02-components/\` but aren't mapped in CATEGORY_MAP at the top of \`scripts/build-component-index.mjs\`. Add them to the right category and re-run.`);
  lines.push("");
  for (const c of uncategorized.sort()) {
    lines.push(`- [\`${c}\`](design-system/02-components/${c}/component.md)`);
  }
  lines.push("");
}

lines.push("---");
lines.push("");
lines.push(`> **Update this file by re-running \`node scripts/build-component-index.mjs\`** — do not hand-edit. Drift will be caught by the next regeneration.`);
lines.push("");
lines.push(`Generated ${today} from VERSION = ${versionFile}.`);
lines.push("");

const indexPath = join(ROOT, "COMPONENT-INDEX.md");
await writeFile(indexPath, lines.join("\n"));

console.log(`✓ Wrote ${indexPath}`);
console.log(`  ${allComponents.size} components across ${Object.keys(CATEGORY_MAP).length} categories.`);
if (uncategorized.length > 0) {
  console.warn(`  ${uncategorized.length} uncategorized — review CATEGORY_MAP.`);
}
