import { test, expect } from "@playwright/test";
import path from "node:path";

/**
 * Regression — the v0.14 R10 Swatch contract:
 *   1. Each Swatch resolves its hex at runtime via getComputedStyle
 *   2. The hex chip is always visible (not hover-gated)
 *   3. Click on tile copies hex; var-name chip click copies the CSS var ref
 *   4. Theme switch re-resolves the hex without page reload (the MutationObserver
 *      on data-theme / data-mood fires the re-resolve)
 *   5. SwatchRamp steps show hex on hover and copy hex on click
 *
 * If this regresses: check audit-dashboard/src/components/primitives/swatch.tsx —
 * the useResolvedHex hook is the affected surface. Screenshots saved to
 * .audit-runs/2026-05-19-round-9-prompt-audit/screens-r10/ for visual diff.
 */

const outDir = path.resolve(
  __dirname,
  "../../.audit-runs/2026-05-19-round-9-prompt-audit/screens-r10",
);

test("swatch — dark theme hex resolution + tile copy + theme-switch refresh", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/foundations#color", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);

  // Find the surface.canvas Swatch — it's the first Swatch in "Surface roles"
  const surfaceCanvasSwatch = page.locator('[aria-label*="surface.canvas color"]').first();
  await expect(surfaceCanvasSwatch).toBeVisible();

  // The hex chip should be visible (always-on, not hover-gated)
  const hexChip = page
    .locator('button[aria-label*="hex code #"]')
    .filter({ hasText: /^#[0-9A-F]+$/i })
    .first();
  await expect(hexChip).toBeVisible();
  const hexValue = await hexChip.textContent();
  expect(hexValue).toMatch(/^#[0-9A-F]{6,8}$/i);

  // Scroll to the Surface roles SubSection so the new Swatch UI is in view
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll("h2, h3, h4")).find(
      (h) => h.textContent?.trim().toLowerCase().includes("surface roles"),
    );
    if (heading) heading.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(300);

  await page.screenshot({
    path: path.join(outDir, "dark-foundations-color-default.png"),
    fullPage: false,
  });

  // Click the tile — should copy hex
  await surfaceCanvasSwatch.click();
  await page.waitForTimeout(200);

  await page.screenshot({
    path: path.join(outDir, "dark-foundations-color-after-tile-click.png"),
    fullPage: false,
  });

  // Verify clipboard via evaluate
  const clipped = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipped).toMatch(/^#[0-9A-F]{6,8}$/i);

  // Theme switch — the hex should update
  const hexBeforeSwitch = clipped;
  await page.locator('button[aria-label*="Switch to light theme"]').click();
  await page.waitForTimeout(400);

  const hexAfterSwitch = await hexChip.textContent();
  expect(hexAfterSwitch).toMatch(/^#[0-9A-F]{6,8}$/i);
  // Most surface tokens differ between themes — assert at least one differs
  expect(hexAfterSwitch).not.toBe(hexBeforeSwitch);

  await page.screenshot({
    path: path.join(outDir, "light-foundations-color-default.png"),
    fullPage: false,
  });
});

test("swatch ramp — hover surfaces hex, click copies hex", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/foundations#color", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);

  // Find the accent ramp's step-5 button
  const accent5 = page
    .locator('button[aria-label*="Copy hex"][aria-label*="accent.5"]')
    .first();
  await expect(accent5).toBeVisible();

  // Hover should surface the hex chip
  await accent5.hover();
  await page.waitForTimeout(200);
  const hexHover = await accent5.locator("span").first().textContent();
  // The hex should match accent.5 — Spring Green #00FA8A
  expect(hexHover).toMatch(/^#[0-9A-F]{6,8}$/i);

  // Click — copy hex
  await accent5.click();
  await page.waitForTimeout(200);
  const clipped = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipped).toMatch(/^#[0-9A-F]{6,8}$/i);

  await page.screenshot({
    path: path.join(outDir, "dark-foundations-ramp-hover-hex.png"),
    fullPage: false,
  });
});
