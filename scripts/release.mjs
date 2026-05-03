#!/usr/bin/env node
// Bump VERSION, prepend CHANGELOG, run build, validate, registry.

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
console.log("Next: review CHANGELOG.md, commit, tag, push.");
