# examples/chatkit

Reference standalone HTML embed for OpenAI ChatKit with the Lumen theme applied. Demonstrates the "vanilla HTML" path from [`design-system/02-components/_chatkit-theme/README.md`](../../design-system/02-components/_chatkit-theme/README.md) — the host page injects Lumen CSS variables, then ChatKit picks them up automatically with zero per-component overrides.

## What's here

| File | Purpose |
|---|---|
| `index.html` | Standalone HTML embed. Inlines the Lumen token block (same set `lumenChatKitCssVariables()` emits) + a placeholder for the ChatKit mount. |
| `README.md` | This file. |

## Why standalone HTML and not Next.js

ChatKit is most commonly embedded on marketing pages and partner sites where:
- Loading a full React framework just for ChatKit is overkill.
- Direct CSS-variable control is the simplest theming path.
- The host page may have its own framework (Astro, plain HTML, Webflow export, etc.) that ChatKit drops into without conflict.

The CSS-variable contract is the durable theming surface. The JS API for ChatKit may evolve; the tokens stay stable. Decoupling them is the whole point of the `_chatkit-theme/` mapping.

## Wiring a real ChatKit embed

The `index.html` currently shows a placeholder where ChatKit would mount. To wire the real ChatKit:

```html
<script src="https://cdn.openai.com/chatkit/latest.js"></script>
<script type="module">
  import { lumenChatKitThemeResolved } from "../../design-system/02-components/_chatkit-theme/lumen-chatkit-theme.js";
  window.OpenAIChatKit.mount(document.querySelector(".embed-frame"), {
    theme: lumenChatKitThemeResolved,
    // …additional ChatKit config (assistantId, etc.)
  });
</script>
```

The CDN URL above is a placeholder. When ChatKit ships a public script snapshot, pin to that snapshot (same drift-pinning logic as the gpt-image-2 model snapshot from Phase 4 — see [`doc/LUMEN-v0.13-MASTER-REFACTOR.md`](../../doc/LUMEN-v0.13-MASTER-REFACTOR.md) §11).

## Inside a React app (preferred for Warp products)

If you're embedding ChatKit inside an existing Warp Next.js / React app, prefer the React path documented in [`design-system/02-components/_chatkit-theme/README.md`](../../design-system/02-components/_chatkit-theme/README.md):

```tsx
import { LumenChat } from "@openai/chatkit-react";
import { lumenChatKitTheme } from "@/components/ai-elements/_chatkit-theme/lumen-chatkit-theme";

export function EmbeddedAssistant() {
  return <LumenChat theme={lumenChatKitTheme} />;
}
```

`lumenChatKitTheme` (the live-token variant) reads from already-loaded Lumen CSS variables. `lumenChatKitThemeResolved` (used here in `index.html`) carries the literal hex / px values for standalone use.

## What this reference does NOT do

- **Doesn't mount the real ChatKit.** ChatKit's script URL is placeholder; the embed div shows a placeholder block instead.
- **Doesn't ship a session token.** Real ChatKit embeds need an `assistantId` and (depending on usage) a short-lived session token from the host server.
- **Doesn't include the Lumen stylesheet load.** This reference inlines the token block. In production, load `@lumen/tokens.css` (Phase 6 SDK) instead.

## Verify

Open `index.html` in any browser:

```bash
cd examples/chatkit
python3 -m http.server 8081
# Then open http://localhost:8081
```

Visual check: dark obsidian canvas, Spring Green accents, mono-cap eyebrow label, Lumen-typography. If any of those drift, the inline token block has diverged from `lumen-chatkit-theme.ts` — re-sync.

## Related

- [`design-system/02-components/_chatkit-theme/lumen-chatkit-theme.ts`](../../design-system/02-components/_chatkit-theme/lumen-chatkit-theme.ts) — the source of truth
- [`design-system/02-components/_chatkit-theme/README.md`](../../design-system/02-components/_chatkit-theme/README.md) — full mapping documentation
- [`examples/ai-surface/`](../ai-surface/) — sister reference for the in-Lumen AI surface (vs. ChatKit which is OpenAI's embeddable widget)
- [`doc/LUMEN-v0.13-MASTER-REFACTOR.md`](../../doc/LUMEN-v0.13-MASTER-REFACTOR.md) §7.Phase-5 cross-cutting ChatKit mapping
