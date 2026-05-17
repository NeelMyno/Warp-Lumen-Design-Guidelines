# cli-go-reference — Lumen v0.13 Go CLI reference

> A `warp quote --interactive` mock TUI rendered with Charm's [Lipgloss](https://github.com/charmbracelet/lipgloss) + [Bubbletea](https://github.com/charmbracelet/bubbletea). Three surfaces: stat, primary button, card. Demonstrates the CLI contract from [`design-system/04-platforms/cli.md`](../../design-system/04-platforms/cli.md).

## What this proves

- **Adaptive color** — `lipgloss.AdaptiveColor{Light, Dark}` auto-renders the right palette based on terminal background detection.
- **Capability fallback** — `lipgloss.CompleteColor{TrueColor, ANSI256, ANSI}` degrades from 16M → 256 → 16 colors as the terminal capability degrades.
- **Hard rule 9** — `PrimaryBadge` is `PrimaryFg` (`#07120D`) on `AccentSpring` (`#00FA8A`), never white.
- **`.lumen-label` translation** — bold + uppercase + space-separated characters approximates the `letter-spacing: 0.16em` tracking on the web.
- **Pipe-friendly fallback** — when stdout isn't a TTY (output piped to another command or written to a file), the program emits the final state and exits. No Bubbletea event loop, no animation gibberish.
- **`NO_COLOR` honored** — Lipgloss respects the env var automatically; setting `NO_COLOR=1 ./cli-go-reference` renders plain text.

## Build & run

```bash
cd examples/cli-go-reference
go mod tidy        # resolve charmbracelet deps
go run .           # interactive Bubbletea TUI

# Pipe-friendly mode:
go run . | cat     # emits final state to the pipe, no TUI

# No-color mode:
NO_COLOR=1 go run .
```

Requires Go 1.22+. The Charm dependencies (`bubbletea`, `lipgloss`) are MIT-licensed and pull in cleanly via `go mod`.

## Interactive walkthrough

The TUI cycles through three surfaces on ENTER:

1. **Quote card** — the full Lumen card composing all three surfaces: header label, stat (rate per pallet), carrier line, primary button.
2. **Stat row** — three stacked Lumen stats (`Stat`-equivalent on terminal).
3. **Action row** — primary button + LiveDot-equivalent ("● LIVE" with accent color).

Press `q` or Ctrl+C to exit.

## What's NOT in this reference

- **Real API integration.** The reference is static — no network calls. Real `warp quote` hits `https://api.warp.dev/v1/quote`.
- **harmonica spring animations.** Spring motion is overkill for a static CLI surface; documented in [`design-system/04-platforms/cli.md`](../../design-system/04-platforms/cli.md) §5 with concrete patterns.
- **Token regeneration script.** The Lumen token subset is vendored in `lumen/theme.go`. Production builds would regenerate this from `dist/json/tokens.json` via a `go generate` step.

## Files

```
cli-go-reference/
├── README.md
├── go.mod
├── main.go               # Bubbletea program + three surfaces
└── lumen/
    └── theme.go          # Vendored Lumen v0.13 token subset
```

## Related

- [`../cli-node-reference/`](../cli-node-reference/) — paired Node/Ink reference.
- [`../../design-system/04-platforms/cli.md`](../../design-system/04-platforms/cli.md) — full CLI translation guide.
- [Charm Lipgloss](https://github.com/charmbracelet/lipgloss).
- [Charm Bubbletea](https://github.com/charmbracelet/bubbletea).
