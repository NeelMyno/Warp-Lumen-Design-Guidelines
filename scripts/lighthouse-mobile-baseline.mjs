#!/usr/bin/env node
/**
 * lighthouse-mobile-baseline.mjs — re-runnable Lighthouse Moto G4 4G mobile baseline
 *
 * Runs Lighthouse 12.8.2 via the bundled CLI (`node_modules/.bin/lighthouse`)
 * against every audit-dashboard route at the same simulated profile used by
 * R7 (v0.13.3 — first mobile baseline) and R8a (v0.13.4 — post-subset Satoshi).
 *
 * Why not the programmatic Lighthouse Node API: Lighthouse 12.8.2 + Node 25 +
 * puppeteer-core 24 break with `this._page.target is not a function` because
 * puppeteer v24 flipped its default protocol from CDP to webDriverBiDi. The
 * bundled CLI uses its own pinned puppeteer and works.
 *
 * Usage:
 *   1. Start the production server in another shell:
 *        cd audit-dashboard && pnpm build && pnpm start
 *   2. Run this script (from repo root):
 *        node scripts/lighthouse-mobile-baseline.mjs --tag=r8b
 *   3. Output lands at .audit-runs/<date>-round-<tag>/LIGHTHOUSE.md +
 *      per-route /tmp/lh-<slug>.json files.
 *
 * Flags:
 *   --tag=<slug>     Tag for the audit-run directory. Default: "ad-hoc".
 *   --port=<number>  Server port. Default: 3000.
 *   --routes=<csv>   Routes to audit. Default: 9 dashboard routes.
 *
 * The script does not start or stop the server; the caller is responsible.
 */
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  })
);

const tag = args.tag ?? "ad-hoc";
const port = Number(args.port ?? 3000);
const defaultRoutes = [
  "/",
  "/foundations",
  "/library",
  "/saas",
  "/landing",
  "/tool",
  "/commerce",
  "/mobile",
  "/desktop",
];
const routes = args.routes
  ? args.routes.split(",").map((r) => r.trim())
  : defaultRoutes;

const today = new Date().toISOString().slice(0, 10);
const outDir = resolve(repoRoot, `.audit-runs/${today}-round-${tag}`);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const lhBin = resolve(repoRoot, "node_modules/.bin/lighthouse");
if (!existsSync(lhBin)) {
  console.error(`error: ${lhBin} not found. Run pnpm install at repo root.`);
  process.exit(1);
}

const results = [];
const failures = [];

for (const route of routes) {
  const slug = route === "/" ? "root" : route.replace(/^\//, "").replace(/\//g, "-");
  const url = `http://localhost:${port}${route}`;
  const tmpFile = `/tmp/lh-${tag}-${slug}.json`;
  process.stdout.write(`▸ ${url} ... `);
  try {
    execSync(
      `${lhBin} ${url} \
        --output=json --output-path=${tmpFile} \
        --form-factor=mobile \
        --throttling.cpuSlowdownMultiplier=4 \
        --throttling.downloadThroughputKbps=1638.4 \
        --throttling.uploadThroughputKbps=675 \
        --throttling.rttMs=150 \
        --screenEmulation.mobile=true --screenEmulation.width=412 \
        --screenEmulation.height=823 --screenEmulation.deviceScaleFactor=1.75 \
        --only-categories=performance \
        --chrome-flags="--headless=new --no-sandbox --disable-gpu" --quiet`,
      { stdio: ["ignore", "ignore", "pipe"] }
    );
    const json = JSON.parse(execSync(`cat ${tmpFile}`).toString());
    const a = json.audits ?? {};
    const cat = json.categories?.performance;
    const score = cat ? Math.round((cat.score ?? 0) * 100) : null;
    const lcp = a["largest-contentful-paint"]?.numericValue ?? null;
    const fcp = a["first-contentful-paint"]?.numericValue ?? null;
    const tbt = a["total-blocking-time"]?.numericValue ?? null;
    const cls = a["cumulative-layout-shift"]?.numericValue ?? null;
    const si = a["speed-index"]?.numericValue ?? null;
    results.push({ route, slug, score, lcp, fcp, tbt, cls, si });
    process.stdout.write(`Perf ${score} | LCP ${Math.round(lcp)}ms | FCP ${Math.round(fcp)}ms | CLS ${cls.toFixed(3)}\n`);
  } catch (err) {
    failures.push({ route, error: err.message });
    process.stdout.write("FAIL\n");
  }
}

// Geo-mean across results (ignore null + zero values to avoid log(0))
const geomean = (key) => {
  const vals = results.map((r) => r[key]).filter((v) => v != null && v > 0);
  if (!vals.length) return null;
  const logSum = vals.reduce((acc, v) => acc + Math.log(v), 0);
  return Math.exp(logSum / vals.length);
};

const fmt = (n, digits = 0) =>
  n == null ? "n/a" : digits === 0 ? Math.round(n).toString() : n.toFixed(digits);

const mean = (key) => {
  const vals = results.map((r) => r[key]).filter((v) => v != null);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
};

const lines = [];
lines.push(`# Lighthouse — Mobile Performance Baseline (tag: ${tag})`);
lines.push(``);
lines.push(`**Date:** ${today}`);
lines.push(`**Tag:** ${tag}`);
lines.push(`**Tool:** Lighthouse 12.8.2 via local CLI (\`node_modules/.bin/lighthouse\`)`);
lines.push(`**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)`);
lines.push(`**Surface:** local production build at http://localhost:${port}`);
lines.push(``);
lines.push(`## Results`);
lines.push(``);
lines.push(`| Route | Perf | LCP | FCP | TBT | CLS | SI |`);
lines.push(`|---|---|---|---|---|---|---|`);
for (const r of results) {
  lines.push(
    `| \`${r.route}\` | ${r.score} | ${fmt(r.lcp)} ms | ${fmt(r.fcp)} ms | ${fmt(r.tbt)} ms | ${fmt(r.cls, 3)} | ${fmt(r.si)} ms |`
  );
}
lines.push(``);
lines.push(`**Geometric mean across ${results.length} routes:**`);
lines.push(``);
lines.push(`- Perf: **${fmt(geomean("score"))}**`);
lines.push(`- LCP: **${fmt(geomean("lcp"))} ms**`);
lines.push(`- FCP: **${fmt(geomean("fcp"))} ms**`);
lines.push(`- TBT: **${fmt(mean("tbt"))} ms** *(arithmetic mean; geo-mean undefined when any route is 0)*`);
lines.push(`- CLS: **${fmt(mean("cls"), 3)}** *(arithmetic mean; geo-mean undefined when any route is 0)*`);
lines.push(`- SI: **${fmt(geomean("si"))} ms**`);
lines.push(``);
if (failures.length) {
  lines.push(`## Failures`);
  lines.push(``);
  for (const f of failures) lines.push(`- ${f.route}: ${f.error}`);
  lines.push(``);
}
lines.push(`## Reproduction`);
lines.push(``);
lines.push(`From repo root with the audit-dashboard production server running on :${port}:`);
lines.push(``);
lines.push("```bash");
lines.push(`node scripts/lighthouse-mobile-baseline.mjs --tag=${tag} --port=${port}`);
lines.push("```");
lines.push(``);
lines.push(`Raw per-route Lighthouse JSON: /tmp/lh-${tag}-<slug>.json`);
lines.push(``);

const outFile = resolve(outDir, "LIGHTHOUSE.md");
writeFileSync(outFile, lines.join("\n"));

const jsonFile = resolve(outDir, "RESULTS.json");
writeFileSync(jsonFile, JSON.stringify({ tag, today, results, failures }, null, 2));

console.log("");
console.log(`✓ wrote ${outFile}`);
console.log(`✓ wrote ${jsonFile}`);
if (failures.length) {
  console.log(`✗ ${failures.length} route(s) failed`);
  process.exit(2);
}
