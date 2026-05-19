import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the audit-dashboard.
 *
 * v0.14 — first ship of the testing infrastructure round. Targets:
 *   - Smoke test: every route loads and renders the expected heading
 *   - a11y smoke: axe-core/playwright scan on every route (when @axe-core/
 *     playwright is added; for v0.14 the wiring is in tests/a11y.spec.ts
 *     and stays skipped until the dep is installed)
 *   - Visual regression: opt-in only — use Playwright's built-in screenshot
 *     diff via `expect(page).toHaveScreenshot()`. Lives in tests/visual.spec.ts
 *
 * Smoke tests run against the production server (pnpm start) — start it in
 * another shell before running, or set PLAYWRIGHT_BASE_URL.
 *
 * Run with: pnpm exec playwright test
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  workers: process.env.CI ? 1 : 3,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
