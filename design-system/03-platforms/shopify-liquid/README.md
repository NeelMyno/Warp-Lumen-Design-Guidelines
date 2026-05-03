# Shopify Liquid

> Stack: Shopify Online Store 2.0 themes. Lumen tokens delivered as a `.css.liquid` snippet that injects CSS variables; Satoshi loaded via Shopify's font picker workaround (custom font upload).

## Setup

### 1. Add the Lumen tokens snippet
Copy `_build/liquid/css-variables.liquid` to your theme:
```
snippets/lumen-tokens.liquid
```

Then include in `layout/theme.liquid`:
```liquid
{{ 'lumen-tokens.css.liquid' | asset_url | stylesheet_tag }}
```

### 2. Upload Satoshi
Shopify doesn't allow loading external fonts directly. Two options:

**Option A: Upload to Files**
1. Upload `Satoshi-Variable.woff2` and `Satoshi-VariableItalic.woff2` to Settings → Files.
2. Reference in your `lumen-tokens.css.liquid`:
```liquid
@font-face {
  font-family: "Satoshi";
  src: url({{ 'Satoshi-Variable.woff2' | asset_url }}) format("woff2-variations");
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}
```

**Option B: Theme Assets folder**
Drop the woff2 files in `assets/` and reference via `asset_url`.

### 3. Wire `<html>` data attributes
```liquid
<!doctype html>
<html
  lang="{{ request.locale.iso_code }}"
  data-mood="obsidian-lime"
  data-theme="light"
>
```

For dark mode based on customer preference, add a small JS snippet in `layout/theme.liquid`.

### 4. Apply Lumen utilities to existing theme classes
Override Dawn's (or your theme's) classes to use Lumen tokens:

```css
/* assets/lumen-overrides.css */
.button {
  background: var(--color-action-primary-bg-rest);
  color: var(--color-action-primary-fg);
  border-radius: var(--radius-control-md);
  box-shadow: var(--shadow-accent-glow);
}
.button:hover { background: var(--color-action-primary-bg-hover); }

.card {
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card-default);
  box-shadow: var(--shadow-card);
}

body {
  font-family: var(--font-sans);
  background: var(--surface-page);
  color: var(--text-primary);
}
```

## Live primitives in Liquid

Web Components is the cleanest way:

```liquid
{% schema %}
{ "name": "Live Ticker" }
{% endschema %}

<lumen-rate-ticker rates="LAX→SFO:$262;ORD→ATL:$485;DFW→PHX:$390"></lumen-rate-ticker>

<script>
  customElements.define("lumen-rate-ticker", class extends HTMLElement {
    connectedCallback() {
      const rates = (this.getAttribute("rates") || "").split(";").map(r => {
        const [route, price] = r.split(":");
        const [from, to] = route.split("→");
        return { from, to, price };
      });
      this.innerHTML = `/* render rates as a marquee */`;
    }
  });
</script>
```

## E-commerce-specific patterns

- **Product detail:** see audit dashboard `/ecommerce` route for the canonical layout.
- **Cart drawer:** anchored right, 400 px wide, Lumen `Drawer` pattern.
- **Checkout:** Shopify checkout is hard-locked to their own theme — Lumen styles only the storefront, not Shopify Checkout. Customizing checkout requires Shopify Plus + Checkout Extensibility.
- **Trust strip + Live ticker:** highly compatible with Warp brand if the merchant is freight-adjacent.

## Performance

- Total CSS payload should stay under 50 KB per page.
- Satoshi self-hosted from Shopify CDN is fast (Shopify edges are global).
- Use `font-display: swap` to avoid blocking LCP.
- Lazy-load any non-critical Lumen components via Web Components.

## Dawn theme as a base

Dawn (Shopify's reference theme) is a good starting point. Override its CSS custom properties at `:root` with Lumen tokens, and you're 80% there.
