# @warp/lumen-tokens

> TypeScript-typed access to Lumen design tokens. The npm-installable package that USING-LUMEN.md hard rule 4 referenced. Tokens are sourced from `design-system/01-tokens/` and built via Style Dictionary into `_build/{ts,css,json}/` at the repo root; this package re-exports those artifacts.

## Install

```bash
pnpm add @warp/lumen-tokens
# or
npm install @warp/lumen-tokens
```

## Use — TypeScript constants

```ts
import { tokens } from "@warp/lumen-tokens";

const accent = tokens.color.accent[500];  // "#00FA8A"
const surface = tokens.color.surface.canvas;
const radius = tokens.radius.control.md;
```

Type-safe — your editor will autocomplete every token path.

## Use — flat token map

```ts
import { flatTokens } from "@warp/lumen-tokens/flat";

const accent = flatTokens["color-accent-500"];  // "#00FA8A"

// Or iterate:
for (const [key, value] of Object.entries(flatTokens)) {
  console.log(key, value);
}
```

Useful for token-bridge libraries (Tailwind plugins, Stitches themes), CSS-in-JS, or runtime token-lookup.

## Use — CSS variables

```css
/* In your global stylesheet: */
@import "@warp/lumen-tokens/css.css";

/* Then reference: */
.btn { background: var(--color-accent-500); }
```

The audit-dashboard at `audit-dashboard/src/app/globals.css` is the canonical consumer; this package re-exports the same CSS file.

## v0.14.0 ship scope

- ✓ Package scaffolding (`package.json`, `README.md`, `src/{index,flat,css}.ts`)
- ✓ Re-exports the existing Style Dictionary outputs from `_build/{ts,json,css}/`
- ✓ TypeScript types via `_build/ts/tokens.ts` (the SD-typed module)
- ⚠ Publish workflow is documented but NOT executed in v0.14.0 — `npm publish` requires registry credentials the audit-dashboard build doesn't have. The scaffold is ready for consumer apps to install via local file: spec or via a future Warp internal npm registry.

## Publish workflow (when ready)

```bash
# 1. Build all token artifacts at repo root
pnpm build

# 2. From the repo root, bump the package version in lockstep with Lumen VERSION
node scripts/release.mjs patch  # or minor / major

# 3. Publish (requires npm registry credentials)
cd packages/lumen-tokens
npm publish --access restricted
```

The repo-level `scripts/release.mjs` does NOT currently bump `packages/lumen-tokens/package.json` — that bump is a R12+ candidate. For v0.14.0 the package version is manually pinned to `0.14.0` matching the Lumen system version.

## Versioning contract

Lumen's `VERSION` file is the source-of-truth. The `@warp/lumen-tokens` package version mirrors it 1:1: when Lumen ships v0.14.0, this package ships v0.14.0. ADR 0009 (semver system-wide) is the rule.

## Cross-references

- Lumen [`USING-LUMEN.md`](../../USING-LUMEN.md) — overall consumption guide
- Lumen [`design-system/01-tokens/`](../../design-system/01-tokens/) — source tokens
- Style Dictionary config: [`style-dictionary.config.ts`](../../style-dictionary.config.ts)
- Built artifacts: `_build/ts/tokens.ts`, `_build/json/tokens.flat.json`, `_build/css/tokens.css`
