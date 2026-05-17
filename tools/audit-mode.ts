#!/usr/bin/env tsx
/**
 * tools/audit-mode.ts — v0.13 Phase 2 gate
 * --------------------------------------------------------------------------
 * Enforces master-doc hard rule 15: "Mode is a scope attribute, never a per-
 * component prop. Components do not branch on mode; semantic tokens rebind
 * under the scope."
 *
 * Reads every `.tsx` file under `design-system/02-components/` (excluding
 * `mode-scope/` itself, which legitimately sets data-mode) and flags:
 *   - Any `data-mode=` attribute on JSX
 *   - Any `data-mode` prop reference
 *   - Any `mode:` discriminator in component props
 *
 * Exit 0/1 driven by hits.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const COMPONENTS_DIR = join(ROOT, "design-system/02-components");
const EXEMPT_DIRS = new Set(["_schema", "examples", "mode-scope", "node_modules"]);

type Hit = { path: string; line: number; pattern: string; snippet: string };

const PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: "data-mode= attribute", re: /\bdata-mode\s*=/g },
  { name: "data-mode prop access", re: /\b(?:props\.|p\.)data-?mode\b/g },
  { name: "mode prop discriminator", re: /\bmode\s*:\s*(?:"restrained"|"expressive"|LumenMode)\b/g },
];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (EXEMPT_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (entry.endsWith(".tsx")) out.push(full);
  }
  return out;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length))
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));
}

function audit(): Hit[] {
  const files = walk(COMPONENTS_DIR);
  const hits: Hit[] = [];
  for (const file of files) {
    const raw = readFileSync(file, "utf8");
    const src = stripComments(raw);
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      for (const p of PATTERNS) {
        const re = new RegExp(p.re.source, "g");
        let m: RegExpExecArray | null;
        while ((m = re.exec(lines[i])) !== null) {
          hits.push({
            path: relative(ROOT, file),
            line: i + 1,
            pattern: p.name,
            snippet: lines[i].trim().slice(0, 120),
          });
        }
      }
    }
  }
  return hits;
}

function main() {
  const hits = audit();
  const filesScanned = walk(COMPONENTS_DIR).length;
  if (hits.length === 0) {
    console.log(`audit-mode: PASS (${filesScanned} files scanned, 0 data-mode references in component source)`);
    process.exit(0);
  }
  console.error(`audit-mode: FAIL (${hits.length} violation${hits.length === 1 ? "" : "s"} found)`);
  for (const h of hits) {
    console.error(`  ${h.path}:${h.line}  [${h.pattern}]  ${h.snippet}`);
  }
  console.error(
    "\nFix: components must be mode-agnostic. Wrap consumers in <ModeScope> instead of branching on mode internally.",
  );
  process.exit(1);
}

main();
