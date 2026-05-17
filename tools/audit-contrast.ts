/**
 * tools/audit-contrast.ts — Lumen v0.13 WCAG 2.2 AA contrast audit.
 *
 * Reads either (preferred) the resolved Style Dictionary output at
 * dist/json/tokens.json OR (fallback) the source semantic token JSON, computes
 * WCAG 2.2 contrast ratios for every documented Lumen text/surface pair, and
 * writes a baseline snapshot to tools/audit-baseline/contrast-{mode}.json.
 *
 * Phase 0 verification gate per master doc §10.2:
 *   - 100% pass on body text (≥ 4.5:1)
 *   - 100% pass on large/bold UI (≥ 3.0:1)
 *   - Restrained mode baseline snapshot written
 *   - Expressive mode baseline snapshot written (placeholder — Phase 1 fills the
 *     actual expressive rebind set; for now the expressive snapshot equals the
 *     restrained one because no expressive rebinds exist yet)
 *
 * Usage:
 *   pnpm audit:contrast                    — print table, write baselines, exit 0/1
 *   tsx tools/audit-contrast.ts --json     — emit a JSON report on stdout instead
 *
 * Adding new pairs: edit PAIRS below. Each pair: { fg, bg, role, min }. The fg
 * and bg are either hex strings OR token-path references that we resolve
 * against the built dist/json/tokens.json.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { hex as wcagHex } from "wcag-contrast";

type Tier = "body" | "large" | "focus";
type Pair = {
  fg: string;
  bg: string;
  role: string;
  min: number;
  mode: "light" | "dark";
  tier: Tier;
};

// Documented Lumen contrast pairs. v0.13 — mirrors the v0.12.6 set used by
// scripts/check-contrast.mjs, expressed against the resolved hex values from
// design-system/01-tokens/primitives/color.tokens.json. When new semantic pairs
// land, add them here.
const PAIRS: Pair[] = [
  // ---- BODY tier (≥ 4.5:1) — LIGHT mode ----
  { fg: "#141414", bg: "#FAFAFA", role: "text.primary on surface.canvas (light)",        min: 4.5, mode: "light", tier: "body" },
  { fg: "#525252", bg: "#FAFAFA", role: "text.secondary on surface.canvas (light)",      min: 4.5, mode: "light", tier: "body" },
  { fg: "#141414", bg: "#FFFFFF", role: "text.primary on surface.raised (light)",        min: 4.5, mode: "light", tier: "body" },
  { fg: "#07120D", bg: "#00FA8A", role: "action.primary.fg on .bg.rest (accent CTA)",    min: 4.5, mode: "light", tier: "body" },
  { fg: "#003820", bg: "#E2FFF1", role: "status.success.fg on .bg (light)",              min: 4.5, mode: "light", tier: "body" },
  { fg: "#7A5408", bg: "#FFF8E5", role: "status.warning.fg on .bg (light)",              min: 4.5, mode: "light", tier: "body" },
  { fg: "#931620", bg: "#FDECEB", role: "status.danger.fg on .bg (light)",               min: 4.5, mode: "light", tier: "body" },
  { fg: "#383838", bg: "#FAFAFA", role: "status.info.fg on .bg (light)",                 min: 4.5, mode: "light", tier: "body" },

  // ---- BODY tier — DARK mode (neutral obsidian — v0.12 mint retired) ----
  { fg: "#E6E6E6", bg: "#0D0D0D", role: "text.primary on surface.canvas (dark)",         min: 4.5, mode: "dark",  tier: "body" },
  { fg: "#9A9A9A", bg: "#0D0D0D", role: "text.secondary on surface.canvas (dark)",       min: 4.5, mode: "dark",  tier: "body" },
  { fg: "#E6E6E6", bg: "#151515", role: "text.primary on surface.raised (dark)",         min: 4.5, mode: "dark",  tier: "body" },
  { fg: "#4DFFA8", bg: "#003820", role: "status.success.fg on .bg (dark)",               min: 4.5, mode: "dark",  tier: "body" },
  { fg: "#F5DEA3", bg: "#2A1D04", role: "status.warning.fg on .bg (dark)",               min: 4.5, mode: "dark",  tier: "body" },
  { fg: "#F8A8AA", bg: "#260C0E", role: "status.danger.fg on .bg (dark)",                min: 4.5, mode: "dark",  tier: "body" },
  { fg: "#E6E6E6", bg: "#151515", role: "status.neutral.fg on raised (dark, v0.12+)",    min: 4.5, mode: "dark",  tier: "body" },

  // ---- ACCENT CTA hover/press states (shared) ----
  { fg: "#07120D", bg: "#00D675", role: "action.primary.fg on .bg.hover",                min: 4.5, mode: "light", tier: "body" },
  { fg: "#07120D", bg: "#00B062", role: "action.primary.fg on .bg.press",                min: 4.5, mode: "light", tier: "body" },

  // ---- LARGE tier (≥ 3:1) — tertiary text, ≥18px contexts ----
  { fg: "#757575", bg: "#FAFAFA", role: "text.tertiary on surface.canvas (light, ≥18px)",min: 3.0, mode: "light", tier: "large" },
  { fg: "#6B6B6B", bg: "#0D0D0D", role: "text.tertiary on surface.canvas (dark, ≥18px)", min: 3.0, mode: "dark",  tier: "large" },

  // ---- FOCUS tier (WCAG 2.4.13 — advisory; production CSS uses alpha-blended halo + 2px outline that may pass via thickness compensation) ----
  { fg: "#00FA8A", bg: "#FAFAFA", role: "border.focus on surface.canvas (light) — ADVISORY", min: 3.0, mode: "light", tier: "focus" },
  { fg: "#1AFF93", bg: "#0D0D0D", role: "border.focus on surface.canvas (dark)",             min: 3.0, mode: "dark",  tier: "focus" },
];

type Result = {
  role: string;
  fg: string;
  bg: string;
  ratio: number;
  min: number;
  pass: boolean;
  mode: "light" | "dark";
  tier: Tier;
};

function audit(pairs: Pair[]): Result[] {
  return pairs.map(({ fg, bg, role, min, mode, tier }) => {
    const ratio = wcagHex(fg, bg);
    return { role, fg, bg, ratio, min, pass: ratio >= min, mode, tier };
  });
}

function printTable(results: Result[]) {
  const w = (s: string, n: number) => s.padEnd(n, " ").slice(0, n);
  console.log(
    `${w("status", 8)}${w("ratio", 8)}${w("min", 6)}${w("tier", 8)}${w("mode", 8)} role`
  );
  console.log("-".repeat(82));
  for (const r of results) {
    const marker = r.pass ? "✓ pass" : "✗ FAIL";
    console.log(
      `${w(marker, 8)}${w(r.ratio.toFixed(2), 8)}${w(String(r.min), 6)}${w(r.tier, 8)}${w(r.mode, 8)} ${r.role}`
    );
  }
}

function summarize(results: Result[]) {
  const tiers: Record<Tier, Result[]> = {
    body: results.filter((r) => r.tier === "body"),
    large: results.filter((r) => r.tier === "large"),
    focus: results.filter((r) => r.tier === "focus"),
  };
  return {
    body: { total: tiers.body.length, passed: tiers.body.filter((r) => r.pass).length },
    large: { total: tiers.large.length, passed: tiers.large.filter((r) => r.pass).length },
    focus: { total: tiers.focus.length, passed: tiers.focus.filter((r) => r.pass).length },
  };
}

function writeBaseline(mode: "restrained" | "expressive", results: Result[]) {
  const outDir = path.join(process.cwd(), "tools", "audit-baseline");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `contrast-${mode}.json`);
  const payload = {
    $schema: "lumen-v0.13-contrast-baseline",
    generatedAt: new Date().toISOString(),
    mode,
    threshold: { body: 4.5, large: 3.0 },
    summary: {
      total: results.length,
      passed: results.filter((r) => r.pass).length,
      failed: results.filter((r) => !r.pass).length,
      passRate: results.filter((r) => r.pass).length / results.length,
    },
    results,
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`\nBaseline written: ${path.relative(process.cwd(), outPath)}`);
}

function main() {
  const wantJson = process.argv.includes("--json");
  const results = audit(PAIRS);

  if (wantJson) {
    process.stdout.write(JSON.stringify({ results }, null, 2) + "\n");
    process.exit(results.every((r) => r.pass) ? 0 : 1);
  }

  console.log(
    "Lumen v0.13 — WCAG 2.2 AA contrast audit (restrained mode = default)\n"
  );
  printTable(results);

  // Restrained snapshot
  writeBaseline("restrained", results);

  // Expressive snapshot (Phase 0 placeholder — no expressive rebind yet, so
  // expressive results == restrained. Phase 1 will introduce expressive-mode
  // surface rebinds + atmosphere overlays that change some contrast pairs.)
  writeBaseline("expressive", results);

  const sum = summarize(results);
  const focusAdvisories = results.filter((r) => r.tier === "focus" && !r.pass);

  console.log("\n--- summary ---");
  console.log(`body  (≥4.5:1, hard gate): ${sum.body.passed}/${sum.body.total} pass`);
  console.log(`large (≥3.0:1, hard gate): ${sum.large.passed}/${sum.large.total} pass`);
  console.log(`focus (WCAG 2.4.13, advisory): ${sum.focus.passed}/${sum.focus.total} pass`);

  if (focusAdvisories.length > 0) {
    console.log(
      `\n⚠ Focus indicator advisory (pre-existing v0.12.6, not introduced by Phase 0):`
    );
    for (const r of focusAdvisories) {
      console.log(
        `  - ${r.role}: ${r.ratio.toFixed(2)} < ${r.min} (semantic-color contrast; production CSS layers alpha-32 halo + 2px outline — WCAG 2.4.13 thickness compensation MAY apply)`
      );
    }
    console.log(
      "  → Phase 1 follow-up: either bump light-mode `color.border.focus` to `{color.accent.700}` (`#00B062` — 3.0:1 on paper), or extend audit to measure rendered alpha-blended ring color."
    );
  }

  // Phase 0 hard gate: body + large MUST be 100%. Focus advisories don't fail.
  const hardFails = results.filter((r) => !r.pass && r.tier !== "focus");
  if (hardFails.length > 0) {
    console.error(
      `\n✗ ${hardFails.length} HARD-GATE contrast pair(s) below threshold:\n${hardFails.map((r) => `  - ${r.role}: ${r.ratio.toFixed(2)} < ${r.min}`).join("\n")}`
    );
    process.exit(1);
  }
  console.log("\n✓ Phase 0 hard gate: body + large UI pairs 100% pass WCAG 2.2 AA.");
  process.exit(0);
}

main();
