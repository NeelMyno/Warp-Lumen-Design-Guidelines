#!/usr/bin/env node
// Validates that documented Lumen token pairs meet WCAG AA contrast.
// Add new pairs to PAIRS below as they're declared in semantic tokens.

import { hex } from "wcag-contrast";

// Lumen documented token pairs. Source: design-system/00-foundations/accessibility.md
const PAIRS = [
  // Light mode
  { fg: "#0e1219", bg: "#fafaf7", role: "text.primary on surface.page (light)",  min: 4.5 },
  { fg: "#4a5260", bg: "#fafaf7", role: "text.secondary on surface.page (light)",min: 4.5 },
  { fg: "#7a8190", bg: "#fafaf7", role: "text.tertiary on surface.page (light, ≥18px only)", min: 3.0 },
  { fg: "#0e1219", bg: "#ffffff", role: "text.primary on surface.raised (light)",min: 4.5 },
  { fg: "#071109", bg: "#4ade80", role: "accent.fg on accent.500 (CTA)",         min: 4.5 },
  { fg: "#166534", bg: "#ecfdf3", role: "status.success.fg on .bg (light)",      min: 4.5 },
  { fg: "#6b4a08", bg: "#fef6e1", role: "status.warning.fg on .bg (light)",      min: 4.5 },
  { fg: "#7a1f1c", bg: "#fde9e7", role: "status.danger.fg on .bg (light)",       min: 4.5 },
  { fg: "#1f3f80", bg: "#eaf3ff", role: "status.info.fg on .bg (light)",         min: 4.5 },
  // Dark mode
  { fg: "#f0f2f5", bg: "#131c2a", role: "text.primary on surface.page (dark)",   min: 4.5 },
  { fg: "#b0b8c4", bg: "#131c2a", role: "text.secondary on surface.page (dark)", min: 4.5 },
  { fg: "#7a8494", bg: "#131c2a", role: "text.tertiary on surface.page (dark, ≥18px only)", min: 3.0 },
  { fg: "#86efac", bg: "#11281c", role: "status.success.fg on .bg (dark)",       min: 4.5 },
];

let failures = 0;
for (const { fg, bg, role, min } of PAIRS) {
  const ratio = hex(fg, bg);
  const ok = ratio >= min;
  const marker = ok ? "✓" : "✗";
  console.log(`${marker} ${ratio.toFixed(2)}:1 (≥ ${min}) — ${role}`);
  if (!ok) failures++;
}

if (failures > 0) {
  console.error(`\n${failures} contrast pair(s) below threshold.`);
  process.exit(1);
}

console.log("\nAll documented contrast pairs pass.");
