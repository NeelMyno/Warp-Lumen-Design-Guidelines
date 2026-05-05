# Shopify Liquid

> Stack: Shopify Online Store 2.0 themes. Lumen tokens delivered as a `.css.liquid` snippet that injects CSS variables; Satoshi loaded via Shopify's font picker workaround (custom font upload).

> **v0.11.13 currency.** This guide reflects the Premium Psychology recolor — anchors are spring green `#00FA8A` (accent), obsidian mint `#171A18` (dark canvas), light anchor `#E6E6E6`, paper `#FAFAFA`. Seven principles now (hierarchy, first-impression, micro-interactions joined the original five) and 35 component contracts. v0.11.13 closes the DTCG inheritance audit; the Liquid-template defaults below now match v0.11 anchors so Shopify themes don't ship old colours by accident.

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
  data-mood="default"
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

- **Product detail:** see audit dashboard `/commerce` route for the canonical layout.
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

## Forms & inputs (v0.6 mapping)

> v0.6 introduced the **field-shell architecture** for all text-entry controls. See [forms-and-inputs.md](../../00-foundations/forms-and-inputs.md) for the canonical guide. This section maps the architecture to Shopify Liquid (Online Store 2.0) — where Liquid + Theme Editor expose the necessary primitives but the storefront-checkout split limits reach.

### The shell pattern in Liquid

Liquid is a templating layer on top of CSS — the v0.6 shell ships as a snippet that emits the `.lumen-field` class plus its inner bare native input. Drop this in `snippets/lumen-field.liquid`:

```liquid
{% comment %}
  Lumen v0.6 field shell.
  Usage:
    {% render 'lumen-field',
        name: 'pickup-zip',
        label: 'Pickup ZIP',
        placeholder: '90045',
        leading_icon: 'icons/map-pin.svg',
        trailing_addon: 'STD',
        size: 'md'
    %}
{% endcomment %}

{%- assign size = size | default: 'md' -%}
{%- assign field_id = name | append: '-' | append: section.id -%}

<div class="lumen-form-field">
  {%- if label -%}
    <label class="lumen-form-field__label" for="{{ field_id }}">
      {{ label }}{% if optional %} <span class="lumen-form-field__optional">(optional)</span>{% endif %}
    </label>
  {%- endif -%}

  <div class="lumen-field" data-size="{{ size }}"
       {% if invalid %}data-invalid="true"{% endif %}
       {% if disabled %}data-disabled="true"{% endif %}
       {% if read_only %}aria-readonly="true"{% endif %}>
    {%- if leading_icon -%}
      <span data-slot="leading">{% render leading_icon %}</span>
    {%- endif -%}
    <input
      type="{{ type | default: 'text' }}"
      id="{{ field_id }}"
      name="{{ name }}"
      placeholder="{{ placeholder }}"
      {% if value %}value="{{ value }}"{% endif %}
      {% if disabled %}disabled{% endif %}
      {% if read_only %}readonly{% endif %}
      {% if required %}required aria-required="true"{% endif %}
      {% if invalid %}aria-invalid="true"{% endif %}
    />
    {%- if trailing_addon -%}
      <span data-slot="addon">{{ trailing_addon }}</span>
    {%- endif -%}
  </div>

  {%- if hint and invalid != true -%}
    <p class="lumen-form-field__hint">{{ hint }}</p>
  {%- endif -%}
  {%- if error -%}
    <p class="lumen-form-field__error" role="alert">{{ error }}</p>
  {%- endif -%}
</div>
```

The `.lumen-field` CSS recipe ships in `snippets/lumen-tokens.liquid` (or as part of `assets/lumen.css`) — same wrapper-paints-focus pattern as web-react. Liquid is just emitting the markup; the browser runs the same `:has(:focus-visible)` selector.

Slot bonding works via Liquid `block` capture for cases where consumers need to render arbitrary children inside the shell:

```liquid
{% capture leading_slot %}<svg>...</svg>{% endcapture %}
{% capture trailing_slot %}<button data-interactive type="button">×</button>{% endcapture %}
{% render 'lumen-field', leading_slot: leading_slot, trailing_slot: trailing_slot %}
```

### Token mapping

Tokens emit as CSS custom properties via `lumen-tokens.css.liquid` — same names as web. Theme Editor exposes a curated subset via `config/settings_schema.json` so merchants can adjust without editing CSS:

| Lumen token | Theme Editor setting (settings_schema.json) | Where it surfaces |
|---|---|---|
| `input.height.md` | `input_height_md` (range, 32–56) | Theme Editor → Form & inputs |
| `input.padding.x.md` | `input_padding_x_md` (range, 8–20) | Theme Editor → Form & inputs |
| `input.background.rest` | `input_background_rest` (color picker) | Theme Editor → Form & inputs |
| `input.border.rest` | `input_border_rest` (color picker) | Theme Editor → Form & inputs |
| `input.border.focus` | `input_border_focus` (color picker, defaults to Lumen spring green `#00FA8A`) | Theme Editor → Form & inputs |
| `input.ring.focus` | (not exposed; CSS-managed) | shipped in `lumen.css` |
| `input.transition` | (not exposed) | shipped |

Wire the schema settings through the snippet:

```liquid
{% style %}
  :root {
    --size-control-md: {{ settings.input_height_md | default: 40 }}px;
    --space-3:        {{ settings.input_padding_x_md | default: 12 }}px;
    --surface-input-rest: {{ settings.input_background_rest | default: '#FAFAFA' }};
    --border-default: {{ settings.input_border_rest | default: '#D2D4D3' }};
    --border-focus:   {{ settings.input_border_focus | default: '#00FA8A' }};
  }
{% endstyle %}
```

### Density modes

Sections in Online Store 2.0 can carry their own density. Add a section setting `density: select(compact, comfortable)` and write it to the section root:

```liquid
<section class="shopify-section" data-density="{{ section.settings.density | default: 'comfortable' }}">
  ...
</section>
```

The `.lumen-field` cascade rule from web-react (`[data-density="compact"] .lumen-field:not([data-size]) { ... }`) does the rest. Operator-facing merchant tools default `compact`; consumer storefront sections stay `comfortable`.

### Validation timing

Same rules as web. Liquid-specific notes:

1. **Don't validate during typing** — Shopify form validation runs server-side. Pre-touch state is a clean slate.
2. **Validate on blur** — for client-side hints (ZIP format, email shape), wire a small `<script>` per form that listens on `blur` and toggles `data-invalid`.
3. **On submit**, Liquid re-renders the form with `form.errors` populated. Map each error to the matching field's `error` arg in the snippet:
   ```liquid
   {% render 'lumen-field', name: 'email', error: form.errors.translated_fields.email %}
   ```
4. **Server validation** announcements via `<div role="status" aria-live="polite">{{ form.errors.messages | join: ', ' }}</div>` at the top of the form, with anchor links to invalid fields.
5. **Async validation** (postal code service, Shopify discount code lookup): debounce 300–500 ms, render a Shopify-supported spinner (`{% render 'icon-spinner' %}`) in the trailing slot.

**Submit is never disabled as the only signal of validation failure.**

### Read-only vs disabled

Liquid form helpers (`{% form 'contact' %}`, `{% form 'product' %}`) accept native HTML attributes — pass `disabled` or `readonly` directly:

| State | Liquid | Visual | In tab order? | Submitted? |
|---|---|---|---|---|
| `disabled` | `<input disabled>` + `data-disabled="true"` on shell | muted bg | no | **no — value not submitted** |
| `readOnly` | `<input readonly>` + `aria-readonly="true"` on shell | rest bg, full contrast | yes | yes |

The `disabled` ↔ "value not submitted" semantic matters for Shopify forms — a disabled price field will not appear in `params[:product]` on submit. Use `readOnly` when the value must reach the server but the user can't change it.

### Checkout caveat

Shopify Checkout is hard-locked to Shopify's own theme. The v0.6 shell only applies to **storefront** forms (cart, contact, login, address). Customizing checkout requires Shopify Plus + Checkout Extensibility — at which point the shell can be ported to checkout via a UI Extension that emits the same `.lumen-field` markup.

### Web-only features that don't translate

| Web feature | Liquid equivalent | Status |
|---|---|---|
| `:has(:focus-visible)` | runs natively in browser; Liquid emits the same CSS | clean |
| Tailwind v4 `has-focus-visible:` | not applicable — Liquid themes typically don't ship Tailwind; use the `.lumen-field` class directly | clean |
| Autofill bg override | shipped in `lumen.css`; works regardless of templating layer | clean |
| `field-sizing: content` (auto-grow Textarea) | shipped in `lumen.css`; works in modern browsers | clean |
