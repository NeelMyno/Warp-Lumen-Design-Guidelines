/**
 * v0.13.4 Phase 10 — Playwright config for the mode-toggle visual-diff test.
 *
 * Single test suite (`tests/mode-toggle-visual.spec.ts`). Chromium-only
 * (matches the audit-dashboard's runtime target — Chromium 130+ for
 * @property-driven mesh-drift animation interpolation per Phase 1 report).
 *
 * Operator runs `pnpm test:mode-toggle` after `pnpm install` + `pnpm exec
 * playwright install chromium`. Dev server bootstrap is via the `webServer`
 * config below — Playwright spins up `pnpm dev` automatically if no server
 * is already running on http://localhost:3000.
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // mode-toggle test runs sequentially per route to avoid localStorage cross-talk
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.LUMEN_TEST_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: process.env.LUMEN_TEST_BASE_URL ?? "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
