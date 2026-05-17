---
name: CLI / TUI (Go-Lipgloss · Node-Ink)
type: platform-guide
platform: cli
runtime: Go 1.22+ with Charm Lipgloss · Node 20+ with Ink v5+
lumen_version: 0.13.0
last_updated: 2026-05-17
status: stable
related: [./web.md, ../00-foundations/voice-and-tone.md]
---

# CLI / TUI — Lumen v0.13 platform guide

> Lumen translates into the terminal in two parallel idioms: Go with Charm's Lipgloss + Bubbletea, and Node with Ink. Both paths render Lumen's hierarchy via Bold / Italic / Underline / Faint / Reverse — the terminal has no glass, no mesh, no gradient. Color goes through the terminal's ANSI palette; depth comes from layout and density.

## 1. What this platform is

The CLI is **operator-density taken to its extreme** — a single SSH session, no GUI, the dispatcher who lives in tmux. The Warp products that live here:

- **`warp` CLI** — `warp quote LAX SFO 12pallets`, `warp book <quote-id>`, `warp track <bol>`. JSON-in JSON-out for piping into scripts. ~70% of CLI surface area.
- **`warp tui`** — interactive Bubbletea / Ink TUI for browsing shipments, lanes, rates. A full Lumen dashboard rendered in the terminal.
- **`warp dispatch`** — long-running dispatcher view: shipment table that updates live, ETA columns scrolling like a flight board.
- **`warp prep`** — pre-flight checklist for dispatchers — terminal-native onboarding for new ops staff.

The runtime split (Go vs Node):
- **Go path** — built-in users of Charm stack. Static-binary distribution; works on every laptop, every server, every Docker image. Default for the `warp` binary.
- **Node path** — Node-fluent users; aligns with the JS-heavy Warp engineering culture. Distribution via npm (`npm install -g @warp/cli`). Lower binary size, easier hot-reload during dev.

## 2. Token mapping table

**Critical translation:** the terminal has no concept of `surface.glass`, no concept of `radius.lg`, no concept of `motion.spring.default`. The translation collapses Lumen's full token graph to the terminal's expressive surface area: foreground / background color + Bold / Italic / Underline / Faint / Reverse + Rounded / Normal / Thick border.

### Go — Lipgloss

```go
package lumen

import (
    "github.com/charmbracelet/lipgloss"
)

var (
    // Adaptive colors — read the terminal's dark/light bg detection.
    // CompleteColor falls back from Truecolor → 256 → 16 → 8 as the
    // terminal capability degrades.
    SurfaceCanvas = lipgloss.AdaptiveColor{
        Light: "#FAFAFA",  // paper anchor
        Dark:  "#0D0D0D",  // obsidian
    }
    SurfaceRaised = lipgloss.AdaptiveColor{
        Light: "#F1F1F1",
        Dark:  "#171717",
    }
    SurfaceSunken = lipgloss.AdaptiveColor{
        Light: "#E8E8E8",
        Dark:  "#0A0A0A",
    }
    TextPrimary = lipgloss.AdaptiveColor{
        Light: "#0D0D0D",
        Dark:  "#FAFAFA",
    }
    TextSecondary = lipgloss.AdaptiveColor{
        Light: "#404040",
        Dark:  "#A6A6A6",
    }
    TextTertiary = lipgloss.AdaptiveColor{
        Light: "#737373",
        Dark:  "#737373",
    }
    AccentSpring = lipgloss.CompleteColor{
        TrueColor: "#00FA8A",
        ANSI256:   "120",     // closest 256-color match
        ANSI:      "10",      // bright green
    }
    BorderDefault = lipgloss.AdaptiveColor{
        Light: "#D1D1D1",
        Dark:  "#2E2E2E",
    }
    BorderAccent = AccentSpring
    StatusSuccess = AccentSpring
    StatusWarning = lipgloss.CompleteColor{
        TrueColor: "#FBC11C",
        ANSI256:   "220",
        ANSI:      "11",
    }
    StatusDanger = lipgloss.CompleteColor{
        TrueColor: "#FF4D4D",
        ANSI256:   "203",
        ANSI:      "9",
    }
)

// Lumen style primitives
var (
    StylePrimary = lipgloss.NewStyle().
        Bold(true).
        Foreground(lipgloss.Color("#07120D")).  // action-primary-fg
        Background(AccentSpring).
        Padding(0, 2)

    StyleCard = lipgloss.NewStyle().
        Background(SurfaceRaised).
        Foreground(TextPrimary).
        Border(lipgloss.RoundedBorder()).
        BorderForeground(BorderDefault).
        Padding(1, 2)

    StyleLumenLabel = lipgloss.NewStyle().
        Bold(true).
        Foreground(TextTertiary).
        // Spaced uppercase for the .lumen-label feel
        Transform(func(s string) string { return strings.ToUpper(s) })

    StyleLumenMono = lipgloss.NewStyle().
        Foreground(TextPrimary)  // tnum/lnum baked into the terminal font
)
```

### Node — Ink

```tsx
// src/lib/lumen-theme.ts
export const LumenTheme = {
    color: {
        surfaceCanvas: process.env.LUMEN_DARK ? '#0D0D0D' : '#FAFAFA',
        surfaceRaised: process.env.LUMEN_DARK ? '#171717' : '#F1F1F1',
        textPrimary: process.env.LUMEN_DARK ? '#FAFAFA' : '#0D0D0D',
        textSecondary: process.env.LUMEN_DARK ? '#A6A6A6' : '#404040',
        textTertiary: '#737373',
        accent: '#00FA8A',
        statusWarning: '#FBC11C',
        statusDanger: '#FF4D4D',
    },
} as const;

// Ink uses chalk under the hood; chalk auto-degrades from
// Truecolor → 256 → 16 based on terminal capability.
```

### Token category translation summary

| Lumen token category | CLI translation |
|---|---|
| Surface color | Foreground / Background color on a styled string. Adaptive (Light/Dark) auto-detected. |
| Border / Radius | `RoundedBorder()` / `NormalBorder()` / `ThickBorder()` from Lipgloss; characters from Ink's `<Box borderStyle>`. `radius.*` collapses to "rounded vs normal vs none". |
| Elevation (shadow.*) | **Not translatable.** Terminals have no z-axis. Use density (padding + border) to imply hierarchy. |
| Motion | **Mostly not translatable.** Bubbletea supports state-machine animation via `harmonica` for springs, but most CLI moments are instant. Reserved for long-running views (a refresh ticker). |
| Typography | Terminal font is fixed. Lumen's `.lumen-mono` is implicit (the terminal IS mono). Hierarchy via Bold / Italic / Underline / Faint. |
| Glass / mesh / noise | **Not translatable.** Drop entirely. |
| Status colors | Pair-only via Foreground/Background composition. Lumen rules carry: status never alone — always with a label. |

## 3. Identity budget

**Lumen claim: ~50% of pixel surface inside the terminal.** What the terminal owns:

- **Terminal chrome** (~30%): the terminal emulator's title bar, scrollbar, tab strip — Lumen doesn't paint these.
- **Cursor and selection** (~5%): user-controlled.
- **Shell prompt** (~10%): the user's `PS1` / `$PROMPT` lives above (or below) Lumen output.
- **Scroll buffer history** (~5%): past output the user can scroll back into.

The 50% is the immediate output region — the rectangle Lumen renders into during the active command or TUI session.

## 4. Glass / blur translation

**Not applicable.** Terminals have no transparency, no blur. The closest analogue is using a Faint style (`Faint(true)` in Lipgloss / `<Text dimColor>` in Ink) to suggest visual recession. Use Faint for secondary metadata; reserve normal weight for primary content.

## 5. Motion translation

### Go — Bubbletea + harmonica

```go
import "github.com/charmbracelet/harmonica"

// Lumen's default spring (k=280, d=28, m=1) translated to harmonica
spring := harmonica.NewSpring(harmonica.FPS(60), 6.0, 0.85)
// Note: harmonica uses (angularFrequency, dampingRatio).
// Lumen default at 60fps approximates: angularFrequency ~6.0, dampingRatio 0.85.
```

Common moments to animate in a TUI:
- **Tab switch** — slide between tabs with a 200ms decelerate ease (collapse to instant under reduce-motion-equivalent: when stdout is not a TTY).
- **Progress bar fill** — `motion.duration.base` linear interpolation.
- **Number tick-up on success** — counter increment over 320ms decelerate ease.

### Node — Ink

Ink supports state-driven re-renders. Use `setInterval` or `requestAnimationFrame` (which Ink polyfills) to drive animations. Or use `framer-motion` style libraries like `react-spring` adapted for terminal output (rare).

```tsx
import { useEffect, useState } from 'react';
import { Text } from 'ink';

function Counter({ target }: { target: number }) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const start = Date.now();
        const duration = 320;
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const t = Math.min(elapsed / duration, 1);
            // decelerate easing
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(target * eased));
            if (t >= 1) clearInterval(interval);
        }, 16);
        return () => clearInterval(interval);
    }, [target]);
    return <Text bold>{value}</Text>;
}
```

### Reduce-motion-equivalent

The terminal has no `prefers-reduced-motion` signal. Use these heuristics:

1. **`process.stdout.isTTY === false`** → output is being piped. Skip all animation; emit final state only.
2. **`process.env.CI === 'true'`** → CI environment. Skip animation.
3. **`process.env.NO_COLOR` is set or `process.env.LUMEN_NO_MOTION` is set** → user opted out. Respect.

```ts
const reduceMotion = !process.stdout.isTTY ||
    process.env.CI === 'true' ||
    process.env.NO_COLOR ||
    process.env.LUMEN_NO_MOTION;
```

When reduceMotion fires, skip the animation and render the final state immediately.

## 6. Typography translation

### Terminal font

The user's terminal font is **fixed** — it's whatever they configured. Lumen doesn't override. Most users run a monospace font (JetBrains Mono, MesloLGS NF, Cascadia Code) — Lumen `.lumen-mono` is implicit.

### OpenType features

Terminal fonts vary on OpenType support. `tnum`, `lnum`, `zero` work on most modern terminal fonts (Fira Code, JetBrains Mono, Cascadia Code) but Lumen has no way to enforce them. Best practice: document the recommended terminal font (`JetBrains Mono with calt off, zero slashed`) but don't fail if the user has a different setup.

### Hierarchy

Use the terminal's expressive primitives:

| Lumen role | Terminal mechanism |
|---|---|
| Heading | Bold + uppercase + tracking-equivalent (spaced characters) |
| Body | Normal weight, default color |
| Secondary | Faint or 70% color |
| Tertiary | Faint |
| Accent | Bold + accent color (Spring Green on supported terminals) |
| Italic accent word | Italic (when terminal supports it — most modern emulators do) |
| Disabled | Faint + Strikethrough |
| `.lumen-label` (mono-uppercase tracked) | Bold + Uppercase + space-separated characters |

```go
// Lipgloss .lumen-label translation
label := lipgloss.NewStyle().Bold(true).Foreground(LumenTextTertiary).Render(
    strings.ToUpper(strings.Join(strings.Split("on time", ""), " "))
)
// Output: "O N   T I M E"
```

## 7. Specific don'ts (CLI Lumen Law)

- **Don't paint colors when `NO_COLOR` is set.** This is the canonical opt-out signal across CLI tooling. Honor it.
- **Don't ANSI-paint stderr.** stderr is for errors and warnings; users frequently pipe stderr separately. Keep stderr Lumen-voiced but plain-text.
- **Don't use Faint as the only mechanism to convey disabled state.** Some terminals don't render Faint visibly. Combine with Strikethrough or `[disabled]` label suffix.
- **Don't render emoji as primary information.** Some terminals lack emoji fonts. Use Lumen's `.lumen-label` style + status text instead of emoji + text.
- **Don't animate when `stdout.isTTY === false`.** Output is being captured / piped — animations create gibberish.
- **Don't use `cursor.hide()` without `cursor.show()` on exit.** A common Bubbletea / Ink mistake; if the program crashes, the user's cursor is permanently invisible.
- **Don't ship `chalk.bgGreen()` as the success color.** That's standard 16-color green, not Spring Green. Use Lipgloss `CompleteColor` or chalk `hex('#00FA8A')` so the renderer picks the right terminal palette match.
- **Don't render dense data tables with `RoundedBorder` between every cell.** Same legibility cliff — chrome-heavy borders fight content. Use a thin top + bottom separator only.
- **Don't emit raw JSON when `stdout.isTTY === true`.** Format for human reading by default; `--json` flag (or piped stdout) switches to raw JSON. Pipe-friendly + human-friendly.

## 8. Reference snippets

### Go — primary button equivalent (Lipgloss styled call-to-action label)

```go
package main

import (
    "fmt"
    "github.com/charmbracelet/lipgloss"
)

var (
    AccentSpring = lipgloss.CompleteColor{TrueColor: "#00FA8A", ANSI256: "120", ANSI: "10"}
    PrimaryFg    = lipgloss.Color("#07120D")

    PrimaryBadge = lipgloss.NewStyle().
        Bold(true).
        Foreground(PrimaryFg).
        Background(AccentSpring).
        Padding(0, 2)
)

func main() {
    fmt.Println(PrimaryBadge.Render(" BOOK SHIPMENT  →"))
}
```

### Go — Stat (the Lumen signature)

```go
package main

import (
    "fmt"
    "strings"
    "github.com/charmbracelet/lipgloss"
)

func RenderStat(value, label, unit string) string {
    valueStyle := lipgloss.NewStyle().Bold(true).Foreground(TextPrimary)
    unitStyle  := lipgloss.NewStyle().Foreground(TextTertiary)
    labelStyle := lipgloss.NewStyle().
        Bold(true).
        Foreground(TextTertiary).
        Transform(func(s string) string {
            return strings.ToUpper(s)
        })

    line1 := lipgloss.JoinHorizontal(
        lipgloss.Bottom,
        valueStyle.Render(value),
        " ",
        unitStyle.Render(unit),
    )
    line2 := labelStyle.Render(label)
    return lipgloss.JoinVertical(lipgloss.Left, line1, line2)
}

func main() {
    fmt.Println(RenderStat("98.2%", "On-Time Delivery", ""))
}
```

### Go — Card surface

```go
var Card = lipgloss.NewStyle().
    Background(SurfaceRaised).
    Foreground(TextPrimary).
    Border(lipgloss.RoundedBorder()).
    BorderForeground(BorderDefault).
    Padding(1, 2).
    Width(40)

func main() {
    content := lipgloss.JoinVertical(lipgloss.Left,
        RenderStat("$2,840", "QUOTE · LAX→SFO · 12 PALLETS", ""),
        "",
        lipgloss.NewStyle().Foreground(TextSecondary).Render("Estes · 2 days · 98.2% OTD"),
    )
    fmt.Println(Card.Render(content))
}
```

A complete Go reference CLI (Bubbletea + Lipgloss) with these three surfaces lives at [`examples/cli-go-reference/`](../../examples/cli-go-reference/). Run with `go run .`.

### Node — Primary button (Ink + chalk)

```tsx
// src/PrimaryButton.tsx
import React from 'react';
import { Box, Text } from 'ink';

export const PrimaryButton: React.FC<{ label: string }> = ({ label }) => (
    <Box paddingX={2} flexDirection="row">
        <Text bold color="#07120D" backgroundColor="#00FA8A">
            {` ${label}  → `}
        </Text>
    </Box>
);
```

### Node — Stat

```tsx
import React from 'react';
import { Box, Text } from 'ink';

export const Stat: React.FC<{ value: string; label: string; unit?: string }> = ({
    value,
    label,
    unit,
}) => (
    <Box flexDirection="column">
        <Box flexDirection="row" alignItems="flex-end">
            <Text bold color="white">{value}</Text>
            {unit && <Text color="gray">  {unit}</Text>}
        </Box>
        <Text bold color="gray">
            {label.toUpperCase().split('').join(' ')}
        </Text>
    </Box>
);
```

### Node — Card

```tsx
import React from 'react';
import { Box, Text } from 'ink';
import { Stat } from './Stat';

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={2}
        paddingY={1}
        width={50}
    >
        {children}
    </Box>
);

// Usage:
export const App: React.FC = () => (
    <Card>
        <Stat value="$2,840" label="Quote · LAX→SFO · 12 pallets" />
        <Box marginTop={1}>
            <Text color="gray">Estes · 2 days · 98.2% OTD</Text>
        </Box>
    </Card>
);
```

A complete Node Ink reference CLI lives at [`examples/cli-node-reference/`](../../examples/cli-node-reference/). Run with `pnpm install && pnpm start`.

## Related

- [`./web.md`](./web.md) — Lumen on web, the comparison surface.
- [`../00-foundations/voice-and-tone.md`](../00-foundations/voice-and-tone.md) — CLI is operator-density at its purest; voice matters more here than anywhere.
- [`../../examples/cli-go-reference/`](../../examples/cli-go-reference/) and [`../../examples/cli-node-reference/`](../../examples/cli-node-reference/) — paired reference CLIs.
- [Charm Lipgloss](https://github.com/charmbracelet/lipgloss).
- [Ink](https://github.com/vadimdemedes/ink).
