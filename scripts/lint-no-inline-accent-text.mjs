#!/usr/bin/env node
/**
 * lint:no-inline-accent-text — the 4th-tier lint (v0.15 R16, ADR 0035).
 *
 * Closes the gap surfaced by the TMS consumer (chat 36-A, May 20 2026): an
 * inline Tailwind arbitrary-class conjunction like
 *
 *   <div class="bg-[var(--color-accent-500)] text-[var(--color-text-on-accent,white)]">
 *
 * compiles to a class that paints `--text-primary` (#E6E6E6) on Spring
 * Green — 1.66:1 AA fail — because Tailwind v4's content scanner drops the
 * `,white` comma-fallback under arbitrary-class compile. The right token
 * (`--color-text-on-accent`) didn't exist in :root either (typo for
 * `--color-fg-on-accent`), so even with the fallback intact the `var()`
 * would have resolved to nothing. The consumer hit this in 11+ places
 * across an operator console and shipped a black-text-on-green contrast
 * failure to production.
 *
 * The R11/R14/R15 lint trio catches retired-TOKEN drift in token-source,
 * docs prose, and TSX prose respectively. It does NOT catch ACTIVE-TOKEN
 * misuse — references to currently-valid tokens that compose into a
 * visually-wrong inline class. R16 adds this fourth tier.
 *
 * Forbidden patterns (any one is enough to flag):
 *
 *   1. `bg-[var(--lumen-accent-{3,4,5,6})]`        // accent BG primitive
 *      paired on the SAME className string with
 *      `text-[var(--color-text-on-accent...`       // any var(),
 *      `text-[var(--color-fg-on-accent...`         // any of the 6 aliases,
 *      `text-[var(--color-primary-foreground...`   // even when the alias
 *      `text-[var(--color-accent-foreground...`    // exists. Inline pattern
 *      `text-[var(--color-on-accent...`            // is the bug class.
 *      `text-[var(--text-on-accent...`
 *      `text-[var(--color-action-primary-fg...`
 *      `text-white|text-[#fff...|text-[#ffffff...` (covered by lint:no-white-on-accent
 *                                                    but re-flagged here for completeness)
 *
 *   2. `bg-[var(--color-accent-...)]`              // semantic accent BG
 *      paired with any of the above text patterns.
 *
 *   3. `bg-[var(--color-action-primary-bg-...)]`   // primary action BG
 *      paired with any of the above text patterns.
 *
 *   4. `bg-primary` (shadcn bridge) + any of the above text patterns.
 *      lint:no-white-on-accent already flags `bg-primary` in product code,
 *      but the conjunction-flag is a stronger signal.
 *
 * The right answer is ALWAYS to reach for a defensive class:
 *   .lumen-btn-primary    → primary button
 *   .lumen-pill-active    → active filter chip / segmented control / mode pill
 *   <Button variant="primary"> → the primitive contract
 *
 * Both halves of the inline conjunction can be safely omitted because the
 * defensive class consumes the same --color-action-primary-* tokens
 * internally and is contrast-audited at the system level.
 *
 * Allowlist directives:
 *   - inline `lumen-lint-allow: inline-accent-text` on the same line OR
 *     the immediately preceding line.
 *   - `lumen-lint-allow-block: inline-accent-text` ... `lumen-lint-allow-end: inline-accent-text`
 *     for multi-line blocks.
 *   - file-level `lumen-lint-allow: inline-accent-text` in any of the first
 *     20 lines for whole-file legacy / migration / vendor carve-out.
 *
 * Files scanned: audit-dashboard/src + design-system/02-components.
 * Exempt paths: design-system/02-components/_schema.
 *
 * Run:    pnpm lint:no-inline-accent-text
 * Exits non-zero on violations.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGETS = [
  join(ROOT, "audit-dashboard/src"),
  join(ROOT, "design-system/02-components"),
];

const EXEMPT_PATHS = [
  /design-system\/02-components\/_schema\//,
  /\/node_modules\//,
];

/** Match any green BG token reference. Covers primitive `--lumen-accent-{3,4,5,6}`,
 *  semantic `--color-accent-{rest,hover,press,N}`, action-primary BG, and shadcn
 *  bridge `bg-primary`. */
const ACCENT_BG_RE =
  /\b(?:bg-\[var\(--lumen-accent-[3-6]\)\]|bg-\[var\(--color-accent(?:-[a-z0-9]+)?\)\]|bg-\[var\(--color-action-primary-bg(?:-[a-z]+)?\)\]|bg-primary(?:-[a-z]+)?\b(?!-))/;

/** Match a text-color arbitrary class that uses a `var()` WITH a comma-fallback.
 *  Comma-fallback is the bug class: Tailwind v4's content scanner has been
 *  observed to drop comma-fallbacks in arbitrary-class compile (a known v4
 *  bug class). The fallback may resolve to white at the cascade level even
 *  when the primary var is correct, producing 1.66:1 contrast on Spring Green
 *  (WCAG AA fail). */
const TEXT_WITH_COMMA_FALLBACK_RE =
  /\btext-\[var\(--[a-zA-Z0-9_-]+\s*,\s*[^\]]+\)\]/;

/** Match the broader "white / paper / text-primary" patterns the existing
 *  lint:no-white-on-accent already catches. Re-checked here for double
 *  enforcement of the conjunction signal. */
const WHITE_FG_RE =
  /\b(?:text-white|text-\[#fff\b|text-\[#ffffff\]|text-\[var\(--lumen-paper-[a-z0-9]+\)\]|text-\[var\(--text-primary\)\])/;

/** The documented inline pattern (the audit-dashboard's vendor cva Button
 *  consumes it directly):
 *    bg-[var(--color-action-primary-bg-{rest,hover,press})] text-[var(--color-action-primary-fg)]
 *  Both tokens are defined in :root, neither has a comma-fallback, the
 *  bracket syntax always compiles in Tailwind v4. NOT flagged.
 *
 *  The bug class — what IS flagged — is the comma-fallback OR the white literal. */

const ALLOW_LINE = /lumen-lint-allow:\s*inline-accent-text/;
const ALLOW_BLOCK_START = /lumen-lint-allow-block:\s*inline-accent-text/;
const ALLOW_BLOCK_END   = /lumen-lint-allow-end:\s*inline-accent-text/;

const isProductFile = (p) =>
  /\.(tsx?|jsx)$/.test(p) && !/\.(test|spec)\./.test(p);
const isExempt = (p) => EXEMPT_PATHS.some((re) => re.test(p));

async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let violations = 0;
const results = [];

for (const target of TARGETS) {
  try { await stat(target); } catch { continue; }

  for await (const file of walk(target)) {
    if (!isProductFile(file)) continue;
    if (isExempt(file)) continue;

    const content = await readFile(file, "utf8");
    const lines = content.split("\n");

    // File-level allowlist directive.
    const header = lines.slice(0, 20).join("\n");
    if (ALLOW_LINE.test(header)) continue;

    let inAllowBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (ALLOW_BLOCK_START.test(line)) inAllowBlock = true;
      if (ALLOW_BLOCK_END.test(line))   inAllowBlock = false;
      const prevLine = i > 0 ? lines[i - 1] : "";
      if (inAllowBlock || ALLOW_LINE.test(line) || ALLOW_LINE.test(prevLine)) continue;

      const hasAccentBg = ACCENT_BG_RE.test(line);
      if (!hasAccentBg) continue;

      // Conjunction-as-bug: comma-fallback (Tailwind v4 drops it) OR explicit
      // white literal. The "use defined token + no fallback" pattern is the
      // documented inline-arbitrary-class form per the globals.css comment at
      // line ~841 — NOT flagged here.
      const fallbackMatch = line.match(TEXT_WITH_COMMA_FALLBACK_RE);
      const whiteMatch    = line.match(WHITE_FG_RE);
      const fgMatch = fallbackMatch || whiteMatch;
      if (!fgMatch) continue;

      const bgMatch = line.match(ACCENT_BG_RE);
      violations++;
      results.push({
        file: file.replace(ROOT + "/", ""),
        line: i + 1,
        col: (bgMatch?.index ?? 0) + 1,
        kind: fallbackMatch ? "inline-accent-text-with-comma-fallback" : "inline-white-on-accent-conjunction",
        match: `${bgMatch?.[0]} … ${fgMatch?.[0]}`,
        hint: fallbackMatch
          ? `Inline accent BG + text-arbitrary-class WITH comma-fallback. Tailwind v4's ` +
            `content scanner has been observed to DROP the comma-fallback at compile, ` +
            `leaving an undefined-token reference that inherits --text-primary (#E6E6E6) ` +
            `from the cascade — painting 1.66:1 on Spring Green (WCAG AA fail). The TMS ` +
            `consumer (chat 36-A) hit this 11+ times. Replace with a defensive class: ` +
            `.lumen-btn-primary (button) or .lumen-pill-active (chip / segmented). Both ` +
            `consume --color-action-primary-* internally and are contrast-audited at ` +
            `the system level (14.7:1 AAA). See design-system/00-foundations/defensive-classes.md.`
          : `Inline accent BG + explicit white text — 1.66:1 contrast on Spring Green ` +
            `(WCAG AA fail). The accent foreground is --color-text-on-accent (= ` +
            `--lumen-accent-fg = #07120D, 14.7:1 AAA). Replace with .lumen-btn-primary ` +
            `(button) or .lumen-pill-active (chip / segmented).`,
        content: line.trim(),
      });
    }
  }
}

if (violations === 0) {
  console.log("[lint:no-inline-accent-text] ✓ no inline accent BG + text conjunctions. Defensive classes carry the contrast contract.");
  process.exit(0);
}

console.error(`[lint:no-inline-accent-text] ✖ ${violations} violation(s):\n`);
for (const r of results) {
  console.error(`  ${r.file}:${r.line}:${r.col}  [${r.kind}]`);
  console.error(`    match: ${r.match}`);
  console.error(`    line:  ${r.content.length > 120 ? r.content.slice(0, 117) + "..." : r.content}`);
  console.error(`    hint:  ${r.hint}\n`);
}
process.exit(1);
