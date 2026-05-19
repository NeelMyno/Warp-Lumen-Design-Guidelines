/**
 * @warp/lumen-tokens — TypeScript-typed access to Lumen design tokens.
 *
 * Re-exports the Style-Dictionary-generated `_build/ts/tokens.ts` artifact.
 * Consumer apps:
 *
 *   import { tokens } from "@warp/lumen-tokens";
 *   const accent = tokens.color.accent[500];  // "#00FA8A"
 *
 * For raw CSS variables (the same source-of-truth as the audit-dashboard
 * uses) import from `@warp/lumen-tokens/css`:
 *
 *   import "@warp/lumen-tokens/css";  // injects <link> to _build/css/tokens.css
 *
 * For flat token map (key-value pairs, useful for token-bridge libraries):
 *
 *   import { flatTokens } from "@warp/lumen-tokens/flat";
 *
 * v0.14 — first ship as a proper npm-installable package. Closes the
 * USING-LUMEN.md hard rule 4 "@warp/lumen-tokens" reference. Pre-v0.14
 * consumers had to either copy from _build/ts/tokens.ts manually or use
 * the shadcn registry. v0.14.0 establishes the npm distribution path.
 */
export * from "../../../_build/ts/tokens";
export { default as tokens } from "../../../_build/ts/tokens";
