# cli-node-reference — Lumen v0.13 Node CLI reference

> A `warp quote` mock TUI rendered with [Ink](https://github.com/vadimdemedes/ink) (React for terminals) + chalk. Three surfaces: stat, primary button, card. Demonstrates the CLI contract from [`design-system/04-platforms/cli.md`](../../design-system/04-platforms/cli.md).

## What this proves

- **Ink works inside the Lumen contract.** React component model — `<Stat>`, `<PrimaryButton>`, `<Card>`, `<LiveDot>` — translates the web component graph to terminal output. Same JSX shape, terminal output.
- **Hard rule 9** — `<PrimaryButton>` paints `LumenTheme.color.primaryFg` (`#07120D`) on `LumenTheme.color.accent` (`#00FA8A`). Never white.
- **`.lumen-label` translation** — `lumenLabel()` uppercases + space-separates characters to approximate `letter-spacing: 0.16em`.
- **Pipe-friendly fallback** — when `stdout.isTTY === false` or `CI === "true"`, emit plain text. No Ink render, no animation gibberish.
- **`NO_COLOR` honored** — chalk respects the env var automatically.
- **Border + padding** — Ink's `<Box borderStyle="round">` maps to Lumen's card surface (`surface.raised` + hairline border + padding).

## Build & run

```bash
cd examples/cli-node-reference
pnpm install
pnpm build        # compile src/ → dist/
pnpm start        # compile + run

# Pipe-friendly mode:
pnpm start | cat  # emits final state to the pipe

# No-color mode:
NO_COLOR=1 pnpm start
```

Requires Node 20+. The reference uses Ink 5.x and chalk 5.x — both ESM-only, hence `"type": "module"` in `package.json`.

## Interactive walkthrough

Press ENTER to cycle through three surfaces:

1. **Quote card** — full Lumen card composing all three surfaces: header label, stat (rate per pallet), carrier line, primary button.
2. **Stat stack** — three vertically-stacked Lumen stats.
3. **Action + status** — primary button + LiveDot-equivalent + ETA prose.

Press `q` or Ctrl+C to exit.

## What's NOT in this reference

- **Real API integration.** Static mock data — no network calls.
- **Animated counters.** The CLI MD §5 documents the cubic-ease counter pattern but the reference renders static values. Run-time interpolation works but isn't exercised here.
- **OpenType feature flags.** Terminal fonts vary in OpenType support; the reference doesn't enforce. Document the recommended terminal font (`JetBrains Mono with calt off`, etc.) in your own user-facing CLI docs.

## Files

```
cli-node-reference/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── index.tsx           # Ink app + three surfaces + pipe-friendly fallback
    └── lumen-theme.ts      # Vendored Lumen v0.13 token subset
```

## Related

- [`../cli-go-reference/`](../cli-go-reference/) — paired Go/Lipgloss reference (same surfaces, different runtime).
- [`../../design-system/04-platforms/cli.md`](../../design-system/04-platforms/cli.md) — full CLI translation guide.
- [Ink](https://github.com/vadimdemedes/ink) — React for terminals.
- [chalk](https://github.com/chalk/chalk) — terminal color library.
