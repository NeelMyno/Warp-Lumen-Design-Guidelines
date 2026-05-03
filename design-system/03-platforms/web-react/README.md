# Web · Next.js + React + Tailwind v4

> The default platform. Stack: Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui-style component delivery, Satoshi self-hosted via `next/font/local`.

## Setup

### 1. Create the app
```bash
pnpm dlx create-next-app@latest my-app \
  --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-pnpm
```

### 2. Install Lumen tokens
Copy the built tokens from `lumen-dist`:

```bash
mkdir -p src/styles
curl -L -o src/styles/lumen.css "https://cdn.warp.dev/lumen/v0.1.0/tailwind/theme.css"
```

Or pull as a registry source via shadcn (see "Components" below).

### 3. Wire up `globals.css`
```css
@import "tailwindcss";
@import "./lumen.css";

/* Optional: override Tailwind v4 root tokens with Lumen tokens */
:root, [data-mood="default"] { /* lumen tokens */ }
[data-theme="dark"]          { /* dark mode overrides */ }
```

### 4. Self-host Satoshi
Download from Fontshare (FFL — see `00-foundations/typography` for license details):

```bash
mkdir -p src/fonts
# Drop Satoshi-Variable.woff2 + Satoshi-VariableItalic.woff2 here
```

```ts
// src/app/layout.tsx
import localFont from "next/font/local";
const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-Variable.woff2",       weight: "300 900", style: "normal" },
    { path: "../fonts/Satoshi-VariableItalic.woff2", weight: "300 900", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});
```

### 5. Set the data attributes
On `<html>`:
- `data-mood="obsidian-lime"` (or one of the alternates)
- `data-theme="light"` or `"dark"` (toggle from a client component)

## Components

Lumen distributes via shadcn registry. Install a component:

```bash
pnpm dlx shadcn@latest add https://cdn.warp.dev/lumen/registry/button.json
```

This copies the component code into your repo at `src/components/ui/button.tsx`. You can modify it freely; updates are pulled by re-running the command.

The registry index is at `https://cdn.warp.dev/lumen/registry.json`.

## Folder convention

```
src/
├── app/                    # Routes
├── components/
│   ├── ui/                 # Lumen primitives (shadcn-installed)
│   └── (your app)/         # Your composed components
├── fonts/                  # Self-hosted Satoshi
├── styles/
│   ├── lumen.css           # Built Lumen theme
│   └── globals.css         # Your global CSS, imports lumen.css
└── lib/                    # Your utilities
```

## Performance

- **Font payload budget:** 104 KB total (Satoshi Regular + Medium + Bold + JetBrains Mono Regular). Stay under 150 KB.
- Use `font-display: swap` for body weights; `font-display: optional` for display weights only used above the fold.
- Subset Satoshi to Latin only unless you ship in markets needing Latin Extended.

## Reduced motion

Already handled by `globals.css` via the universal `*` rule that collapses durations to `0.01ms` under `prefers-reduced-motion: reduce`.

## Dark mode

Toggled via `[data-theme]` attribute on `<html>`. A small client component reads `localStorage.getItem('lumen-theme')` and falls back to `prefers-color-scheme`.

## Things to know

- Tailwind v4 uses CSS-only config (`@theme inline { ... }` in your global CSS). No `tailwind.config.ts` needed.
- Lumen tokens map to Tailwind utilities via the `@theme` block (e.g. `bg-page`, `text-fg-muted`, `rounded-lg`).
- Don't use Tailwind's default color palette directly. Use the Lumen-mapped utilities (`bg-page`, `bg-raised`, etc.).
- Use `data-*` attributes on the root for mode + theme — keeps SSR stable.

## Reference: live audit dashboard

The `audit-dashboard/` folder at the repo root is a working Next.js 16 + Tailwind v4 implementation of all 7 project templates. Use it as a reference. Run with:

```bash
cd audit-dashboard
pnpm install
pnpm dev
```
