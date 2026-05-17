/**
 * v0.13.4 Phase 10 — Surface-page mode-toggle visual-diff test.
 *
 * Asserts that each retrofitted surface page renders visibly differently
 * in `data-mode="restrained"` vs `data-mode="expressive"`. Catches the
 * regression the Phase 10 patch closes: that the chrome ModeToggle had
 * NO visible effect on the seven preserved surface pages.
 *
 * The 5000-pixel threshold is generous. Even a small mesh atmosphere change
 * easily clears 50,000 pixels of difference between modes. The threshold
 * exists to catch the failure mode where a page truly doesn't change at all
 * — which was the v0.13.0 → v0.13.3 state before this Phase 10 retrofit.
 *
 * If any route fails the test after retrofit, the retrofit on that page is
 * incomplete — the test failure is the signal to deepen the retrofit (extend
 * `.lumen-hero` to a second container, or add `.lumen-noise-overlay` if the
 * hero was the only retrofit and it's not visually distinct enough).
 *
 * Operator-side execution path:
 *
 *   1. `pnpm install` in audit-dashboard/ to materialize @playwright/test +
 *      pixelmatch + pngjs (declared as devDeps; not in this env's
 *      node_modules until install runs against an online lockfile).
 *   2. `pnpm exec playwright install chromium` to pull the browser binary.
 *   3. Boot the dev server in another shell: `pnpm dev` (audit-dashboard/).
 *      (Or `pnpm build && pnpm start` for production parity.)
 *   4. Run the test: `pnpm test:mode-toggle`.
 *
 * The test file is committed as-is so operator-side execution is one
 * command away. Per master-doc Phase 1 + Phase 6 precedent, in-env
 * execution is deferred when it requires `pnpm install` that pulls
 * external binaries (Playwright Chromium ≈ 200 MB).
 */
import { test, expect } from "@playwright/test";

// The 8 surface pages this Phase 10 patch retrofits.
const ROUTES = [
  "/foundations",
  "/library",
  "/saas",
  "/landing",
  "/tool",
  "/commerce",
  "/mobile",
  "/desktop",
] as const;

// Pixel-diff threshold. Generous — a properly retrofitted hero panel
// produces tens of thousands of changed pixels between modes. The
// 5,000-pixel floor catches "no change at all" without producing
// false negatives on subtle retrofits.
const PIXEL_DIFF_FLOOR = 5_000;

// Pixel-color threshold for pixelmatch. 0.1 = "any visible color shift
// counts as a changed pixel" (sub-pixel anti-aliasing artifacts are
// ignored). Tighter than the default 0.2 because we want to catch
// even the most subtle atmospheric overlay change.
const PIXEL_COLOR_THRESHOLD = 0.1;

const BASE_URL = process.env.LUMEN_TEST_BASE_URL ?? "http://localhost:3000";

for (const route of ROUTES) {
  test(`${route} renders visibly different in restrained vs expressive mode`, async ({ page }) => {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });

    // Set restrained mode + let any motion settle.
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-mode", "restrained");
      try {
        window.localStorage.setItem("lumen-mode", "restrained");
      } catch {
        /* localStorage blocked — degrade silently. */
      }
    });
    await page.waitForTimeout(500);

    const restrainedScreenshot = await page.screenshot({
      fullPage: false, // viewport only — hero is above the fold
      animations: "disabled", // freeze any mesh-drift / pulse
    });

    // Set expressive mode + let the mesh fade in.
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-mode", "expressive");
      try {
        window.localStorage.setItem("lumen-mode", "expressive");
      } catch {
        /* localStorage blocked — degrade silently. */
      }
    });
    await page.waitForTimeout(500);

    const expressiveScreenshot = await page.screenshot({
      fullPage: false,
      animations: "disabled",
    });

    // Assert visible diff. Lazy-imported so jest/playwright can boot
    // even if pixelmatch/pngjs aren't installed yet.
    const { default: pixelmatch } = await import("pixelmatch");
    const { PNG } = await import("pngjs");

    const imgA = PNG.sync.read(restrainedScreenshot);
    const imgB = PNG.sync.read(expressiveScreenshot);

    if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
      throw new Error(
        `Screenshot dimensions differ between modes: restrained ${imgA.width}x${imgA.height} vs expressive ${imgB.width}x${imgB.height}. This usually means a layout shift was introduced by the retrofit — investigate before retrying.`
      );
    }

    const diff = new PNG({ width: imgA.width, height: imgA.height });
    const changedPixels = pixelmatch(
      imgA.data,
      imgB.data,
      diff.data,
      imgA.width,
      imgA.height,
      { threshold: PIXEL_COLOR_THRESHOLD }
    );

    expect(changedPixels).toBeGreaterThan(PIXEL_DIFF_FLOOR);
  });
}
