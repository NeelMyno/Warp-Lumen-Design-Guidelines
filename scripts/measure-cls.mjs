#!/usr/bin/env node
// Measure Cumulative Layout Shift (CLS) on the deployed Lumen audit dashboard.
//
// USAGE
//   pnpm cls                               # uses default URL or LUMEN_LIGHTHOUSE_URL env
//   pnpm cls https://example.com           # one-off URL override
//   LUMEN_LIGHTHOUSE_URL=... pnpm cls
//
// CONTEXT
//   The audit dashboard is hosted on Vercel only. `pnpm dev` is FORBIDDEN in this
//   repo (Turbopack + many open files OOMs the macOS kernel watchdog), so this
//   script targets the deployed URL exclusively. Run it locally against the
//   live deployment to verify the v0.5 CLS budget (≤ 0.05 with the
//   Satoshi-Fallback metric override).
//
// REQUIREMENTS
//   - lighthouse@^12  (devDependency)
//   - chrome-launcher@^1  (devDependency)
//   - A local Chrome / Chromium install discoverable by chrome-launcher.
//
// EXIT CODES
//   0  both runs ≤ 0.05 CLS
//   1  either run > 0.05, or Chrome / network unavailable
//
// The script runs Lighthouse twice cold (no cache reuse) and prints a small
// summary table: URL · Run 1 · Run 2 · Avg.

const DEFAULT_URL = "https://lumen-design-guidelines.vercel.app/";
const CLS_BUDGET = 0.05;

const targetUrl = process.argv[2] || process.env.LUMEN_LIGHTHOUSE_URL || DEFAULT_URL;

let lighthouse;
let chromeLauncher;
try {
  // Dynamic import so a missing devDependency produces a friendly message
  // rather than a noisy ESM stack trace.
  ({ default: lighthouse } = await import("lighthouse"));
  chromeLauncher = await import("chrome-launcher");
} catch (err) {
  console.error("Could not load lighthouse / chrome-launcher.");
  console.error("Install them with: pnpm add -D lighthouse@^12 chrome-launcher@^1");
  console.error(`Underlying error: ${err.message}`);
  process.exit(1);
}

async function runLighthouseOnce(url) {
  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
    });
  } catch (err) {
    console.error("Could not launch Chrome.");
    console.error("Make sure Google Chrome (or Chromium) is installed locally.");
    console.error(`Underlying error: ${err.message}`);
    process.exit(1);
  }

  try {
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance"],
        // Ensure cold load — disable storage reuse between runs.
        disableStorageReset: false,
      },
    );
    const audit = result?.lhr?.audits?.["cumulative-layout-shift"];
    if (!audit || typeof audit.numericValue !== "number") {
      throw new Error("cumulative-layout-shift audit missing or invalid");
    }
    return audit.numericValue;
  } finally {
    await chrome.kill();
  }
}

function fmt(n) {
  return Number.isFinite(n) ? n.toFixed(4) : "—";
}

console.log(`Measuring CLS on ${targetUrl}`);
console.log(`Budget: ≤ ${CLS_BUDGET} (v0.5 Satoshi-Fallback metric override)`);
console.log("");

let run1, run2;
try {
  run1 = await runLighthouseOnce(targetUrl);
  console.log(`Run 1: ${fmt(run1)}`);
  run2 = await runLighthouseOnce(targetUrl);
  console.log(`Run 2: ${fmt(run2)}`);
} catch (err) {
  console.error(`Lighthouse run failed: ${err.message}`);
  process.exit(1);
}

const avg = (run1 + run2) / 2;
const passed = run1 <= CLS_BUDGET && run2 <= CLS_BUDGET;

console.log("");
console.log("URL                                              | Run 1  | Run 2  | Avg   ");
console.log("-------------------------------------------------+--------+--------+-------");
console.log(
  `${targetUrl.padEnd(49)}| ${fmt(run1).padStart(6)} | ${fmt(run2).padStart(6)} | ${fmt(avg).padStart(5)}`,
);
console.log("");
console.log(passed ? "PASS — both runs within budget." : `FAIL — at least one run exceeded ${CLS_BUDGET}.`);
process.exit(passed ? 0 : 1);
