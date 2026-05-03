# WooCommerce (WordPress)

> Stack: WordPress 6.5+, WooCommerce 8+, block themes (FSE). Lumen tokens delivered as a `theme.json` patch + a CSS file enqueued via PHP.

## Setup

### 1. Add Lumen tokens to your theme

In your theme folder, create `lumen-tokens.css`:
```bash
curl -L -o lumen-tokens.css "https://cdn.warp.dev/lumen/v0.1.0/css/tokens.css"
```

Enqueue in `functions.php`:
```php
add_action('wp_enqueue_scripts', function() {
  wp_enqueue_style(
    'lumen-tokens',
    get_stylesheet_directory_uri() . '/lumen-tokens.css',
    [],
    '0.1.0'
  );
});
```

### 2. Self-host Satoshi
```php
add_action('wp_head', function() {
  $url = get_stylesheet_directory_uri();
  ?>
  <style>
    @font-face {
      font-family: "Satoshi";
      src: url("<?php echo $url; ?>/fonts/Satoshi-Variable.woff2") format("woff2-variations");
      font-weight: 300 900;
      font-style: normal;
      font-display: swap;
    }
  </style>
  <?php
});
```

Drop `Satoshi-Variable.woff2` (and the italic) in `your-theme/fonts/`.

### 3. Map theme.json palette to Lumen
```json
{
  "version": 2,
  "settings": {
    "color": {
      "palette": [
        { "slug": "page",         "color": "var(--surface-page)",       "name": "Page"        },
        { "slug": "raised",       "color": "var(--surface-raised)",     "name": "Raised"      },
        { "slug": "primary",      "color": "var(--color-accent-500)",   "name": "Accent"      },
        { "slug": "text",         "color": "var(--text-primary)",       "name": "Text"        },
        { "slug": "text-muted",   "color": "var(--text-secondary)",     "name": "Text muted"  }
      ]
    },
    "typography": {
      "fontFamilies": [
        { "fontFamily": "var(--font-sans)", "name": "Satoshi", "slug": "sans" }
      ]
    }
  }
}
```

### 4. Override WooCommerce styles
```css
/* style.css */
.woocommerce .button.alt,
.woocommerce-page .button.alt {
  background: var(--color-action-primary-bg-rest);
  color: var(--color-action-primary-fg);
  border-radius: var(--radius-control-md);
  box-shadow: var(--shadow-accent-glow);
}

.woocommerce ul.products li.product {
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

## Live primitives

Same Web Components pattern — register `<lumen-stat>`, `<lumen-live-dot>`, `<lumen-rate-ticker>` via a small script enqueued alongside your theme's JS.

## Block patterns

Create reusable Lumen patterns via the Site Editor (Pattern Library) — they ship as part of your theme.

## Dark mode

Use a plugin like "WP Dark Mode" or roll your own toggle. Set `data-theme` on `<body>` (WordPress doesn't expose `<html>` easily); add a CSS rule:
```css
body[data-theme="dark"] { /* Lumen dark tokens cascade */ }
```

## Performance

- WordPress is a heavy substrate. Lumen tokens add ~6 KB CSS. Stay vigilant on plugin bloat.
- Use the Lumen tokens via theme.json and PHP enqueue — avoid plugins that inject inline styles.
- Cache via WP Super Cache or LiteSpeed Cache.

## Things to know

- WooCommerce checkout is hard to fully Lumen-ify because of plugin sprawl. Style the storefront cleanly; checkout is a known weak point on Woo.
- For a fresh build, consider Sage (Roots.io) as a starter theme — supports modern build tooling and Lumen integration is straightforward.

## Forms & inputs (v0.6 mapping)

> v0.6 introduced the **field-shell architecture** for all text-entry controls. See [forms-and-inputs.md](../../00-foundations/forms-and-inputs.md) for the canonical guide. This section maps the architecture to a WordPress block theme + WooCommerce — where `theme.json` exposes color/typography but **not** focus surfaces, requiring custom CSS.

### The shell pattern in block themes

`theme.json` covers color palettes, typography ramps, spacing scales, border radius — but it does NOT expose `:has(:focus-visible)` selectors, focus shadows, or per-element transitions. The v0.6 shell ships as **custom CSS** enqueued alongside `theme.json`, plus a custom block pattern for the field composition.

Drop this in `lumen-field.css` and enqueue:

```css
/* lumen-field.css — paired with the theme.json palette/typography */

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
}

.lumen-field input,
.lumen-field textarea,
.lumen-field select {
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

.lumen-field[data-size="sm"] { height: var(--size-control-sm); padding-inline: var(--space-2); font-size: 13px; }
.lumen-field[data-size="lg"] { height: var(--size-control-lg); padding-inline: var(--space-4); font-size: 15px; }
.lumen-field[data-invalid="true"]  { border-color: var(--border-error); }
.lumen-field[data-disabled="true"] { background: var(--surface-input-disabled); cursor: not-allowed; }
.lumen-field[aria-readonly="true"] { caret-color: transparent; }
```

Enqueue in `functions.php`:

```php
add_action('wp_enqueue_scripts', function() {
  wp_enqueue_style(
    'lumen-field',
    get_stylesheet_directory_uri() . '/lumen-field.css',
    ['lumen-tokens'], // depends on tokens being registered first
    '0.6.0'
  );
});
```

For block-editor authors, register a **custom block pattern** that wraps a Core Form Input block in the `.lumen-field` markup:

```php
add_action('init', function() {
  register_block_pattern('lumen/field', [
    'title'      => 'Lumen field',
    'categories' => ['forms'],
    'content'    => '
      <!-- wp:group {"className":"lumen-form-field"} -->
      <div class="wp-block-group lumen-form-field">
        <!-- wp:html -->
        <div class="lumen-field" data-size="md">
          <input type="text" name="field" placeholder="…" />
        </div>
        <!-- /wp:html -->
      </div>
      <!-- /wp:group -->
    ',
  ]);
});
```

### Token mapping

`theme.json` exposes a curated subset; the rest emit as CSS custom properties via `lumen-tokens.css`:

| Lumen token | theme.json path | Notes |
|---|---|---|
| `input.height.md` | (custom CSS only) | theme.json doesn't expose control heights |
| `input.padding.x.md` | `settings.spacing.spacingScale` (slug `space-3`) | available as `var(--wp--preset--spacing--space-3)` |
| `input.background.rest` | `settings.color.palette` (slug `input-rest`) | exposed in block-editor color picker |
| `input.border.rest` | `settings.color.palette` (slug `border-default`) | |
| `input.border.focus` | `settings.color.palette` (slug `border-focus`) | |
| `input.ring.focus` | (custom CSS only) | theme.json doesn't expose box-shadows |
| `input.transition` | (custom CSS only) | theme.json doesn't expose transitions |

**Token gap I wish theme.json filled:** WordPress's `theme.json` schema covers paint surfaces well but treats interactive states (hover, focus, error) as out of scope. The v0.6 shell needs ALL of those for parity with web-react — hence the custom-CSS escape hatch. A future `theme.json` extension for `settings.interactive.focus.shadow` would close the gap.

### Density modes

Block patterns can carry an attribute. Add a `density` attribute to the Lumen field pattern and write to a wrapper:

```html
<div class="wp-block-group lumen-form-field" data-density="compact">...</div>
```

The cascade rule applies (`[data-density="compact"] .lumen-field:not([data-size]) { ... }`). Operator-facing back-office tools default `compact`; consumer-facing storefront sections stay `comfortable`.

### Validation timing

Same rules as web. WP/Woo-specific notes:

1. **Don't validate during typing** — Woo and Contact Form 7 validate server-side on submit.
2. **Validate on blur** — for client-side hints (email shape, postcode format), attach a small `lumen-validate.js` enqueued alongside the form. The script listens on `blur`, toggles `data-invalid` on the shell, and updates the matching `.lumen-form-field__error` element.
3. **On submit**, WP re-renders the form with `WP_Error` objects. Render the messages into a `<div role="alert" aria-live="polite">` at the top of the form.
4. **WooCommerce checkout validation** uses `wc_add_notice()` and renders into `.woocommerce-error` / `.woocommerce-NoticeGroup`. Style these surfaces with Lumen tokens (`--text-error`, `--surface-input-rest` background) but DON'T try to relocate the messages — Woo's notice rendering is plugin territory.
5. **Async validation** (e.g., real-time stock check, coupon validation): debounce 300–500 ms; render a spinner in the trailing slot.

**Submit is never disabled as the only signal of validation failure.**

### Read-only vs disabled

| State | HTML | Visual | In tab order? | Submitted? |
|---|---|---|---|---|
| `disabled` | `<input disabled>` + `data-disabled="true"` on shell | muted bg | no | **no — value not submitted** |
| `readOnly` | `<input readonly>` + `aria-readonly="true"` on shell | rest bg, full contrast | yes | yes |

WooCommerce often uses `disabled` on out-of-stock variation fields where you actively don't want the value submitted. Use `readOnly` for displayed-but-uneditable values like a calculated subtotal.

### Override needed: WP block-editor input chrome

WordPress's block editor sometimes injects its own input chrome into the rendered storefront — particularly for Search and Newsletter blocks. Override with a high-specificity selector:

```css
/* Force Lumen field chrome onto Core Search and Newsletter blocks */
.wp-block-search .wp-block-search__input,
.wp-block-newsletterglue input[type="email"] {
  /* let .lumen-field wrapper paint chrome */
  background: transparent !important;
  border: 0 !important;
  outline: none !important;
  box-shadow: none !important;
}

.wp-block-search:has(.wp-block-search__input) {
  /* opt the wrapper into .lumen-field by reusing its rules */
  /* ... or wrap the search block in a pattern that already carries .lumen-field */
}
```

Cleaner long-term path: **wrap Core blocks in custom block patterns** that already carry `.lumen-field`, instead of fighting the rendered chrome with `!important`.

### Web-only features that don't translate

| Web feature | WP equivalent | Status |
|---|---|---|
| `:has(:focus-visible)` | runs natively in browser; CSS file emits the selector | clean |
| Autofill bg override | shipped in `lumen-field.css`; works browser-side | clean |
| `field-sizing: content` | shipped; modern browsers handle it | clean |
| `theme.json` covering interactive states | partial — focus/hover/error require custom CSS escape hatch | platform gap |
