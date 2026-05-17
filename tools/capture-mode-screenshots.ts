/**
 * v0.13.4 Phase 10 — Capture restrained vs expressive screenshot pairs.
 *
 * Generates 16 PNGs (8 routes × 2 modes) at
 * `design-system/06-claude-code-briefings/phase-10-screenshots/`. These are
 * the visual proof that ships with the phase report — the operator opens
 * the folder, sees 16 PNGs, and can verify the visual change without
 * spinning up the dev server.
 *
 * Uses Playwright headed mode (NOT headless) so font rendering matches
 * what the operator sees in Chrome on macOS. Satoshi's variable-font
 * rendering differs subtly between headless and headed builds; the
 * screenshots are the authoritative visual record, so we render through
 * the real font pipeline.
 *
 * Operator-side execution (deferred from in-env per phase contract):
 *
 *   1. `pnpm install` in audit-dashboard/ to materialize @playwright/test
 *      + pixelmatch + pngjs.
 *   2. `pnpm exec playwright install chromium` to pull the browser binary.
 *   3. In a separate shell: `cd audit-dashboard && pnpm dev` to boot the
 *      dev server on http://localhost:3000.
 *   4. From repo root: `pnpm tsx tools/capture-mode-screenshots.ts`.
 *
 * The script gracefully errors when Playwright isn't installed — see the
 * dynamic-import block in `main()`.
 */
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const ROUTES = [
  "foundations",
  "library",
  "saas",
  "landing",
  "tool",
  "commerce",
  "mobile",
  "desktop",
] as const;

const MODES = ["restrained", "expressive"] as const;

const OUT_DIR = resolve(
  process.cwd(),
  "design-system/06-claude-code-briefings/phase-10-screenshots"
);

const BASE_URL = process.env.LUMEN_TEST_BASE_URL ?? "http://localhost:3000";

async function main() {
  let chromium: typeof import("@playwright/test")["chromium"];
  try {
    ({ chromium } = await import("@playwright/test"));
  } catch {
    console.error(
      "[capture-mode-screenshots] @playwright/test is not installed.\n" +
        "Run `pnpm install` in audit-dashboard/ + `pnpm exec playwright install chromium`, then retry.\n" +
        "If you're running this in CI, ensure both dependencies are in the lockfile.\n"
    );
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: false }); // headed for accurate font rendering
  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: "dark",
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `${BASE_URL}/${route}`;
      console.log(`[capture-mode-screenshots] → ${url}`);
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
      } catch (err) {
        console.error(
          `[capture-mode-screenshots] FAILED to load ${url}.\n` +
            "  Is the dev server running? `cd audit-dashboard && pnpm dev`\n" +
            `  Original error: ${(err as Error).message}\n`
        );
        continue;
      }

      for (const mode of MODES) {
        await page.evaluate((m) => {
          document.documentElement.setAttribute("data-mode", m);
          try {
            window.localStorage.setItem("lumen-mode", m);
          } catch {
            /* localStorage blocked — degrade silently. */
          }
        }, mode);
        // Wait for the mode-aware cascade + any motion to settle.
        await page.waitForTimeout(800);

        const outPath = resolve(OUT_DIR, `${route}-${mode}.png`);
        await page.screenshot({
          path: outPath,
          fullPage: false, // viewport only — hero is above the fold
          animations: "disabled", // freeze mesh-drift / pulse
        });
        console.log(`[capture-mode-screenshots]   ✓ ${route}-${mode}.png`);
      }
    }
  } finally {
    await browser.close();
  }

  console.log(
    `\n[capture-mode-screenshots] Wrote ${ROUTES.length * MODES.length} PNGs to:\n  ${OUT_DIR}\n`
  );
}

main().catch((err) => {
  console.error("[capture-mode-screenshots] Unhandled error:", err);
  process.exit(1);
});
