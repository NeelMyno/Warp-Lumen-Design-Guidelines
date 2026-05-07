#!/usr/bin/env node
// Bump VERSION + audit-dashboard/src/lib/version.ts (the user-facing constant
// the runtime UI reads), prepend CHANGELOG, run build, validate, registry.
//
// v0.12.5 — added the audit-dashboard/src/lib/version.ts bump. The runtime
// UI reads its version label from that constant (LUMEN_VERSION,
// LUMEN_VERSION_MAJOR_MINOR, LUMEN_VERSION_MAJOR_MINOR_UPPER); without
// keeping it in lockstep with VERSION, header pills / footer lines / palette
// footer / brand-voice samples drift behind the release tag. The v0.11.13 →
// v0.12.4 audit caught this exact drift in the command palette footer.
// Keep all four bump sites in lockstep here.

import { readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const bump = process.argv[2] ?? "patch"; // major | minor | patch

const versionPath = join(ROOT, "VERSION");
const current = (await readFile(versionPath, "utf8")).trim();
const [maj, min, pat] = current.split(".").map(Number);

const next =
  bump === "major" ? `${maj + 1}.0.0` :
  bump === "minor" ? `${maj}.${min + 1}.0` :
                     `${maj}.${min}.${pat + 1}`;

console.log(`Bumping ${current} → ${next}`);

await writeFile(versionPath, next + "\n");

// v0.12.5 — also bump the runtime constant the audit dashboard renders.
// The constant exports drive every user-facing version label in the deployed
// site — header pill, footer line, palette footer, brand-voice samples,
// tool / library / foundations badges. Pre-v0.12.5 these were hardcoded
// per-file and drifted independently (the v0.11.13 → v0.12.4 audit found
// the palette footer three minor versions stale). v0.12.5 routed every
// consumer through the constants in audit-dashboard/src/lib/version.ts;
// this script keeps them in lockstep with the root VERSION file.
const runtimeVersionPath = join(ROOT, "audit-dashboard/src/lib/version.ts");
const runtimeFile = await readFile(runtimeVersionPath, "utf8");
const [nextMaj, nextMin] = next.split(".").map(Number);
const updatedRuntime = runtimeFile
  .replace(/export const LUMEN_VERSION = "v[0-9.]+" as const;/, `export const LUMEN_VERSION = "v${next}" as const;`)
  .replace(/export const LUMEN_VERSION_MAJOR_MINOR = "v[0-9.]+" as const;/, `export const LUMEN_VERSION_MAJOR_MINOR = "v${nextMaj}.${nextMin}" as const;`)
  .replace(/export const LUMEN_VERSION_MAJOR_MINOR_UPPER = "V[0-9.]+" as const;/, `export const LUMEN_VERSION_MAJOR_MINOR_UPPER = "V${nextMaj}.${nextMin}" as const;`);
await writeFile(runtimeVersionPath, updatedRuntime);

const changelogPath = join(ROOT, "CHANGELOG.md");
const changelog = await readFile(changelogPath, "utf8");
const today = new Date().toISOString().slice(0, 10);
const entry = `## [${next}] — ${today}\n\n_See \`[Unreleased]\` for details; promote entries here on release._\n\n`;
const updated = changelog.replace(
  /## \[Unreleased\]\n/,
  `## [Unreleased]\n\n${entry}`,
);
await writeFile(changelogPath, updated);

console.log("Running build + validate + registry...");
execSync("pnpm build && pnpm validate && pnpm registry", {
  cwd: ROOT,
  stdio: "inherit",
});

console.log(`\n✓ Released ${next}`);
console.log("  - VERSION bumped");
console.log("  - audit-dashboard/src/lib/version.ts bumped (LUMEN_VERSION + MAJOR_MINOR variants)");
console.log("  - CHANGELOG entry prepended");
console.log("Next: review CHANGELOG.md, commit, tag, push.");
