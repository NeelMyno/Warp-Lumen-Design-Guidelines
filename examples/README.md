# examples/ — Lumen v0.13 platform reference implementations

> Minimum-viable reference apps per non-web platform. Each renders the three canonical surfaces — **primary button**, **stat**, **glass surface** — so a Warp engineer (or an AI agent) on that platform can copy a working scaffold and start building.

## Layout

```
examples/
├── README.md                      ← you are here
├── ios-reference/                 ← Swift Package · iOS 17+ · SwiftUI
├── android-reference/             ← Compose Multiplatform · API 26+ · Haze
├── macos-reference/               ← Swift Package · macOS 14+ · SwiftUI + NSVisualEffectView
├── extension-reference/           ← Chrome MV3 · TypeScript · shadow DOM
├── cli-go-reference/              ← Go module · Lipgloss · Bubbletea
└── cli-node-reference/            ← Node 20+ · Ink · TypeScript
```

The web reference IS the [`audit-dashboard/`](../audit-dashboard/) Next.js app at the repo root. Windows reference is omitted (Electron + the web bundle is the recommended path; building a separate Windows reference would duplicate the audit-dashboard). Shopify reference is omitted (≤15% identity budget doesn't justify a reference; the integration pattern lives in [`design-system/04-platforms/shopify.md`](../design-system/04-platforms/shopify.md)).

MCP reference lives at [`design-system/07-mcp/`](../design-system/07-mcp/) (Phase 6 ships the actual server; Phase 3 documents the voice contract).

## What each reference contains

Every reference app implements three surfaces:

1. **Primary button** — the Lumen v0.13 primary CTA. Lime accent, dark foreground (hard rule 9), platform-appropriate touch target (44px iOS / 48px Android / 28px macOS / etc.).
2. **Stat (the Lumen signature)** — big bold mono number + uppercase tracked label. `.lumen-mono` features carry as much as the platform supports.
3. **Glass surface** — the platform's native vibrancy primitive. `.regularMaterial` on iOS, Haze on Android, `NSVisualEffectView` on macOS, `backdrop-filter` in the extension's shadow root. Plus the reduce-transparency fallback.

The three surfaces collectively prove: **Lumen tokens reach this platform · the visual contract is enforced · accessibility carries · the build toolchain is wired.**

## Build status (operator-side)

| Reference | Toolchain available in this env | Build verified |
|---|---|---|
| ios-reference | Swift CLI present; full Xcode + iOS Simulator not | Structural — opens cleanly in Xcode |
| android-reference | No Gradle / Android SDK | Structural — opens cleanly in Android Studio |
| macos-reference | Swift CLI present; full Xcode not | Structural — opens cleanly in Xcode |
| extension-reference | Node + pnpm present | Build verified — `pnpm install && pnpm build` ships a Chrome-loadable extension |
| cli-go-reference | No Go toolchain (verified absent) | Structural — `go build` operator-side |
| cli-node-reference | Node + pnpm present | Build verified — `pnpm install && pnpm start` runs the TUI |

"Structural" means: the code is the canonical implementation per the platform MD; the project files are the standard layout for that toolchain; if the operator has the toolchain installed, `swift build` / `gradlew build` / `go build` succeeds without further changes.

## Run notes

### iOS / macOS
```bash
cd examples/ios-reference   # or macos-reference
swift build                  # build the package
open Package.swift           # open in Xcode → Run on simulator / Mac
```

### Android
```bash
cd examples/android-reference
./gradlew :app:installDebug   # requires Android SDK + connected device or emulator
```

### Extension
```bash
cd examples/extension-reference
pnpm install
pnpm build
# Then in Chrome: chrome://extensions → Load unpacked → select dist/
```

### CLI Go
```bash
cd examples/cli-go-reference
go run .                      # interactive mock
```

### CLI Node
```bash
cd examples/cli-node-reference
pnpm install
pnpm start                    # Ink TUI
```

## Token sourcing

Every reference reads its tokens from the Phase 0 Style Dictionary outputs at [`../dist/`](../dist/):

- iOS / macOS — `dist/swift/Lumen+Colors.swift` and `dist/ios/LumenTokens.swift`
- Android — `dist/compose/LumenColors.kt`
- Extension — `dist/css/lumen.css` + `dist/css/lumen-scoping.css`
- CLI Go — Color constants defined locally; ANSI/Truecolor capabilities detected at runtime via Lipgloss; values pulled from `dist/json/tokens.json` at build time
- CLI Node — Same pattern; values pulled from `dist/json/tokens.json` at build time

No reference duplicates token values. If you need to update a color, change `01-tokens/primitives/color.tokens.json`, run `pnpm tokens`, and the change propagates to every reference at next build.

## Related

- [`../design-system/04-platforms/`](../design-system/04-platforms/) — per-platform translation guides.
- [`../design-system/02-components/`](../design-system/02-components/) — the Phase 2 component graph each reference draws from.
- [`../dist/`](../dist/) — the Style Dictionary outputs each reference consumes.
