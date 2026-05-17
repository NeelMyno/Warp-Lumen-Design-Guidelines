#!/usr/bin/env tsx
/**
 * build-token-index — emit a flattened DTCG token index for the audit dashboard
 * /tokens route. Avoids runtime parsing of *.tokens.json files in the browser.
 *
 * Output: audit-dashboard/public/token-index.json
 *
 * Shape (consumed by audit-dashboard/src/app/tokens/client.tsx):
 *   {
 *     generated: "2026-05-17T...",
 *     version: "0.13.0",
 *     tokens: [
 *       {
 *         path: "color.spring.500",
 *         layer: "primitive" | "semantic" | "mode" | "component",
 *         category: "color" | "spacing" | "radius" | "typography" | ...,
 *         file: "design-system/01-tokens/primitives/color.tokens.json",
 *         value: "#00FA8A" | "{color.spring.500}" | { ...composite }, // raw $value
 *         resolvedValue: "#00FA8A",   // alias-resolved if possible
 *         type: "color" | "dimension" | "fontFamily" | ...,
 *         description: "Lumen single accent — action / live / success only.",
 *         cssVar: "--color-spring-500",
 *         mode?: "restrained" | "expressive",
 *       },
 *       ...
 *     ],
 *     references: {
 *       "color.spring.500": [
 *         { type: "component-md",  file: "...button.md" },
 *         { type: "component-tsx", file: "...button.tsx" },
 *         ...
 *       ],
 *     }
 *   }
 *
 * The /tokens client renders filter (category/layer), search, and click-to-detail
 * (resolved value + references list + copy buttons) from this single JSON.
 *
 * Zero external dependencies.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "audit-dashboard/public/token-index.json");

const VERSION = readFileSync(join(ROOT, "VERSION"), "utf-8").trim();

type Layer = "primitive" | "semantic" | "mode" | "component";

interface TokenEntry {
  path: string;
  layer: Layer;
  category: string;
  file: string;
  value: unknown;
  resolvedValue: unknown;
  type: string;
  description: string;
  cssVar: string;
  mode?: "restrained" | "expressive";
}

interface TokenIndex {
  generated: string;
  version: string;
  totals: {
    tokens: number;
    references: number;
    byLayer: Record<Layer, number>;
    byCategory: Record<string, number>;
  };
  tokens: TokenEntry[];
  references: Record<
    string,
    Array<{ type: string; file: string; line?: number }>
  >;
}

interface DTCGNode {
  $value?: unknown;
  $type?: string;
  $description?: string;
  [k: string]: unknown;
}

/** Walk a DTCG JSON tree and yield (dot-path, leaf-node) for every $value-carrying leaf. */
function* walkTokens(
  obj: unknown,
  prefix: string[] = [],
): Generator<{ path: string; node: DTCGNode }> {
  if (obj === null || typeof obj !== "object") return;
  const entries = Object.entries(obj as Record<string, unknown>);
  // A node is a "leaf" if it has $value; otherwise it's a container with children
  const isLeaf = entries.some(([k]) => k === "$value");
  if (isLeaf) {
    yield { path: prefix.join("."), node: obj as DTCGNode };
    return;
  }
  for (const [k, v] of entries) {
    if (k.startsWith("$")) continue; // skip $schema, $description on group nodes
    yield* walkTokens(v, [...prefix, k]);
  }
}

function listJsonFiles(dir: string, recursive: boolean): string[] {
  const out: string[] = [];
  const abs = join(ROOT, dir);
  function visit(d: string, rel: string) {
    let entries: string[] = [];
    try {
      entries = readdirSync(d);
    } catch {
      return;
    }
    for (const name of entries) {
      const full = join(d, name);
      const relPath = rel ? `${rel}/${name}` : name;
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        if (recursive) visit(full, relPath);
      } else if (st.isFile() && name.endsWith(".tokens.json")) {
        out.push(`${dir}/${relPath}`);
      }
    }
  }
  visit(abs, "");
  return out.sort();
}

const PRIMITIVE_FILES = listJsonFiles(
  "design-system/01-tokens/primitives",
  false,
);
const SEMANTIC_FILES = listJsonFiles(
  "design-system/01-tokens/semantic",
  false,
);
const MODE_FILES = listJsonFiles("design-system/01-tokens/modes", false);
const COMPONENT_FILES = listJsonFiles(
  "design-system/01-tokens/components",
  true,
);

function inferCategory(filePath: string, tokenPath: string): string {
  const fileBase = filePath.split("/").pop()!.replace(".tokens.json", "");
  // Primitives carry the category in the filename.
  if (filePath.includes("/primitives/")) return fileBase;
  // Semantic / mode / component files often namespace by first segment.
  return tokenPath.split(".")[0] ?? fileBase;
}

function inferLayer(filePath: string): Layer {
  if (filePath.includes("/primitives/")) return "primitive";
  if (filePath.includes("/semantic/")) return "semantic";
  if (filePath.includes("/modes/")) return "mode";
  return "component";
}

function inferMode(filePath: string): "restrained" | "expressive" | undefined {
  if (filePath.endsWith("/restrained.tokens.json")) return "restrained";
  if (filePath.endsWith("/expressive.tokens.json")) return "expressive";
  return undefined;
}

function dtcgPathToCssVar(path: string): string {
  // Convert "color.spring.500" → "--color-spring-500"
  return `--${path.replace(/\./g, "-").replace(/_/g, "-").toLowerCase()}`;
}

const allFiles = [
  ...PRIMITIVE_FILES,
  ...SEMANTIC_FILES,
  ...MODE_FILES,
  ...COMPONENT_FILES,
];

const tokens: TokenEntry[] = [];
const tokenByPath = new Map<string, TokenEntry>();

for (const file of allFiles) {
  let raw: string;
  try {
    raw = readFileSync(join(ROOT, file), "utf-8");
  } catch {
    continue;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn(`[token-index] skipping unparseable ${file}`);
    continue;
  }
  const layer = inferLayer(file);
  const mode = inferMode(file);
  for (const { path, node } of walkTokens(parsed)) {
    if (!path) continue;
    const value = node.$value;
    const type = node.$type ?? "unknown";
    const description = node.$description ?? "";
    const category = inferCategory(file, path);
    const entry: TokenEntry = {
      path,
      layer,
      category,
      file,
      value,
      resolvedValue: value, // resolved in a second pass
      type,
      description,
      cssVar: dtcgPathToCssVar(path),
      mode,
    };
    tokens.push(entry);
    // Prefer the primitive layer if the same path appears in multiple files.
    if (!tokenByPath.has(path) || layer === "primitive") {
      tokenByPath.set(path, entry);
    }
  }
}

// Alias resolution: walk every token. If $value is a string like "{color.spring.500}",
// resolve to the referenced token's resolvedValue. Repeat until fixed point (max 8 hops).
const ALIAS_RE = /^\{([^}]+)\}$/;
for (const entry of tokens) {
  let v: unknown = entry.value;
  let hops = 0;
  while (typeof v === "string" && ALIAS_RE.test(v) && hops < 8) {
    const m = ALIAS_RE.exec(v as string)!;
    const target = tokenByPath.get(m[1]);
    if (!target) break;
    v = target.value;
    hops++;
  }
  entry.resolvedValue = v;
}

// References pass: scan component MDs + TSX + tokens-consumed frontmatter to count usages.
const references: Record<
  string,
  Array<{ type: string; file: string; line?: number }>
> = {};

function pushRef(
  path: string,
  type: string,
  file: string,
  line?: number,
) {
  if (!references[path]) references[path] = [];
  references[path].push({ type, file, line });
}

function scanComponentFile(
  relFile: string,
  fileType: "md" | "tsx" | "json",
) {
  let raw: string;
  try {
    raw = readFileSync(join(ROOT, relFile), "utf-8");
  } catch {
    return;
  }
  // Match var(--token-name) in tsx/css; match `tokens:` frontmatter in md;
  // match {token.path} alias syntax in JSON.
  if (fileType === "tsx") {
    const re = /var\(\s*(--[a-z0-9-]+)\s*[,)]/gi;
    let m;
    while ((m = re.exec(raw))) {
      // Reverse-map CSS var to DTCG path: --color-spring-500 → color.spring.500
      const cssVar = m[1];
      // Find a token whose cssVar matches OR whose path matches after normalization.
      for (const entry of tokens) {
        if (entry.cssVar === cssVar) {
          const line = raw.slice(0, m.index).split("\n").length;
          pushRef(entry.path, "component-tsx", relFile, line);
        }
      }
    }
  } else if (fileType === "md") {
    // Look for `tokens:` frontmatter list (Phase 2 component MDs use this shape).
    const tokensListRe = /^tokens:\s*\n((?:\s+-\s+.+\n)+)/m;
    const tm = tokensListRe.exec(raw);
    if (tm) {
      const list = tm[1];
      const itemRe = /^\s+-\s+(.+)$/gm;
      let im;
      while ((im = itemRe.exec(list))) {
        const tokenRef = im[1].trim();
        // Match either bare path "color.spring.500" or "{color.spring.500}".
        const cleaned = tokenRef.replace(/[{}]/g, "");
        if (tokenByPath.has(cleaned)) {
          pushRef(cleaned, "component-md", relFile);
        }
      }
    }
    // Also pick up explicit `var(--*)` references in MD code samples.
    const re = /var\(\s*(--[a-z0-9-]+)\s*[,)]/gi;
    let m;
    while ((m = re.exec(raw))) {
      const cssVar = m[1];
      for (const entry of tokens) {
        if (entry.cssVar === cssVar) {
          pushRef(entry.path, "component-md-code", relFile);
        }
      }
    }
  } else if (fileType === "json") {
    // Match {token.path} alias references inside component-tokens JSON.
    const re = /\{([a-zA-Z0-9_.-]+)\}/g;
    let m;
    while ((m = re.exec(raw))) {
      if (tokenByPath.has(m[1])) {
        pushRef(m[1], "component-tokens-alias", relFile);
      }
    }
  }
}

function walkComponentsDir() {
  const compsDir = join(ROOT, "design-system/02-components");
  let entries: string[] = [];
  try {
    entries = readdirSync(compsDir);
  } catch {
    return;
  }
  for (const compName of entries) {
    if (compName.startsWith("_")) continue;
    const compDir = join(compsDir, compName);
    let inner: string[] = [];
    try {
      inner = readdirSync(compDir);
    } catch {
      continue;
    }
    for (const f of inner) {
      const rel = `design-system/02-components/${compName}/${f}`;
      if (f.endsWith(".tsx")) scanComponentFile(rel, "tsx");
      else if (f.endsWith(".md")) scanComponentFile(rel, "md");
    }
  }
}

walkComponentsDir();

// Also scan audit-dashboard primitives directory for var(--…) references.
function walkAuditDashboard() {
  const baseDir = join(ROOT, "audit-dashboard/src");
  function visit(d: string, rel: string) {
    let entries: string[] = [];
    try {
      entries = readdirSync(d);
    } catch {
      return;
    }
    for (const name of entries) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      const full = join(d, name);
      const relPath = rel ? `${rel}/${name}` : name;
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        visit(full, relPath);
      } else if (st.isFile() && (name.endsWith(".tsx") || name.endsWith(".ts"))) {
        scanComponentFile(`audit-dashboard/src/${relPath}`, "tsx");
      }
    }
  }
  visit(baseDir, "");
}

walkAuditDashboard();

const totalsByLayer: Record<Layer, number> = {
  primitive: 0,
  semantic: 0,
  mode: 0,
  component: 0,
};
const totalsByCategory: Record<string, number> = {};
for (const t of tokens) {
  totalsByLayer[t.layer]++;
  totalsByCategory[t.category] = (totalsByCategory[t.category] ?? 0) + 1;
}
const totalReferences = Object.values(references).reduce(
  (sum, arr) => sum + arr.length,
  0,
);

const index: TokenIndex = {
  generated: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  version: VERSION,
  totals: {
    tokens: tokens.length,
    references: totalReferences,
    byLayer: totalsByLayer,
    byCategory: totalsByCategory,
  },
  tokens,
  references,
};

writeFileSync(OUT, JSON.stringify(index, null, 2) + "\n", "utf-8");
console.log(
  `Wrote ${OUT.replace(ROOT, "")} — ${tokens.length} tokens, ${totalReferences} references, ${Object.keys(references).length} tokens referenced.`,
);
console.log(
  `  by layer: ${Object.entries(totalsByLayer)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ")}`,
);
console.log(
  `  by category (top 8): ${Object.entries(totalsByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ")}`,
);
