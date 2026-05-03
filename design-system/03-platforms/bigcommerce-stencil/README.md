# BigCommerce (Stencil)

> Stack: BigCommerce Stencil framework, SCSS + Handlebars. Lumen tokens delivered as a SCSS partial generated from `_build/json/tokens.flat.json`.

## Setup

### 1. Install Stencil CLI
```bash
npm install -g @bigcommerce/stencil-cli
```

### 2. Add Lumen tokens partial
```bash
mkdir -p assets/scss/lumen
curl -L -o assets/scss/lumen/_tokens.scss \
  "https://cdn.warp.dev/lumen/v0.1.0/scss/tokens.scss"
```

In your main SCSS file:
```scss
@import "lumen/tokens";

:root {
  // tokens auto-generated as CSS variables
}

body {
  font-family: var(--font-sans);
  background: var(--surface-page);
  color: var(--text-primary);
}
```

### 3. Self-host Satoshi
Drop the woff2 files in `assets/fonts/` and add to your SCSS:
```scss
@font-face {
  font-family: "Satoshi";
  src: url("../fonts/Satoshi-Variable.woff2") format("woff2-variations");
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}
```

### 4. Override Cornerstone's variables
Cornerstone (BigCommerce's reference theme) defines its own SCSS variables in `assets/scss/settings/`. Map them to Lumen:
```scss
// assets/scss/settings/_lumen.scss
$button-primary-backgroundColor: var(--color-action-primary-bg-rest);
$button-primary-color: var(--color-action-primary-fg);
$button-primary-backgroundColorHover: var(--color-action-primary-bg-hover);

$card-backgroundColor: var(--surface-raised);
$card-borderColor: var(--border-subtle);
$card-borderRadius: var(--radius-card-default);

$body-font: var(--font-sans);
$mono-font: var(--font-mono);
```

## Live primitives

Same Web Components approach as Shopify Liquid — define `<lumen-stat>`, `<lumen-live-dot>`, `<lumen-rate-ticker>` as custom elements and drop them anywhere in Handlebars templates.

## Reduced motion

Honor `prefers-reduced-motion` in CSS — already covered by Lumen's global rule in tokens.

## Dark mode

Add a theme toggle component (Stencil supports them via Page Builder customizations). Toggle `data-theme` on `<html>` and Lumen's CSS variables resolve automatically.

## Things to know

- BigCommerce caches CSS aggressively. Bump version on `theme.json` to bust cache.
- Stencil's `theme.json` defines the customizable variables exposed in Page Builder. Add Lumen mood as a custom theme variable. v0.4 ships only `obsidian-lime`; future mood alternates would live behind the same hook without breaking templates.
- For checkout: BigCommerce supports custom checkout theming on Plus accounts. Apply Lumen tokens there too.
