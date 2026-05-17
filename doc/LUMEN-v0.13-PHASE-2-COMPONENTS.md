# PHASE 2 — Component Library → shadcn Registry

Execute master doc §7.Phase-2. Master doc is canonical; this prompt adds execution-level detail.

## What this phase ships

The ~250-component v0.12.4 library converted into a shadcn registry under `@lumen/*`, with per-component MD + SKILL.md + TSX + registry JSON + Storybook story + tests + Component Manifest. Plus a single `registry:base` payload that lets a consumer install the entire design system in one command. After this phase, any vibe-coder running `npx shadcn add @lumen/<name>` in a fresh Next.js app gets an on-brand component installed against Lumen tokens.

## Read first

Fetch all seven Vercel surface pages: `/library`, `/saas`, `/landing`, `/tool`, `/commerce`, `/mobile`, `/desktop`. Inventory every component you see by visual inspection. Build `tools/inventory.csv` with columns `name, surface, observed_at_path, proposed_registry_name, priority, notes`. Target ~250 rows. This inventory drives the tier order below.

## Technical pins

| Tool | Version | Why |
|---|---|---|
| shadcn CLI | `^4.0.0` (March 2026 release) | `registry:base` for single-payload distribution, `registry:font` first-class type, `--dry-run` / `--diff` / `--view` flags, namespaced registries, MCP-out-of-the-box |
| Storybook | `^10.3.0` (April 8 2026 release) | Component Manifests for MCP, AI agent integration, ESM-only, 29% lighter |
| `@storybook/addon-a11y` | Latest 10.3-compatible | axe-core runs in stories |
| Radix UI primitives | Latest stable | Foundation for accessible behaviors |
| `tw-animate-css` | Latest | shadcn standard animation deps |

Install with `pnpm add -D shadcn@latest storybook@latest @storybook/addon-a11y@latest`. Pin major versions in `package.json`.

## Component tiers (parallelize within each tier; tier order is sequential)

Tier 1 → Tier 2 → Tier 3 → Tier 4. Within a tier, all components are independent and you generate them in parallel.

### Tier 1 — Primitives (foundational, depended on by everything else)

19 components. Build these first because every Tier 2+ component depends on at least one:

`button`, `input`, `textarea`, `card`, `sheet`, `popover`, `tooltip`, `toast`, `badge`, `tag`, `avatar`, `skeleton`, `spinner`, `tabs`, `breadcrumb`, `switch`, `checkbox`, `radio`, `slider`, `progress`

### Tier 2 — Composed (depend on Tier 1)

15 components:

`data-table` (virtualized via TanStack Virtual; consumer brings the data, Lumen brings the visual contract), `command-palette`, `drawer`, `modal`, `dropdown-menu`, `combobox`, `calendar`, `date-picker`, `filter-builder` (query-DSL editor), `filter-chip`, `saved-view`, `sidebar` (multi-level nav), `top-bar`, `pagination`, `select`

### Tier 3 — Lumen signatures (preserve v0.12.4 behavior exactly)

3 components. These are the brand-defining primitives; the visual is locked, only the registry/SKILL/manifest wrappings are new:

`stat` (big bold number, mono unit, optional delta + sparkline), `live-dot` (3s pulse loop, six health states), `rate-ticker` (linear marquee, pausable on hover)

### Tier 4 — Freight-domain composites (new or formalized)

10 components. These are domain-specific composites that didn't exist as named primitives in v0.12.4 but are reused enough across Warp's 66 products to deserve registry items:

- `lane-code` — Renders a lane like `LAX→SFO` with proper arrow glyph, mono numerics, optional inline rate.
- `lane-arc` — SVG arc renderer over a faint base map, animated draw-in on mount, accent-tinted.
- `shipment-timeline` — Vertical timeline with pickup → cross-dock → line haul → last mile nodes, status colors, ETA bubbles.
- `route-map` — Bounded map embed with lane overlays, pickup/dropoff markers, optional truck position pin.
- `dock-bay` — Grid of dock bay cards with availability state (open, occupied, reserved).
- `cross-dock-grid` — Top-down floor layout with pallet cells, color-coded by destination lane.
- `carrier-badge` — Carrier identity chip with logo slot, rating, vehicle type, on-time percentage.
- `pallet-tile` — Individual pallet card with weight, dims, hazmat flag, lane assignment, freight class.
- `otr-truck-iso` — Reusable isometric truck illustration component (consumes a generated SVG from the Phase 4 prompt library).
- `quote-builder` — Composite for the quote flow: lane input, weight input, accessorials, rate output, book button.

## Per-component file shape

For every component in every tier, generate this exact set of files. Parallelize file generation within each component.

```
02-components/<name>/
├── <name>.md              # Human-readable + LLM frontmatter
├── <name>.skill.md        # Vercel format SKILL.md, verbatim NEVER rules
├── <name>.tsx             # Canonical React implementation
├── <name>.test.tsx        # Vitest + Testing Library
├── <name>.stories.tsx     # Storybook 10.3 CSF Factory format
├── <name>.registry.json   # shadcn registry-item.json
└── manifest.json          # Storybook 10.3 Component Manifest entry
```

`<name>.md` uses the frontmatter shape in master doc §8.4 exactly. `<name>.skill.md` uses the format in master doc §8.3 exactly. `<name>.registry.json` follows master doc §8.6.

The `<name>.tsx` consumes tokens via CSS variables only — `var(--surface-raised)`, `var(--border-default)`, `var(--text-primary)`, etc. **Zero hex literals in component source.** The audit-tokens gate in §10.2 of the master doc catches violations.

The Storybook story uses CSF 4 factory format (Storybook 10.3 typesafe factories). Generate at minimum: default story, every variant, every state (rest, hover, focus, active, disabled, loading where applicable), restrained-mode wrapper, expressive-mode wrapper.

The `manifest.json` per component contributes to the root Storybook Component Manifest. Include: component name, description, props with types, variants, design tokens consumed, usage example snippet, accessibility notes.

## The `registry:base` payload

After all components ship, build the single-install entry point. Create `registry/lumen-base/lumen-base.json` as a `registry:base` item:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "lumen-base",
  "type": "registry:base",
  "title": "Lumen Design System (full)",
  "description": "Warp's complete design system: tokens, fonts, primitives, AI elements, freight-domain composites. Installs everything as a single payload.",
  "dependencies": ["lucide-react", "tw-animate-css", "@radix-ui/react-slot"],
  "registryDependencies": [
    "@lumen/font-satoshi",
    "@lumen/tokens",
    "@lumen/mode-scope"
  ],
  "cssVars": {
    "theme": {
      "font-sans": "'Satoshi Variable', system-ui, sans-serif"
    },
    "dark": {
      "color-canvas": "oklch(0.075 0 0)",
      "color-raised": "oklch(0.105 0 0)",
      "color-accent": "oklch(0.875 0.225 152)"
    }
  },
  "files": [
    /* token CSS, tailwind preset */
  ],
  "config": {
    /* shadcn init-style config for new projects */
  }
}
```

This is the killer feature for vibe-coders: `npx shadcn add @lumen/lumen-base` and they get the whole system — tokens, fonts, primitives, the works — in one command.

## The Satoshi font as `registry:font`

Create `registry/font-satoshi/font-satoshi.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "font-satoshi",
  "type": "registry:font",
  "font": {
    "family": "'Satoshi Variable', system-ui, sans-serif",
    "provider": "self-hosted",
    "variable": "--font-sans",
    "subsets": ["latin"],
    "files": [
      { "path": "fonts/Satoshi-Variable.woff2", "weight": "300 900", "style": "normal" },
      { "path": "fonts/Satoshi-Variable-Italic.woff2", "weight": "300 900", "style": "italic" }
    ]
  }
}
```

This is the first-class shadcn 4 font registry pattern. Consumers install it via `npx shadcn add @lumen/font-satoshi` and the font is wired into `:root` automatically.

## Root `registry.json` (populate with everything)

After Tier 1–4 ship plus the base and font items, regenerate `registry.json` at repo root. Final shape:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "@lumen",
  "homepage": "https://warp-lumen-design-guidelines.vercel.app",
  "items": [
    { "name": "lumen-base", "type": "registry:base", /* … */ },
    { "name": "font-satoshi", "type": "registry:font", /* … */ },
    { "name": "tokens", "type": "registry:style", /* … */ },
    { "name": "mode-scope", "type": "registry:component", /* … */ },
    { "name": "button", "type": "registry:component", /* … */ }
    /* …~250 entries… */
  ]
}
```

Build the registry payload with `pnpm dlx shadcn@latest build` (CLI 4 command). Output goes to `public/r/` per shadcn convention. Verify each item resolves as a valid JSON file at `public/r/<name>.json`.

Update `llms.txt` root file. Replace the empty `## Components` section with the full generated component list, one bullet per item, link to its MD file. Use `tools/build-llms-txt.ts` to generate this automatically from `registry.json`.

## Storybook 10.3 Component Manifest

Configure Storybook for the manifest endpoint. In `.storybook/main.ts`:

```ts
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  framework: "@storybook/nextjs",
  stories: ["../02-components/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  // Storybook 10.3 generates /manifests/components.json automatically
  // from CSF + MDX. No extra config required.
};

export default config;
```

The shadcn MCP server reads the registry endpoint directly per the shadcn documentation. The Storybook MCP can run alongside if a richer manifest is needed — install with `pnpm dlx storybook@latest add @storybook/addon-mcp` if the addon exists in your Storybook version, otherwise the registry MCP is sufficient.

## Decisions you will likely make unilaterally

- Whether to use Radix UI or Base UI for accessible primitive behaviors. Default: **Radix UI**, since v0.12.4's existing implementation likely already uses it. If the existing repo uses Base UI, match what's there.
- How to handle the existing `lumen-kbd`, `lumen-mono` utility CSS classes referenced in the foundations page. Default: ship them as separate `registry:lib` items (`@lumen/lumen-kbd`, `@lumen/lumen-mono`) so consumers can install just the utility CSS without pulling the whole base.
- Which components in your inventory CSV are duplicates of the canonical 47 named above and should be folded. Default: aggressive deduplication — if you see two visual variants of "button" across `/saas` and `/landing`, fold to one component with a `variant` prop unless they're meaningfully different.
- Where to host the registry endpoint. Default: serve from the existing Vercel deployment at `https://warp-lumen-design-guidelines.vercel.app/r/{name}.json`. Wire `components.json` `registries["@lumen"]` to that URL.
- Whether to include voice/audio components (AudioPlayer, MicSelector) from Vercel AI Elements in Phase 2 or push to Phase 5. Default: push to Phase 5 since those are AI-specific.

## Verification gates for Phase 2

| Gate | Pass condition |
|---|---|
| Registry build | `pnpm dlx shadcn@latest build` exits 0; `public/r/registry.json` validates against shadcn registry schema |
| Single-command install | `npx shadcn@latest add @lumen/lumen-base` against a fresh Next.js 15 app installs successfully and the example app renders with Lumen tokens |
| Per-component install | `npx shadcn@latest add @lumen/button` against a fresh Next.js 15 app installs Button correctly and it renders against tokens |
| No hex literals | `tools/audit-tokens.ts` reports 0 hex literals across `02-components/` |
| No mode props | `tools/audit-mode.ts` reports 0 `data-mode` references in component source (mode is scoped, not propped) |
| Storybook builds | `pnpm storybook build` exits 0; the Component Manifest at `storybook-static/manifests/components.json` is non-empty |
| MCP discovery | `npx shadcn@latest search @lumen` returns the full component list |
| Token-driven | Every component MD frontmatter lists at least one token under `tokens:` field |
| SKILL.md present | Every component has a `.skill.md` file with at least three NEVER rules |
| MD length | Every component MD under 4K tokens unless complex (DataTable, CommandPalette may exceed) |
| Visual regression | Playwright visual regression CI green across all components in both modes |
| Component count | At least 47 components shipped (tier 1: 19 + tier 2: 15 + tier 3: 3 + tier 4: 10). More acceptable; this is the floor. |
| Self-critique | All 15 questions in master doc §10.1 answered "no" |

## Stop condition

Phase report into `design-system/06-claude-code-briefings/phase-2-report.md` per master doc §10.3. Commit message: `feat(lumen): phase 2 — component library as shadcn registry`. **Halt**. Wait for Phase 3.
