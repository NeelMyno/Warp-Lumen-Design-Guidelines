# Web · Next.js + React + Tailwind v4

> The default platform. Stack: Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui-style component delivery, Satoshi self-hosted via `next/font/local`.

> **v0.11.13 currency.** This guide reflects the Premium Psychology recolor — anchors are spring green `#00FA8A` (accent), obsidian mint `#171A18` (dark canvas), light anchor `#E6E6E6`, paper `#FAFAFA`. The system now ships seven principles (hierarchy, first-impression, micro-interactions joined the original five) and 35 component contracts. v0.11.13 closes the DTCG inheritance audit so every consumer of these tokens inherits cleanly through primitive → semantic → component layers.

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
curl -L -o src/styles/lumen.css "https://cdn.warp.dev/lumen/v0.11.13/tailwind/theme.css"
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
- `data-mood="default"` — the v0.11 system collapsed to a single Obsidian Mint mood (the multi-mood architecture was simplified in the recolor). Set this for forward-compat.
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

- **Font payload budget:** ≤ 90 KB total — Satoshi Variable + Italic VF (~86 KB combined, gzipped ~34 KB). v0.10 retired JetBrains Mono so the system ships a single typeface; numerics ride Satoshi's tnum table. Stay under 150 KB.
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

## Forms & inputs (v0.6 mapping)

> v0.6 introduced the **field-shell architecture** for all text-entry controls. See [forms-and-inputs.md](../../00-foundations/forms-and-inputs.md) for the canonical guide and [`_meta/decisions/0011-forms-and-inputs-v06.md`](../../../_meta/decisions/0011-forms-and-inputs-v06.md) for the why. This section maps the architecture to web-react — the **canonical** implementation.

### The shell pattern in web-react

Every text-entry control wraps in `.lumen-field` (a single `<div>`). The shell owns the border, background, lit edge, and focus halo. The inner `<input>` / `<textarea>` / `<select>` renders bare — no border, ring, or fill — inheriting from the wrapper. Slots (`leading`, `trailing`, `addon`) sit as siblings inside the shell, so they bond inside the focus boundary by construction.

Two ways to consume:

1. **Standalone** — apply `.lumen-field` to any wrapper around a bare native input. Use when you need full markup control.
   ```tsx
   <div className="lumen-field" data-size="md">
     <span data-slot="leading"><MapPinIcon /></span>
     <input type="text" name="zip" placeholder="90045" />
     <span data-slot="addon">STD</span>
   </div>
   ```
2. **`<Field>` wrapper** — `audit-dashboard/src/components/primitives/field.tsx` exports a `<Field>` composition that bundles label + description + shell + hint/error in one vertical group. This is the default consumer surface.
   ```tsx
   <Field label="Pickup ZIP" hint="5-digit ZIP" leadingIcon={<MapPinIcon />} trailingAddon="STD">
     <input name="zip" />
   </Field>
   ```

The architectural rule (v0.6 fix): only the wrapper paints focus.

```css
@supports selector(:has(:focus-visible)) {
  .lumen-field:has(:is(input, textarea, select):focus-visible) {
    border-color: var(--border-focus);
    box-shadow: var(--shadow-input-lit-edge), var(--shadow-input-focus);
  }
}
@supports not selector(:has(:focus-visible)) {
  .lumen-field:focus-within {
    border-color: var(--border-focus);
    box-shadow: var(--shadow-input-lit-edge), var(--shadow-input-focus);
  }
}

.lumen-field :is(input, textarea, select):focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
```

`:has(:focus-visible)` is ~92% baseline support; `:focus-within` is the fallback. Tailwind v4 ships **`has-focus-visible:`** as a first-class variant, so the same pattern composes inline:

```tsx
<div className="lumen-field has-focus-visible:[--ring:var(--shadow-input-focus)]">…</div>
```

### Token mapping

All field-shell tokens emit as CSS custom properties via Style Dictionary. The web-react platform consumes them directly — no translation layer.

| Lumen token | CSS variable | Tailwind utility |
|---|---|---|
| `input.height.sm` | `--size-control-sm` (32 px) | `h-[var(--size-control-sm)]` |
| `input.height.md` | `--size-control-md` (40 px) | `h-[var(--size-control-md)]` |
| `input.height.lg` | `--size-control-lg` (48 px) | `h-[var(--size-control-lg)]` |
| `input.padding.x.md` | `--space-3` (12 px) | `px-3` |
| `input.background.rest` | `--surface-input-rest` | `bg-input-rest` (via `@theme`) |
| `input.border.rest` | `--border-default` | `border-default` |
| `input.border.focus` | `--border-focus` | `border-focus` |
| `input.ring.focus` | `--shadow-input-focus` | `shadow-[var(--shadow-input-focus)]` |
| `input.ring.error` | `--shadow-input-error` | `shadow-[var(--shadow-input-error)]` |
| `input.ring.litEdge` | `--shadow-input-lit-edge` | composes via comma-stack |
| `input.transition` | `--motion-fast` + `--easing-standard` | inherited from `.lumen-field` |

Don't reach for primitive color tokens (`bg-[var(--lumen-red-N)]`) directly — `scripts/lint-no-arbitrary-form-values.mjs` flags them.

### Density modes

`<Form density="compact">` sets `data-density="compact"` on the form root. Nested `.lumen-field` shells without an explicit `data-size` adopt 32 px height + reduced padding via:

```css
[data-density="compact"] .lumen-field:not([data-size]) {
  height: var(--size-control-sm);
  padding-inline: var(--space-2);
  font-size: var(--type-13);
}
```

Operator dashboards default `compact`; marketing forms stay `comfortable`.

### Validation timing

The shell is state-driven via `data-*` attributes. The Form primitive orchestrates timing:

1. **Don't validate during typing.** Pre-touched fields render at rest.
2. **Validate on blur** after first interaction. Set `data-invalid="true"` on the shell (Field handles this from its `error` prop) — border swaps to `--border-error`, halo flips to `--shadow-input-error` on focus.
3. **Switch to onChange** for that field once an error is shown — clear the error as soon as the value is fixed.
4. **On submit**, validate everything. `Form` focuses the first invalid via `field.focus({ preventScroll: false })` and renders a `<ValidationMessage>` summary at the top with anchor links.
5. **Server validation** surfaces via an `aria-live="polite"` region on the Form root. Map 4xx error codes to specific field errors via a shared schema.
6. **Async validation** (e.g., ZIP service availability): debounce 300–500 ms, show a spinner in `[data-slot="trailing"]`, never block submit.

**Submit is never disabled as the only signal of validation failure.**

v0.6 ships a thin native form orchestrator. v0.7 will add a react-hook-form binding (`useFormContext` + Zod resolver) so the same shell can be driven declaratively. The shell pattern doesn't change — only the wiring around it.

### Read-only vs disabled

Distinct semantics, distinct visuals.

| State | DOM | Shell visual | In tab order? | Caret? | Copyable? |
|---|---|---|---|---|---|
| `disabled` | `<input disabled>` + `data-disabled="true"` on shell | muted bg (`--surface-input-disabled`), dim border, cursor `not-allowed` | no | no | no |
| `readOnly` | `<input readOnly>` + `aria-readonly="true"` on shell | rest bg, full contrast text, no caret | yes | no | yes |

Don't gate readability behind disabled — use read-only when the value matters but can't be edited.

### Distribution: shadcn registry

Lumen's v0.6 shell ships through the shadcn registry. Installing a primitive copies the component code AND the underlying `.lumen-field` CSS into the consuming repo:

```bash
pnpm dlx shadcn@latest add https://cdn.warp.dev/lumen/registry/input.json
pnpm dlx shadcn@latest add https://cdn.warp.dev/lumen/registry/checkbox.json
pnpm dlx shadcn@latest add https://cdn.warp.dev/lumen/registry/textarea.json
```

The registry index at `https://cdn.warp.dev/lumen/registry.json` lists all 35 v0.11.13 component contracts. The CSS recipe layer (the `.lumen-field` block) is bundled with the first form-primitive install and not re-emitted on subsequent ones.

### React 19 form hook integration

v0.6 form primitives are server-action compatible — `<Form action={serverAction}>` works because the shell wraps a real native `<input name="…">`. `useActionState` and `useFormStatus` interop is preserved. v0.7 will add the react-hook-form binding for declarative validation; until then, `<Form>` orchestrates blur-validation + focus-on-first-error in a thin native wrapper.

## Reference: live audit dashboard

The `audit-dashboard/` folder at the repo root is a working Next.js 16 + Tailwind v4 implementation of all 7 project templates. Use it as a reference. Run with:

```bash
cd audit-dashboard
pnpm install
pnpm dev
```
