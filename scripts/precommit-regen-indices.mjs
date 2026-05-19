#!/usr/bin/env node
// Pre-commit hook — keeps the two SSoT indices in lockstep with the sources
// they catalog. Invoked via simple-git-hooks (see package.json).
//
// Logic:
//   1. Read the staged file list (`git diff --cached --name-only`).
//   2. If any path matches `design-system/02-components/.*\/component\.json$`
//      → run `pnpm component-index` → restage COMPONENT-INDEX.md if changed.
//   3. If any path matches `design-system/01-tokens/.*\.tokens\.json$`
//      → run `pnpm token-index` → restage TOKEN-INDEX.md if changed.
//   4. Exits 0 unless a regenerator fails — never blocks the commit on the
//      content of the regeneration (commit-blocking belongs to the validators).
//
// Conservative by design: skipped if no relevant files were staged. Never
// invokes the heavy `pnpm build` or `pnpm registry` on every commit.

import { execSync } from "node:child_process";

const log = (s) => process.stderr.write(`[lumen pre-commit] ${s}\n`);

function run(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
  } catch (e) {
    return e.stdout?.toString() ?? "";
  }
}

const staged = run("git diff --cached --name-only --diff-filter=ACM").trim().split("\n").filter(Boolean);

if (staged.length === 0) process.exit(0);

const touchesComponents = staged.some((p) => /^design-system\/02-components\/[^\/]+\/component\.json$/.test(p));
const touchesTokens = staged.some((p) => /^design-system\/01-tokens\/.+\.tokens\.json$/.test(p));

if (!touchesComponents && !touchesTokens) process.exit(0);

if (touchesComponents) {
  log("component.json changed — regenerating COMPONENT-INDEX.md…");
  try {
    execSync("pnpm component-index", { stdio: "inherit" });
    execSync("git add COMPONENT-INDEX.md", { stdio: "ignore" });
    log("  ✓ COMPONENT-INDEX.md restaged");
  } catch (e) {
    log("  ✗ component-index FAILED — commit will block:");
    log(String(e?.message));
    process.exit(1);
  }
}

if (touchesTokens) {
  log("*.tokens.json changed — regenerating TOKEN-INDEX.md…");
  try {
    execSync("pnpm token-index", { stdio: "inherit" });
    execSync("git add TOKEN-INDEX.md", { stdio: "ignore" });
    log("  ✓ TOKEN-INDEX.md restaged");
  } catch (e) {
    log("  ✗ token-index FAILED — commit will block:");
    log(String(e?.message));
    process.exit(1);
  }
}

process.exit(0);
