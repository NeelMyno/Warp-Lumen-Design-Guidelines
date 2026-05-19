import { test, expect } from "@playwright/test";

/**
 * a11y smoke — every audit-dashboard route is tab-navigable and has at least
 * one focusable element.
 *
 * v0.14 — first ship of automated a11y coverage. The full axe-core scan is
 * gated behind installing @axe-core/playwright; this baseline check uses
 * Playwright's native accessibility APIs and runs without extra deps.
 *
 * Future rounds: install @axe-core/playwright and assert zero WCAG 2.2 AA
 * violations per route. The wiring is sketched below in the .skip block.
 */

const routes = ["/foundations", "/library", "/saas", "/landing", "/tool", "/commerce", "/mobile", "/desktop"];

for (const route of routes) {
  test(`a11y baseline ${route} — has focusable elements + accessibility tree`, async ({ page }) => {
    await page.goto(route);

    // At least one focusable interactive element exists
    const focusables = await page
      .locator('button, [role="button"], a[href], input, [tabindex]:not([tabindex="-1"])')
      .count();
    expect(focusables).toBeGreaterThan(0);

    // Tab navigation reaches at least one element
    await page.keyboard.press("Tab");
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeDefined();
    expect(focusedTag).not.toBe("BODY");

    // Page declares lang attribute (WCAG 3.1.1)
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBeTruthy();

    // The page has at least one heading (basic structure check)
    const headingCount = await page.locator("h1, h2, h3, h4, h5, h6").count();
    expect(headingCount).toBeGreaterThan(0);
  });
}

// To enable: pnpm add -D @axe-core/playwright, then remove .skip
test.skip("axe-core scan — zero violations on /foundations (gated on @axe-core/playwright install)", async ({ page }) => {
  // import AxeBuilder from "@axe-core/playwright";
  // await page.goto("/foundations");
  // const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  // expect(results.violations).toEqual([]);
});
