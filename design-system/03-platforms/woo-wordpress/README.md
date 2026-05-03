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
        { "fontFamily": "var(--font-sans)", "name": "Sans", "slug": "sans" },
        { "fontFamily": "var(--font-mono)", "name": "Mono", "slug": "mono" }
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
