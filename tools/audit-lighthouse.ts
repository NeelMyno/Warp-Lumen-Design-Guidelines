/**
 * tools/audit-lighthouse.ts — Lumen v0.13 Phase 1 performance audit.
 *
 * Runs Lighthouse against the landing-hero example in audit-dashboard and asserts
 * the Phase 1 verification gates from master doc §7 Phase 1:
 *   - Performance ≥ 90 (emulated Pixel 6a / Slow 4G)
 *   - CLS < 0.1
 *   - LCP < 2.5s
 *
 * Usage:
 *   1. Build the audit-dashboard: cd audit-dashboard && pnpm build
 *   2. Start the production server: cd audit-dashboard && pnpm start &
 *   3. Run: pnpm audit:lighthouse
 *   4. Stop the server.
 *
 * Pre-req: `lighthouse` and `chrome-launcher` installed at repo root. If they
 * are declared in package.json devDeps but missing from node_modules, the
 * lockfile may have drifted — run `pnpm install --no-frozen-lockfile` once.
 *
 * Why this isn't run in CI as part of Phase 1 commit: lighthouse needs a real
 * Chrome binary + a running server. Local-dev environments and CI both can
 * run it; the Phase 1 *commit* gate just requires the script + audit-contrast
 * + build to succeed.
 */

const URL = process.env.LUMEN_LIGHTHOUSE_URL ?? "http://localhost:3000/examples/landing-hero";

// Master-doc Phase 1 thresholds.
const THRESHOLDS = {
  performance: 0.90,   // Lighthouse score 0-1 (≥0.9 means ≥90)
  cls:         0.10,   // max acceptable Cumulative Layout Shift
  lcp:         2500,   // max acceptable Largest Contentful Paint (ms)
} as const;

type LighthouseModule = typeof import("lighthouse");
type ChromeLauncherModule = typeof import("chrome-launcher");

async function main() {
  let lighthouse: LighthouseModule;
  let chromeLauncher: ChromeLauncherModule;
  try {
    lighthouse = await import("lighthouse");
    chromeLauncher = await import("chrome-launcher");
  } catch {
    console.error(
      `\n✗ lighthouse and/or chrome-launcher are not installed.\n` +
      `  They are declared in package.json devDependencies but may be missing\n` +
      `  from node_modules. Run \`pnpm install --no-frozen-lockfile\` once to fix.\n\n` +
      `  Alternative: \`npx --yes lighthouse ${URL} --preset=mobile --output=json\``
    );
    process.exit(2);
  }

  console.log(`Lumen v0.13 Phase 1 — Lighthouse audit against ${URL}`);

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });

  try {
    const result = await lighthouse.default(URL, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance"],
      // Emulate Pixel 6a / Slow 4G per master doc Phase 1 spec.
      formFactor: "mobile",
      throttlingMethod: "simulate",
      screenEmulation: {
        mobile: true,
        width: 412,
        height: 915,
        deviceScaleFactor: 2.625,
        disabled: false,
      },
    });
    if (!result?.lhr) {
      throw new Error("Lighthouse returned no LHR.");
    }
    const { categories, audits } = result.lhr;
    const perf = categories.performance.score ?? 0;
    const cls = (audits["cumulative-layout-shift"]?.numericValue as number) ?? Infinity;
    const lcp = (audits["largest-contentful-paint"]?.numericValue as number) ?? Infinity;

    console.log(
      `\nPerformance: ${(perf * 100).toFixed(0)} / 100 (gate: ≥ ${THRESHOLDS.performance * 100})\n` +
      `CLS:         ${cls.toFixed(3)} (gate: < ${THRESHOLDS.cls})\n` +
      `LCP:         ${lcp.toFixed(0)} ms (gate: < ${THRESHOLDS.lcp} ms)`
    );

    const fails: string[] = [];
    if (perf < THRESHOLDS.performance) fails.push(`Performance ${(perf * 100).toFixed(0)} < ${THRESHOLDS.performance * 100}`);
    if (cls >= THRESHOLDS.cls)         fails.push(`CLS ${cls.toFixed(3)} >= ${THRESHOLDS.cls}`);
    if (lcp >= THRESHOLDS.lcp)         fails.push(`LCP ${lcp.toFixed(0)}ms >= ${THRESHOLDS.lcp}ms`);

    if (fails.length > 0) {
      console.error(`\n✗ Phase 1 Lighthouse gates FAILED:\n${fails.map((f) => `  - ${f}`).join("\n")}`);
      process.exit(1);
    }
    console.log("\n✓ Phase 1 Lighthouse gates pass.");
  } finally {
    await chrome.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
