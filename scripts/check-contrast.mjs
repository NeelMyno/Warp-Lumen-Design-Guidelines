#!/usr/bin/env node
// Validates that documented Lumen token pairs meet WCAG AA contrast.
// Add new pairs to PAIRS below as they're declared in semantic tokens.

import { hex } from "wcag-contrast";

// Lumen documented token pairs. Source: design-system/00-foundations/accessibility.md
//
// v0.12 — values updated to reflect the current token resolution.
//
// History note: this hardcoded pair list was last touched in v0.4 (navy canvas
// #131c2a, warm cream #fafaf7, lime accent #4ade80). Between v0.4 and v0.11,
// the brand recolored several times — to obsidian-mint at v0.11 (#171A18 canvas,
// spring-green #00FA8A accent) and now to neutral obsidian at v0.12 (#0D0D0D
// canvas). The hardcoded pairs were never re-bound to the new tokens, so the
// "All contrast pairs pass" green check was technically validating obsolete
// colors for nine releases. v0.12 brings the values in line with what the
// design system actually ships.
//
// Per-pair fg/bg are now the resolved values of the documented semantic token
// references. If a future recolor moves these primitives, this list must move
// with them. (Better long-term: derive from the built tokens. Filed as an
// open question in ADR 0020.)
const PAIRS = [
  // Light mode (Lumen v0.12 neutral light + neutral text)
  { fg: "#141414", bg: "#FAFAFA", role: "text.primary on surface.page (light)",  min: 4.5 },
  { fg: "#525252", bg: "#FAFAFA", role: "text.secondary on surface.page (light)",min: 4.5 },
  { fg: "#757575", bg: "#FAFAFA", role: "text.tertiary on surface.page (light, ≥18px only)", min: 3.0 },
  { fg: "#141414", bg: "#FFFFFF", role: "text.primary on surface.raised (light)",min: 4.5 },
  { fg: "#07120D", bg: "#00FA8A", role: "accent.fg on accent.500 (CTA)",         min: 4.5 },
  { fg: "#003820", bg: "#E2FFF1", role: "status.success.fg on .bg (light)",      min: 4.5 },
  { fg: "#7A5408", bg: "#FFF8E5", role: "status.warning.fg on .bg (light)",      min: 4.5 },
  { fg: "#931620", bg: "#FDECEB", role: "status.danger.fg on .bg (light)",       min: 4.5 },
  { fg: "#383838", bg: "#FAFAFA", role: "status.info.fg on .bg (light)",         min: 4.5 },
  // Dark mode (Lumen v0.12 neutral obsidian — was obsidian-mint pre-v0.12)
  { fg: "#E6E6E6", bg: "#0D0D0D", role: "text.primary on surface.page (dark)",   min: 4.5 },
  { fg: "#9A9A9A", bg: "#0D0D0D", role: "text.secondary on surface.page (dark)", min: 4.5 },
  { fg: "#6B6B6B", bg: "#0D0D0D", role: "text.tertiary on surface.page (dark, ≥18px only)", min: 3.0 },
  { fg: "#4DFFA8", bg: "#003820", role: "status.success.fg on .bg (dark)",       min: 4.5 },
  { fg: "#F5DEA3", bg: "#2A1D04", role: "status.warning.fg on .bg (dark)",       min: 4.5 },
  { fg: "#F8A8AA", bg: "#260C0E", role: "status.danger.fg on .bg (dark)",        min: 4.5 },
  // Pill v0.11.15 / v0.12 — neutral status pill on the new dark raised surface
  { fg: "#E6E6E6", bg: "#151515", role: "status.neutral.fg on raised (dark, v0.12)", min: 4.5 },
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
