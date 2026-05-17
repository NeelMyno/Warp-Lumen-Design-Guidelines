---
name: ChatKit theme
type: theme
version: 0.13.0
last_updated: 2026-05-17
phase: 5
audience: [engineer, llm-agent]
related:
  - ./lumen-chatkit-theme.ts
  - ../../../examples/chatkit/README.md
  - ../../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Lumen ChatKit Theme

The Lumen-themed binding for OpenAI ChatKit. Imports as `@warp/lumen/chatkit-theme` (post-Phase-6 once we publish under `@warp/*` SDKs); today, consumed via relative path.

## Two shapes, one source of truth

| Export | When to use |
|---|---|
| `lumenChatKitTheme` | Inside an app that already loads `@lumen/tokens` CSS (so `var(--…)` resolves). Default for Warp products. |
| `lumenChatKitThemeResolved` | Standalone embeds where the Lumen stylesheet isn't loaded — marketing pages, third-party host pages, isolated previews. Carries literal hex / px values. |
| `lumenChatKitCssVariables()` | Returns a `:root { --… }` CSS string for injecting Lumen tokens into a shadow root or standalone HTML before mounting ChatKit. |

The two themes are mechanically aligned — both derive from the same semantic token graph. The literal-hex variant is sync'd manually against `dist/css/lumen.css` whenever brand anchors change (rare).

## Usage

### Inside a Warp product (preferred)

```tsx
import { LumenChat } from "@openai/chatkit-react";
import { lumenChatKitTheme } from "@/components/ai-elements/_chatkit-theme/lumen-chatkit-theme";

export function EmbeddedAssistant() {
  return <LumenChat theme={lumenChatKitTheme} />;
}
```

The CSS variables `var(--color-spring-500)`, `var(--color-surface-canvas)`, etc., resolve from the loaded Lumen stylesheet.

### Standalone embed (marketing page, partner site)

```tsx
import { LumenChat } from "@openai/chatkit-react";
import { lumenChatKitThemeResolved } from "@/components/ai-elements/_chatkit-theme/lumen-chatkit-theme";

export function MarketingEmbed() {
  return <LumenChat theme={lumenChatKitThemeResolved} />;
}
```

### Vanilla HTML embed

```html
<script type="module">
  import { lumenChatKitCssVariables } from "/path/to/lumen-chatkit-theme.js";
  const style = document.createElement("style");
  style.textContent = lumenChatKitCssVariables();
  document.head.appendChild(style);
  // Then mount ChatKit normally — it reads from the now-defined CSS vars.
</script>
```

## What this theme covers

- `color.accent.primary` / `accent.level` — Spring Green action moments
- `color.background.{primary,secondary,tertiary}` — obsidian canvas + raised + sunken surfaces
- `color.text.{primary,secondary,tertiary,onAccent}` — text scale + AAA-contrast on Spring Green
- `color.border.{hairline,default,strong,frame,accent}` — Lumen's hairline-first chrome
- `color.status.{danger,warning,success}` — lumen-red / lumen-amber / Spring Green
- `radius.{sm,md,lg,xl,full}` — 4-stop radius scale
- `density: "compact"` — operator-density default
- `typography.fontFamily` — Satoshi sans + Geist Mono mono
- `typography.featureSettings.tabularNumerals` — `tnum` + `lnum` for numeric data
- `motion.{durationFast,durationBase,easingStandard}` — Lumen's 5-duration ladder
- `shadow.{card,popover,focus,glowAccent}` — including the 3-layer Spring Green signature

## What this theme does NOT cover

- **ChatKit's own component-specific overrides.** ChatKit may expose additional knobs (`bubble.alignment`, `actions.layout`, etc.). When those exist, add them to `lumenChatKitTheme` AT the spec — never as one-off overrides in product code.
- **Animations beyond what ChatKit supports.** ChatKit's internal transitions are governed by ChatKit itself; Lumen contributes only `durationFast` / `durationBase` / `easingStandard` as the token surface.
- **Locale-specific typography.** When Warp ships non-Latin scripts, the Satoshi fallback chain expands; that's a Phase 6+ concern.

## Reference embed

[`examples/chatkit/`](../../../examples/chatkit/) is the canonical reference. It demonstrates both theme shapes and provides a copy-pasteable HTML embed example.

## Source

- Theme: [`lumen-chatkit-theme.ts`](./lumen-chatkit-theme.ts) — the live + resolved + CSS-var helper exports
- Reference embed: [`examples/chatkit/`](../../../examples/chatkit/)
- Master doc: [`doc/LUMEN-v0.13-MASTER-REFACTOR.md`](../../../doc/LUMEN-v0.13-MASTER-REFACTOR.md) §7.Phase-5 ChatKit mapping
