#!/usr/bin/env node
// Bump VERSION + audit-dashboard/src/lib/version.ts + LLM-facing prose banners
// + CHANGELOG, then run build, validate, registry.
//
// v0.12.5 — added the audit-dashboard/src/lib/version.ts bump. The runtime UI
// reads its version label from that constant (LUMEN_VERSION,
// LUMEN_VERSION_MAJOR_MINOR, LUMEN_VERSION_MAJOR_MINOR_UPPER); without keeping
// it in lockstep with VERSION, header pills / footer lines / palette footer /
// brand-voice samples drift behind the release tag.
//
// v0.13.0 — added the LLM-facing prose banner lockstep (ADR 0023). The
// "Status: v0.X.Y" chips in llms.txt, llms-full.txt, README.md, USING-LUMEN.md,
// and PRIMITIVE-COVERAGE.md drifted independently from v0.12.6 → v0.12.9
// (up to four patches stale by the time R4 audited them). The runtime-UI
// SSoT contract from v0.12.5 fixed the rendered UI labels but didn't reach
// the docs layer; v0.13.0 closes the gap by treating the LLM-facing prose
// banners as the same class of "current-version surface" the runtime UI is,
// and bumping them all from this script in lockstep. AGENTS.md and CLAUDE.md
// top callouts are EXEMPT — they carry per-release narrative prose that
// requires human authorship; contributors hand-rewrite those as part of the
// release PR.
//
// v0.13.2 — widened the rewrite set to catch four drift sites the v0.13.0
// release.mjs missed (caught by the v0.13.2 senior-UX audit pass):
//   (a) root package.json "version" field — drifted from 0.12.4 to actual VERSION
//       0.13.1 with no bump path,
//   (b) README.md "Status:" line (plain, multi-space format — not bold/chip),
//   (c) USING-LUMEN.md install URL "<cdn>/lumen/vX.Y.Z/registry/{name}.json",
//   (d) "## What's new — vX.Y.Z" section heading in README,
// plus a safety guard: refuse to run if CHANGELOG already has a [next] section
// (closes the v0.13.1 release flow's "0.13.1 → 0.13.2 over-bump" trap session 38
// hit when release.mjs was run on top of an already-bumped VERSION).

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

// v0.13.2 — guard against the 0.13.1 → 0.13.2 over-bump trap.
// If [next] already exists in CHANGELOG as a section heading, the user
// almost certainly hand-bumped VERSION and is re-running the script. Refuse.
const changelogForGuard = await readFile(join(ROOT, "CHANGELOG.md"), "utf8");
if (new RegExp(`^## \\[${next.replace(/\./g, "\\.")}\\]`, "m").test(changelogForGuard)) {
  console.error(`✗ Refusing to bump ${current} → ${next}: CHANGELOG.md already has a [${next}] section.`);
  console.error(`  Either (a) VERSION was hand-bumped to ${current} before running this script — in which case the bump is already done, skip release.mjs;`);
  console.error(`  or (b) you meant to run with a different bump tier.`);
  process.exit(1);
}

console.log(`Bumping ${current} → ${next}`);

await writeFile(versionPath, next + "\n");

// v0.13.2 — bump root package.json "version" field. Was missed by the
// v0.13.0 script and drifted to 0.12.4 while VERSION climbed to 0.13.1.
const rootPkgPath = join(ROOT, "package.json");
const rootPkgRaw = await readFile(rootPkgPath, "utf8");
const rootPkgUpdated = rootPkgRaw.replace(
  /("version":\s*")\d+\.\d+\.\d+(")/,
  `$1${next}$2`,
);
if (rootPkgUpdated !== rootPkgRaw) {
  await writeFile(rootPkgPath, rootPkgUpdated);
  console.log("  ✓ root package.json version bumped");
}

// v0.12.5 — bump the runtime constant the audit dashboard renders.
// Every user-facing version label in the deployed site reads from the
// constants in audit-dashboard/src/lib/version.ts.
const runtimeVersionPath = join(ROOT, "audit-dashboard/src/lib/version.ts");
const runtimeFile = await readFile(runtimeVersionPath, "utf8");
const [nextMaj, nextMin] = next.split(".").map(Number);
const updatedRuntime = runtimeFile
  .replace(/export const LUMEN_VERSION = "v[0-9.]+" as const;/, `export const LUMEN_VERSION = "v${next}" as const;`)
  .replace(/export const LUMEN_VERSION_MAJOR_MINOR = "v[0-9.]+" as const;/, `export const LUMEN_VERSION_MAJOR_MINOR = "v${nextMaj}.${nextMin}" as const;`)
  .replace(/export const LUMEN_VERSION_MAJOR_MINOR_UPPER = "V[0-9.]+" as const;/, `export const LUMEN_VERSION_MAJOR_MINOR_UPPER = "V${nextMaj}.${nextMin}" as const;`);
await writeFile(runtimeVersionPath, updatedRuntime);

// v0.13.0 — bump the LLM-facing prose banners in lockstep (ADR 0023).
// Patterns are intentionally narrow — each one carries enough context
// (Status:, > **vX, VERSION ←, Generated YYYY-MM-DD for Lumen vX, last
// reviewed against actual repo state) to disambiguate the current-version
// banner from historical-version prose elsewhere in the same file. Casual
// "v0.12.9" mentions inside CHANGELOG narrative, ADR titles, or prose body
// will NOT match.
const today = new Date().toISOString().slice(0, 10);
const llmFacingFiles = [
  "llms.txt",
  "llms-full.txt",
  "README.md",
  "USING-LUMEN.md",
  "PRIMITIVE-COVERAGE.md",
];
const bannerRewrites = [
  // llms.txt — "**Status: v0.12.6 (2026-05-16)**"
  [/(\*\*Status: v)\d+\.\d+\.\d+( \(\d{4}-\d{2}-\d{2}\)\*\*)/g, `$1${next} (${today})**`.slice(0, -2) + "$2".slice(-2)],
  // The closure above is fiddly. Use two-pass instead — first the version, then the date if present:
];

let totalRewrites = 0;
for (const file of llmFacingFiles) {
  const p = join(ROOT, file);
  let body;
  try {
    body = await readFile(p, "utf8");
  } catch (e) {
    console.warn(`  (skip ${file}: ${e.code})`);
    continue;
  }
  const before = body;
  // 1. "**Status: v0.X.Y (YYYY-MM-DD)**" → "**Status: v{next} ({today})**"
  body = body.replace(
    /(\*\*Status: v)\d+\.\d+\.\d+(?: \(\d{4}-\d{2}-\d{2}\))?\*\*/g,
    `$1${next} (${today})**`,
  );
  // 2. "> **v0.X.Y — " → "> **v{next} — "  (llms-full.txt top callout)
  body = body.replace(/(> \*\*v)\d+\.\d+\.\d+( — )/g, `$1${next}$2`);
  // 3. "**Status: v0.X.Y · " → "**Status: v{next} · " (README.md status badge)
  body = body.replace(/(\*\*Status: v)\d+\.\d+\.\d+( · )/g, `$1${next}$2`);
  // 4. "VERSION                         ← 0.X.Y" (README.md tree label)
  body = body.replace(/(VERSION\s+← )\d+\.\d+\.\d+/g, `$1${next}`);
  // 5. "> **Generated YYYY-MM-DD for Lumen v0.X.Y.**" (PRIMITIVE-COVERAGE.md)
  body = body.replace(
    /(> \*\*Generated )\d{4}-\d{2}-\d{2}( for Lumen v)\d+\.\d+\.\d+(\.\*\*)/g,
    `$1${today}$2${next}$3`,
  );
  // 6. "Status: v0.X.Y · YYYY-MM-DD" (USING-LUMEN.md line-3 + line-51 status block)
  body = body.replace(
    /(Status: v)\d+\.\d+\.\d+( · )\d{4}-\d{2}-\d{2}/g,
    `$1${next}$2${today}`,
  );
  // 7. "Last reviewed against actual repo state: YYYY-MM-DD (v0.X.Y)" (USING-LUMEN.md footer)
  body = body.replace(
    /(Last reviewed against actual repo state: )\d{4}-\d{2}-\d{2}( \(v)\d+\.\d+\.\d+(\))/g,
    `$1${today}$2${next}$3`,
  );
  // 8. "Lumen v0.X.Y — Premium Psychology" (USING-LUMEN.md §1 status block first line)
  body = body.replace(
    /(Lumen v)\d+\.\d+\.\d+( — )/g,
    `$1${next}$2`,
  );
  // 9. (v0.13.2 — README.md plain Status: line, multi-space format)
  // README.md ASCII block uses "Status:             v0.X.Y · ..." with run-on
  // spaces for alignment; the bold-chip pattern at #3 doesn't match. Preserve
  // the trailing spacing exactly so the column alignment with adjacent rows
  // (Tokens:, Distribution:) isn't broken.
  body = body.replace(
    /(^Status:\s+v)\d+\.\d+\.\d+(\s*·\s*)/m,
    `$1${next}$2`,
  );
  // 10. (v0.13.2 — USING-LUMEN.md install URL "<cdn>/lumen/v0.X.Y/registry")
  body = body.replace(
    /(<cdn>\/lumen\/v)\d+\.\d+\.\d+(\/registry)/g,
    `$1${next}$2`,
  );
  // 11. (v0.13.2 — README.md "## What's new — v0.X.Y" section heading)
  // Only the latest one is matched (anchored to the latest version on the
  // "What's new" line — historical "### v0.12.5" entries stay literal).
  body = body.replace(
    /(## What's new — v)\d+\.\d+\.\d+/g,
    `$1${next}`,
  );

  if (body !== before) {
    await writeFile(p, body);
    totalRewrites += 1;
    console.log(`  ✓ rewrote banner in ${file}`);
  } else {
    console.log(`  · no banner match in ${file} (expected if file doesn't carry a Status: line)`);
  }
}

const changelogPath = join(ROOT, "CHANGELOG.md");
const changelog = await readFile(changelogPath, "utf8");
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
console.log(`  - LLM-facing prose banners rewritten in ${totalRewrites}/${llmFacingFiles.length} files (ADR 0023)`);
console.log("  - CHANGELOG entry prepended");
console.log("Next: review CHANGELOG.md + AGENTS.md/CLAUDE.md top callouts, commit, tag, push.");
console.log("Reminder (per ADR 0023): AGENTS.md + CLAUDE.md top callouts are EXEMPT from the script;");
console.log("hand-rewrite them with the cycle's narrative as part of the release PR.");
