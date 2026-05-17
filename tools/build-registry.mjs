#!/usr/bin/env node
/**
 * tools/build-registry.mjs — v0.13 Phase 2 registry assembly
 * --------------------------------------------------------------------------
 * Discovers every `design-system/02-components/<name>/<name>.registry.json`
 * plus the foundation registries under `registry/` (lumen-base, font-satoshi,
 * tokens, mode-scope). Emits the root `registry.json` items array.
 *
 * The shadcn CLI then consumes root `registry.json` via `shadcn build` to
 * emit `public/r/<name>.json` per item.
 *
 * Idempotent. Re-running rewrites the root registry.json items array in
 * deterministic order: base → font → tokens → mode-scope → tier-1 → tier-2
 * → tier-3 → tier-4 → ext (legacy v0.12.6 in _registry/).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const COMP_DIR = join(ROOT, "design-system/02-components");
const REG_DIR = join(ROOT, "registry");
const LEGACY_REG_DIR = join(ROOT, "_registry");
const OUT = join(ROOT, "registry.json");

const TIER_ORDER = ["lumen-base", "font-satoshi", "tokens", "mode-scope"];

function read(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

function discoverFoundationRegistries() {
  if (!existsSync(REG_DIR)) return [];
  const out = [];
  for (const entry of readdirSync(REG_DIR)) {
    const subdir = join(REG_DIR, entry);
    if (!statSync(subdir).isDirectory()) continue;
    const f = join(subdir, `${entry}.json`);
    if (existsSync(f)) out.push({ name: entry, path: f, item: read(f) });
  }
  return out;
}

function discoverComponentRegistries() {
  if (!existsSync(COMP_DIR)) return [];
  const out = [];
  for (const entry of readdirSync(COMP_DIR)) {
    if (entry.startsWith("_")) continue;
    const subdir = join(COMP_DIR, entry);
    if (!statSync(subdir).isDirectory()) continue;
    const f = join(subdir, `${entry}.registry.json`);
    if (existsSync(f)) out.push({ name: entry, path: f, item: read(f) });
  }
  return out;
}

function discoverLegacyRegistries(seenNames) {
  /* Optional — pull in any _registry/*.json that isn't already covered by the
     v0.13 02-components/<name>/<name>.registry.json. Provides backwards-
     compatibility for v0.12.6 sidecars during the migration window. */
  if (!existsSync(LEGACY_REG_DIR)) return [];
  const out = [];
  for (const f of readdirSync(LEGACY_REG_DIR)) {
    if (!f.endsWith(".json") || f === "registry.json") continue;
    const name = f.replace(/\.json$/, "");
    if (seenNames.has(name)) continue;
    const path = join(LEGACY_REG_DIR, f);
    out.push({ name, path, item: read(path) });
  }
  return out;
}

function tierRank(item) {
  const tier = item?.meta?.tier;
  if (item?.name && TIER_ORDER.includes(item.name)) return -1;
  if (tier === "T0") return 0;
  if (tier === "T1") return 1;
  if (tier === "T2") return 2;
  if (tier === "T3" || tier === "T3-SIG") return 3;
  if (tier === "T4") return 4;
  if (tier === "REG") return -2;
  return 5; // EXT (legacy v0.12.6 sidecars or unranked)
}

function sortItems(items) {
  const foundationOrder = new Map(TIER_ORDER.map((n, i) => [n, i]));
  return items.sort((a, b) => {
    const aIsF = foundationOrder.has(a.name);
    const bIsF = foundationOrder.has(b.name);
    if (aIsF && bIsF) return foundationOrder.get(a.name) - foundationOrder.get(b.name);
    if (aIsF) return -1;
    if (bIsF) return 1;
    const ar = tierRank(a.item);
    const br = tierRank(b.item);
    if (ar !== br) return ar - br;
    return a.name.localeCompare(b.name);
  });
}

function main() {
  const foundations = discoverFoundationRegistries();
  const components = discoverComponentRegistries();
  const seen = new Set([...foundations, ...components].map((x) => x.name));
  const legacy = discoverLegacyRegistries(seen);
  const all = sortItems([...foundations, ...components, ...legacy]);

  const items = all.map((x) => x.item);

  const root = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "@lumen",
    homepage: "https://warp-lumen-design-guidelines.vercel.app",
    items,
  };

  writeFileSync(OUT, JSON.stringify(root, null, 2) + "\n");

  const byTier = items.reduce((acc, it) => {
    const tier = it?.meta?.tier ?? (TIER_ORDER.includes(it?.name) ? "FOUNDATION" : "EXT");
    acc[tier] = (acc[tier] ?? 0) + 1;
    return acc;
  }, {});
  const summary = Object.entries(byTier)
    .map(([t, n]) => `${t}=${n}`)
    .join(" · ");
  console.log(`build-registry: wrote ${items.length} items → ${relative(ROOT, OUT)}`);
  console.log(`  ${summary}`);
}

main();
