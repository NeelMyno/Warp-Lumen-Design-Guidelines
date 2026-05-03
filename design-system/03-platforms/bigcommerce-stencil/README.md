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

## Forms & inputs (v0.6 mapping)

> v0.6 introduced the **field-shell architecture** for all text-entry controls. See [forms-and-inputs.md](../../00-foundations/forms-and-inputs.md) for the canonical guide. This section maps the architecture to BigCommerce Stencil — SCSS partials + Handlebars templates with theme-editor exposure.

### The shell pattern in Stencil

Stencil uses Handlebars for templates and SCSS for styles. The v0.6 shell ships as an SCSS partial (`assets/scss/components/_field.scss`) plus a Handlebars partial (`templates/components/forms/lumen-field.html`):

```scss
// assets/scss/components/_field.scss

.lumen-field {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: var(--size-control-md);
  padding-inline: var(--space-3);
  background: var(--surface-input-rest);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font: 14px/1.4 var(--font-sans);
  cursor: text;
  transition:
    border-color var(--motion-fast) var(--easing-standard),
    box-shadow var(--motion-fast) var(--easing-standard);
  box-shadow: var(--shadow-input-lit-edge);

  // Bare inner input — wrapper owns chrome
  input, textarea, select {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: 0;
    outline: none;
    box-shadow: none;
    color: inherit;
    font: inherit;
    padding: 0;
  }

  // Single focus ring on wrapper
  @supports selector(:has(:focus-visible)) {
    &:has(:is(input, textarea, select):focus-visible) {
      border-color: var(--border-focus);
      box-shadow: var(--shadow-input-lit-edge), var(--shadow-input-focus);
    }
  }
  @supports not selector(:has(:focus-visible)) {
    &:focus-within {
      border-color: var(--border-focus);
      box-shadow: var(--shadow-input-lit-edge), var(--shadow-input-focus);
    }
  }

  // Suppress global :focus-visible inside the wrapper
  :is(input, textarea, select):focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }

  &[data-size="sm"] { height: var(--size-control-sm); padding-inline: var(--space-2); font-size: 13px; }
  &[data-size="lg"] { height: var(--size-control-lg); padding-inline: var(--space-4); font-size: 15px; }
  &[data-invalid="true"]  { border-color: var(--border-error); }
  &[data-disabled="true"] { background: var(--surface-input-disabled); cursor: not-allowed; }
  &[aria-readonly="true"] { caret-color: transparent; }
}
```

```handlebars
{{!-- templates/components/forms/lumen-field.html --}}
<div class="lumen-form-field">
  {{#if label}}
    <label class="lumen-form-field__label" for="{{id}}">{{label}}</label>
  {{/if}}

  <div class="lumen-field"
       data-size="{{default size 'md'}}"
       {{#if invalid}}data-invalid="true"{{/if}}
       {{#if disabled}}data-disabled="true"{{/if}}
       {{#if readonly}}aria-readonly="true"{{/if}}>
    {{#if leadingIcon}}<span data-slot="leading">{{> @partial-block}}</span>{{/if}}
    <input
      type="{{default type 'text'}}"
      id="{{id}}"
      name="{{name}}"
      placeholder="{{placeholder}}"
      {{#if disabled}}disabled{{/if}}
      {{#if readonly}}readonly{{/if}}
      {{#if invalid}}aria-invalid="true"{{/if}}
    />
    {{#if trailingAddon}}<span data-slot="addon">{{trailingAddon}}</span>{{/if}}
  </div>

  {{#if hint}}<p class="lumen-form-field__hint">{{hint}}</p>{{/if}}
  {{#if error}}<p class="lumen-form-field__error" role="alert">{{error}}</p>{{/if}}
</div>
```

The discipline matches web-react: one wrapper paints chrome, inner native input is bare, slots bond as siblings inside the focus boundary.

### Token mapping

Tokens emit as CSS custom properties via `assets/scss/lumen/_tokens.scss` — same names as web. `config.json` exposes a curated subset to Page Builder so merchants can adjust visually:

| Lumen token | BC `config.json` setting | Theme Editor surface |
|---|---|---|
| `input.height.md` | `input-height-md` | Page Builder → Forms |
| `input.padding.x.md` | `input-padding-x-md` | Page Builder → Forms |
| `input.background.rest` | `input-background-rest` (color) | Page Builder → Forms |
| `input.border.rest` | `input-border-rest` (color) | Page Builder → Forms |
| `input.border.focus` | `input-border-focus` (color, defaults to Lumen lime) | Page Builder → Forms |
| `input.ring.focus` | (not exposed; SCSS-managed) | shipped in `_field.scss` |
| `input.transition` | (not exposed) | shipped |

Wire `config.json` settings through SCSS via the existing Stencil pattern — `{{theme_settings.input-height-md}}` interpolated in `assets/scss/settings/_lumen.scss`.

### Density modes

Storefront-focused; `comfortable` is the natural default. Add a section-level density toggle via Page Builder customizations and write to a wrapper element:

```handlebars
<section data-density="{{default section.density 'comfortable'}}">...</section>
```

Use `compact` for back-of-house merchant tools or in-store-kiosk-style apps; consumer storefront stays `comfortable`. The cascade rule from web-react ports verbatim.

### Validation timing

Same rules as web. Stencil-specific notes:

1. **Don't validate during typing** — BC's contact / address forms validate server-side on submit.
2. **Validate on blur** — for client-side hints, attach a small `theme/js/forms/lumen-validate.js` module that listens on `blur` and toggles `data-invalid` on the shell.
3. **On submit**, BC re-renders the page (or the form fragment, in AJAX mode) with errors. Map errors to fields via Handlebars `{{#each form.errors}}`.
4. **Server validation** announcement: render an `aria-live="polite"` summary at the form top.
5. **Async validation** (e.g., postal-code lookups, gift-card validation): debounce 300–500 ms; render a Stencil-shipped spinner in the trailing slot.

**Submit is never disabled as the only signal of validation failure.**

### Read-only vs disabled

| State | HTML | Visual | In tab order? | Submitted? |
|---|---|---|---|---|
| `disabled` | `<input disabled>` + `data-disabled="true"` on shell | muted bg | no | **no — value not submitted** |
| `readOnly` | `<input readonly>` + `aria-readonly="true"` on shell | rest bg, full contrast | yes | yes |

For BigCommerce gift card / coupon code fields where the value should reach the server unchanged, use `readOnly`, not `disabled`.

### Checkout-specific notes

BC supports **Optimized One-Page Checkout** customization on Plus plans. The same `lumen-field` partial works in checkout templates; bundle the SCSS partial into the checkout asset bundle alongside the storefront one. Without Plus, checkout falls back to BC's default chrome.

### Web-only features that don't translate

| Web feature | Stencil equivalent | Status |
|---|---|---|
| `:has(:focus-visible)` | runs natively in browser; SCSS partial emits the selector | clean |
| Autofill bg override | shipped in `_field.scss`; works browser-side | clean |
| `field-sizing: content` (auto-grow Textarea) | shipped; modern browsers handle it | clean |
| Tailwind v4 `has-focus-visible:` variant | not applicable — BC themes use SCSS, not Tailwind | n/a |
