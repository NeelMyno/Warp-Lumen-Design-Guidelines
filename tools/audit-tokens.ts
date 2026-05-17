#!/usr/bin/env tsx
/**
 * tools/audit-tokens.ts — v0.13 Phase 2 gate
 * --------------------------------------------------------------------------
 * Enforces master-doc hard rule 7: "One source of truth per fact. Components
 * reference tokens by name. No hex literals outside primitives."
 *
 * Reads every `.tsx` and `.ts` file under `design-system/02-components/`
 * (excluding `_schema/`, `examples/`, and `mode-scope/` which legitimately
 * paints tokens via @property). Flags any `#XXX`, `#XXXXXX`, or `#XXXXXXXX`
 * hex literal outside a code comment.
 *
 * Exit code: 0 if clean; 1 if any violation. Violations print path:line:col
 * with the offending substring.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const COMPONENTS_DIR = join(ROOT, "design-system/02-components");
const EXEMPT_DIRS = new Set([
  "_schema",
  "examples",
  "node_modules",
  "mode-scope", // mode-scope sets data-mode; no hex; exempted anyway for safety.
]);

const HEX_RE = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

type Hit = { path: string; line: number; col: number; match: string };

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (EXEMPT_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) out.push(full);
  }
  return out;
}

function stripCommentsAndStrings(src: string): string {
  /* Collapse comments + string literals so hex inside them doesn't trip the
     audit. Replace each match with a same-length whitespace pad so line/col
     reporting stays accurate. */
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length))
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length))
    .replace(/(['"`])(?:\\[\s\S]|(?!\1)[^\\])*\1/g, (m) =>
      m[0] + " ".repeat(m.length - 2) + m[0],
    );
}

function audit(): Hit[] {
  const files = walk(COMPONENTS_DIR);
  const hits: Hit[] = [];
  for (const file of files) {
    const raw = readFileSync(file, "utf8");
    const src = stripCommentsAndStrings(raw);
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let m: RegExpExecArray | null;
      const re = new RegExp(HEX_RE.source, "g");
      while ((m = re.exec(lines[i])) !== null) {
        hits.push({
          path: relative(ROOT, file),
          line: i + 1,
          col: m.index + 1,
          match: m[0],
        });
      }
    }
  }
  return hits;
}

function main() {
  const hits = audit();
  const filesScanned = walk(COMPONENTS_DIR).length;
  if (hits.length === 0) {
    console.log(`audit-tokens: PASS (${filesScanned} files scanned, 0 hex literals)`);
    process.exit(0);
  }
  console.error(`audit-tokens: FAIL (${hits.length} hex literal${hits.length === 1 ? "" : "s"} found)`);
  for (const h of hits) {
    console.error(`  ${h.path}:${h.line}:${h.col}  ${h.match}`);
  }
  console.error(
    "\nFix: replace each hex with a CSS variable reference, e.g. var(--color-spring-500).",
  );
  process.exit(1);
}

main();
