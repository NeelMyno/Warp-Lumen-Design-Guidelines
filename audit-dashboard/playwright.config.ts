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
 * v0.14 R9 — the config now auto-starts the prod server when one isn't
 * already running, so `pnpm exec playwright test` works against a fresh
 * checkout. Set PLAYWRIGHT_BASE_URL to point tests at a foreign server
 * (e.g. a remote preview deploy); when set, the webServer step is skipped.
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
  /* Auto-start the prod server if none is running locally. Skipped entirely
     when PLAYWRIGHT_BASE_URL is set (foreign-server mode). reuseExistingServer
     is honored outside CI so an already-running `pnpm start` is reused
     instead of being killed and re-spawned. */
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "pnpm build && pnpm start --port 3000",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        stdout: "pipe",
        stderr: "pipe",
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
