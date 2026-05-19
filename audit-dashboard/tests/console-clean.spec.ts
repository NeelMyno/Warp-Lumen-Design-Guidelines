import { test, expect } from "@playwright/test";

/**
 * Regression check — no console errors, no page errors across all 8 routes,
 * exercised through the theme toggle + ⌘K command palette open/close.
 *
 * v0.14 R9 — added to close the gap where Playwright smoke + a11y passed but
 * runtime JS errors could still ship undetected. The theme-toggle exercise
 * catches hydration races against the `data-theme` attribute on <html>; the
 * ⌘K open + Escape catches Dialog-portal lifecycle errors.
 *
 * If this regresses, the failed assertion includes every error captured —
 * grep "pageerror" or "console:" in the test output to triage.
 */

const routes = [
  "/foundations",
  "/library",
  "/saas",
  "/landing",
  "/tool",
  "/commerce",
  "/mobile",
  "/desktop",
];

for (const route of routes) {
  test(`console clean ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
    });

    await page.goto(route, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    // Toggle theme via click to exercise the data-theme attribute path
    const themeToggle = page.locator('button[aria-label*="Switch to"]').first();
    if ((await themeToggle.count()) > 0) await themeToggle.click();
    await page.waitForTimeout(150);
    if ((await themeToggle.count()) > 0) await themeToggle.click();
    await page.waitForTimeout(150);

    // Open + close the command palette to exercise Radix Dialog portal
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(150);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);

    expect(errors, errors.join("\n")).toEqual([]);
  });
}
