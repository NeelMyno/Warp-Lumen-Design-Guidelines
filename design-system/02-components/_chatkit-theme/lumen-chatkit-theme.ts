/**
 * Lumen ChatKit Theme
 *
 * Maps Lumen's v0.13 semantic tokens onto OpenAI ChatKit's theme variable shape.
 * A consumer importing this theme into a ChatKit embed gets Lumen's voice with
 * NO per-component overrides:
 *
 *   import { LumenChat } from "@openai/chatkit-react";
 *   import { lumenChatKitTheme } from "@warp/lumen/chatkit-theme";
 *
 *   <LumenChat theme={lumenChatKitTheme} />
 *
 * The ChatKit theme contract (May 2026 snapshot) is a flat object of
 * CSS-variable-style overrides. We don't pull from `var(...)` here because
 * the consuming app may not have Lumen's stylesheet loaded; instead, we
 * expose two shapes:
 *
 *   - `lumenChatKitTheme` — the live-token variant. Consume INSIDE an app
 *     that has loaded `@lumen/tokens` so `var(--color-spring-500)` resolves.
 *   - `lumenChatKitThemeResolved` — the literal-hex variant. Consume in
 *     standalone embeds (marketing page, embedded preview) that don't
 *     load the Lumen stylesheet.
 *
 * Both are sourced from the same semantic token graph. Updating
 * `lumenChatKitThemeResolved` is a manual sync from `dist/css/lumen.css`
 * when the brand anchors change.
 *
 * Master doc §7.Phase-5 spec — Phase 5 (this file).
 * Brand anchors verbatim — Spring Green #00FA8A, Obsidian #0D0D0D.
 */

export const lumenChatKitTheme = {
  colorScheme: "dark",
  color: {
    accent: {
      primary: "var(--color-spring-500)", // #00FA8A — action / live / success only
      level: "var(--color-spring-400)", // hover / active glow lift
    },
    background: {
      primary: "var(--color-surface-canvas)", // #0D0D0D obsidian canvas
      secondary: "var(--color-surface-raised)", // raised tile / message bubble
      tertiary: "var(--color-surface-sunken)", // sunken inset (code blocks, system messages)
    },
    text: {
      primary: "var(--color-text-primary)", // #FAFAFA / E6E6E6
      secondary: "var(--color-text-secondary)", // muted prose
      tertiary: "var(--color-text-tertiary)", // metadata, labels
      onAccent: "var(--color-accent-fg)", // #07120D — the AAA-contrast text on Spring Green
    },
    border: {
      hairline: "var(--color-border-hairline)", // 6% white whisper
      default: "var(--color-border-default)",
      strong: "var(--color-border-strong)",
      frame: "var(--color-border-frame)", // brutalist hairline
      accent: "var(--color-border-accent)", // focused-on-action ring
    },
    status: {
      danger: "var(--color-status-danger-500)", // lumen-red
      warning: "var(--color-status-warning-500)", // lumen-amber
      success: "var(--color-spring-500)", // Spring Green doubles as success
    },
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    full: "var(--radius-full)",
  },
  density: "compact" as const, // operator-density default; switch to "comfortable" for marketing surfaces
  typography: {
    fontFamily: "var(--font-sans)", // Satoshi
    fontFamilyMono: "var(--font-mono)", // Geist Mono fallback
    fontSize: {
      xs: "var(--font-size-xs)",
      sm: "var(--font-size-sm)",
      base: "var(--font-size-base)",
      lg: "var(--font-size-lg)",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      base: 1.5,
      relaxed: 1.625,
    },
    featureSettings: {
      tabularNumerals: '"tnum" on, "lnum" on', // numeric data alignment
    },
  },
  motion: {
    durationFast: "var(--motion-duration-fast)", // 140ms
    durationBase: "var(--motion-duration-base)", // 200ms
    easingStandard: "var(--motion-easing-standard)", // cubic-bezier(0.2, 0, 0, 1)
    // Reduced-motion is consumer-side: ChatKit honors prefers-reduced-motion
    // automatically; the theme doesn't need to specify a fallback.
  },
  shadow: {
    card: "var(--shadow-card)",
    popover: "var(--shadow-popover)",
    focus: "var(--shadow-focus)",
    glowAccent: "var(--shadow-glow-accent)", // 3-layer Spring Green signature
  },
} as const;

/**
 * Literal-hex variant for standalone embeds where Lumen tokens may not be
 * loaded as CSS variables. KEEP IN SYNC with `dist/css/lumen.css` when the
 * brand anchors change. The audit-tokens lint exempts this file (the
 * literals are intentional bridge-to-third-party-tool values).
 *
 * Last synced: 2026-05-17 against v0.13.0 brand anchors.
 */
export const lumenChatKitThemeResolved = {
  colorScheme: "dark",
  color: {
    accent: {
      primary: "#00FA8A", // Spring Green
      level: "#1AFD9A", // spring-400 hover lift
    },
    background: {
      primary: "#0D0D0D", // Obsidian canvas
      secondary: "#171717", // raised tile (obsidian-900)
      tertiary: "#080808", // sunken (obsidian-1000)
    },
    text: {
      primary: "#FAFAFA", // paper
      secondary: "#A3A3A3", // muted
      tertiary: "#737373", // labels
      onAccent: "#07120D", // AAA-contrast on Spring Green
    },
    border: {
      hairline: "rgba(255, 255, 255, 0.06)", // 6% white whisper
      default: "rgba(255, 255, 255, 0.12)",
      strong: "rgba(255, 255, 255, 0.24)",
      frame: "rgba(255, 255, 255, 0.18)",
      accent: "#00FA8A",
    },
    status: {
      danger: "#FF4D4F", // lumen-red-500
      warning: "#FFB020", // lumen-amber-500
      success: "#00FA8A", // Spring Green doubles as success
    },
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  density: "compact" as const,
  typography: {
    fontFamily:
      '"Satoshi", "Geist", "InterVariable", system-ui, -apple-system, sans-serif',
    fontFamilyMono: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
    fontSize: { xs: "11px", sm: "12px", base: "14px", lg: "16px" },
    fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeight: { tight: 1.2, base: 1.5, relaxed: 1.625 },
    featureSettings: { tabularNumerals: '"tnum" on, "lnum" on' },
  },
  motion: {
    durationFast: "140ms",
    durationBase: "200ms",
    easingStandard: "cubic-bezier(0.2, 0, 0, 1)",
  },
  shadow: {
    card: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    popover:
      "0 10px 30px -8px rgba(0, 0, 0, 0.55), 0 4px 12px -4px rgba(0, 0, 0, 0.4)",
    focus: "0 0 0 4px rgba(0, 250, 138, 0.25)",
    glowAccent:
      "0 0 0 1px rgba(0, 250, 138, 0.40), 0 0 12px 0 rgba(0, 250, 138, 0.30), 0 0 28px 4px rgba(0, 250, 138, 0.18)",
  },
} as const;

export type LumenChatKitTheme = typeof lumenChatKitTheme;
export type LumenChatKitThemeResolved = typeof lumenChatKitThemeResolved;

/**
 * Helper: build a single CSS variable injection block for environments that
 * want to scope the Lumen theme inline (e.g., into a shadow root or
 * standalone HTML embed).
 *
 * Returns a CSS string of `:root { --… }` declarations using the resolved
 * (literal-hex) values. Use only when the Lumen stylesheet isn't loaded.
 */
export function lumenChatKitCssVariables(): string {
  const t = lumenChatKitThemeResolved;
  return `:root {
  --color-spring-500: ${t.color.accent.primary};
  --color-spring-400: ${t.color.accent.level};
  --color-surface-canvas: ${t.color.background.primary};
  --color-surface-raised: ${t.color.background.secondary};
  --color-surface-sunken: ${t.color.background.tertiary};
  --color-text-primary: ${t.color.text.primary};
  --color-text-secondary: ${t.color.text.secondary};
  --color-text-tertiary: ${t.color.text.tertiary};
  --color-accent-fg: ${t.color.text.onAccent};
  --color-border-hairline: ${t.color.border.hairline};
  --color-border-default: ${t.color.border.default};
  --color-border-strong: ${t.color.border.strong};
  --color-border-frame: ${t.color.border.frame};
  --color-border-accent: ${t.color.border.accent};
  --color-status-danger-500: ${t.color.status.danger};
  --color-status-warning-500: ${t.color.status.warning};
  --radius-sm: ${t.radius.sm};
  --radius-md: ${t.radius.md};
  --radius-lg: ${t.radius.lg};
  --radius-xl: ${t.radius.xl};
  --radius-full: ${t.radius.full};
  --font-sans: ${t.typography.fontFamily};
  --font-mono: ${t.typography.fontFamilyMono};
  --motion-duration-fast: ${t.motion.durationFast};
  --motion-duration-base: ${t.motion.durationBase};
  --motion-easing-standard: ${t.motion.easingStandard};
  --shadow-card: ${t.shadow.card};
  --shadow-popover: ${t.shadow.popover};
  --shadow-focus: ${t.shadow.focus};
  --shadow-glow-accent: ${t.shadow.glowAccent};
}`;
}
