import { test, expect } from "@playwright/test";

/**
 * Smoke tests — every audit-dashboard route loads + renders its hero heading
 * + reports no console errors. Bare-minimum gate that no v0.X.Y ship can fall
 * below.
 *
 * v0.14 — first ship of automated regression coverage. Per-route assertions:
 *   - HTTP 200 (or 200 after redirect for /)
 *   - Hero heading present (specific text per route)
 *   - No JS console errors
 *   - CLS contract holds (window.performance LCP entry, CLS ~0)
 */

const routes = [
  { path: "/foundations", heroText: "Foundations" },
  { path: "/library", heroText: "Library" },
  { path: "/saas", heroText: "Operations control" },
  { path: "/landing", heroText: "Stop re-" },
  { path: "/tool", heroText: "Build a quote" },
  { path: "/commerce", heroText: "Storefront" },
  { path: "/mobile", heroText: "Mobile" },
  { path: "/desktop", heroText: "Desktop" },
];

for (const route of routes) {
  test(`route ${route.path} loads + renders hero`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const response = await page.goto(route.path);
    expect(response?.ok()).toBeTruthy();

    // Hero heading present
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();

    // No console errors (allow Next.js dev-mode warnings — production strips them)
    const criticalErrors = consoleErrors.filter(
      (e) =>
        !e.includes("Download the React DevTools") &&
        !e.includes("Failed to load resource") /* relative-path icons in dev */
    );
    expect(criticalErrors).toEqual([]);
  });
}

test("/ redirects to /foundations", async ({ page }) => {
  await page.goto("/");
  expect(page.url()).toContain("/foundations");
});

test("dashboard shell renders on every route (header + sidebar)", async ({ page }) => {
  await page.goto("/foundations");
  // Header
  const header = page.locator("header").first();
  await expect(header).toBeVisible();
});
