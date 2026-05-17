# PHASE 3 — Platform Translations

Execute master doc §7.Phase-3. Master doc is canonical; this prompt adds execution-level detail per platform.

## What this phase ships

A platform translation guide (`04-platforms/<platform>.md`) for every target platform, plus a minimal reference implementation per platform (where feasible). After this phase, an engineer building a new Lumen-themed app on iOS / Android / macOS / Windows / Shopify / extension / CLI knows exactly which Lumen tokens map to which platform API, what's lost in translation, and what's added by platform-specific affordances.

## Technical pins

| Platform | Library / Version | Why |
|---|---|---|
| iOS | SwiftUI on iOS 17+, Swift 5.10+ | `.regularMaterial`, `.thickMaterial` glass primitives; `accessibilityReduceTransparency` and `accessibilityReduceMotion` are first-class |
| Android | Jetpack Compose latest stable + `dev.chrisbanes:haze:1.x` | `Modifier.hazeSource` / `Modifier.hazeEffect` for backdrop blur (Android's `Modifier.blur` blurs the element not the backdrop and is API 31+ only) |
| macOS | SwiftUI on macOS 14+, `NSVisualEffectView` bridge via `NSViewRepresentable` | `material: .hudWindow`, `.popover`, `.sidebar`, `.contentBackground` |
| Windows | WinUI 3 + Microsoft.UI.Composition `AcrylicBrush`; Electron 30+ with `vibrancy: 'acrylic'` BrowserWindow option | Native Mica/Acrylic for WinUI apps; Electron path for cross-platform Lumen apps |
| Shopify | Polaris GA stable (October 1, 2025+), App Bridge latest, web components from `https://cdn.shopify.com/shopifycloud/polaris.js` | Polaris React is in maintenance; web components are the path forward |
| Browser Extension | Manifest V3, shadow DOM scoping | Content script CSS isolation |
| CLI (Go) | Charm `lipgloss`, `bubbletea`, `harmonica` | Adaptive color, spring animation, Rounded border styling |
| CLI (Node) | `ink` v5+, Yoga Flexbox, `chalk` | React for terminals |
| MCP | TypeScript SDK `@modelcontextprotocol/sdk` latest | Voice & tone for tool names / descriptions only — no UI |

## Per-platform deliverable shape

Every `04-platforms/<platform>.md` file has the same sections in the same order:

1. **What this platform is** — one paragraph naming the runtime, the target version, and what Warp products run on it.
2. **Token mapping table** — for every Lumen semantic token category (surface, text, border, action, motion, elevation), name the platform API equivalent. If a token has no equivalent, name what falls back.
3. **Identity budget** — what percentage of pixel surface Lumen can realistically claim on this platform, and what claims it. Honest.
4. **Glass / blur translation** — exactly how glass surfaces translate, what blur radius maps to which native primitive, and what happens when transparency is reduced at the OS level.
5. **Motion translation** — how Lumen's 5 durations + 6 easings + 2 springs map to the platform's animation primitives.
6. **Typography translation** — how Satoshi is loaded, how `tnum` / `lnum` / OpenType feature flags carry across, and what platforms can't render Lumen typography fully.
7. **Specific don'ts** — platform-specific Lumen Law translations. ("Don't apply SwiftUI `.regularMaterial` to `List` rows — it kills legibility on dense data, mirroring the web rule about glass on data tables.")
8. **Reference snippets** — at minimum, how to render a primary button, a stat, and a glass surface in the platform's idiom.

## Per-platform execution detail

### `04-platforms/ios.md`

Token map highlights:
- `surface.canvas` → `Color(red: 0.05, green: 0.05, blue: 0.05)` (resolved from obsidian.10 hex); also expose as `Lumen.Color.canvas` static constant in the generated `Lumen+Colors.swift`
- `surface.glass` → `.background(.regularMaterial)` with `.colorScheme(.dark)` modifier
- `surface.glass-strong` → `.background(.thickMaterial)` for sheets and modals
- `surface.popover` → `.background(.ultraThinMaterial)` for hover popovers
- `text.primary` → `.foregroundStyle(.primary)` (SwiftUI handles dark mode automatically)
- `text.accent` → `.foregroundStyle(Lumen.Color.springAccent)`
- `motion.base` (200ms) → `.animation(.easeOut(duration: 0.2), value: state)`
- `motion-spring-default` → `.animation(.spring(response: 0.4, dampingFraction: 0.85), value: state)`
- `border.frame` → `.overlay(RoundedRectangle(cornerRadius: 12).stroke(Lumen.Color.borderFrame, lineWidth: 1))`

Reduce Transparency handling: respect `@Environment(\.accessibilityReduceTransparency) var reduceTransparency`. When true, swap material backgrounds for solid `Lumen.Color.raised` at ≥85% opacity.

Reduce Motion handling: respect `@Environment(\.accessibilityReduceMotion) var reduceMotion`. When true, collapse all spring/easing animations to `.animation(.linear(duration: 0), value: state)`.

Reference implementation: build `examples/ios-reference/` as a Swift package containing a single `LumenReferenceApp.swift` that renders three surfaces — button, stat, glass-popover — using the generated `Lumen+*` extensions from Phase 0's SwiftUI output.

### `04-platforms/android.md`

Token map highlights:
- `surface.canvas` → `Modifier.background(LumenColors.canvas)`
- `surface.glass` → `Modifier.hazeEffect(hazeState) { blurEffect { blurRadius = 20.dp } }` over a `Modifier.hazeSource(hazeState)` on the underlying content
- `surface.glass-strong` → Same Haze pattern with `blurRadius = 28.dp`
- `text.primary` → `LumenColors.textPrimary` Color object
- Motion → Compose `tween(durationMillis = 200, easing = LinearOutSlowInEasing)` for decelerate, custom `CubicBezierEasing` for emphasized
- Spring → `spring(dampingRatio = 0.85f, stiffness = Spring.StiffnessMediumLow)`

Reduce Transparency: read `LocalAccessibilityManager.current.isReduceMotionEnabled` (Compose 1.6+) — note Android lumps reduce-motion and reduce-transparency into one signal on most devices.

Reduce Motion: same signal, collapse to `snap()` animation specs.

Reference implementation: `examples/android-reference/` as a Compose Multiplatform project with the same three surfaces.

Critical don't: `Modifier.blur` is API 31+ only (Android 12+) and blurs the element, not the backdrop. Always use Haze instead. On API 30 and below, glass falls back to solid `LumenColors.raised` at 85% alpha. Document this clearly in the Android MD.

### `04-platforms/macos.md`

Token map highlights:
- `surface.glass` (window chrome) → `NSVisualEffectView` with `material: .hudWindow` bridged via `NSViewRepresentable`
- `surface.glass` (sidebar) → `material: .sidebar`
- `surface.glass-strong` (modal) → `material: .popover`
- `surface.canvas` → standard SwiftUI background; macOS doesn't need vibrancy for canvas
- Reduce Transparency: `NSWorkspace.shared.accessibilityDisplayShouldReduceTransparency` returns true; swap visual effect views for solid backgrounds

Reference implementation: `examples/macos-reference/` as a SwiftUI macOS app project. Reuse the iOS color/font extensions.

### `04-platforms/windows.md`

Token map highlights (WinUI 3 native path):
- `surface.glass` → `AcrylicBrush` with `TintColor` from `LumenColors.surfaceRaised` and `TintOpacity` of 0.5
- `surface.glass-strong` → `AcrylicBrush` with `TintOpacity` of 0.7 for modal surfaces
- Mica background on app shell → `MicaBackdrop` system backdrop

Token map (Electron path — for Warp apps that ship cross-platform via Electron):
- BrowserWindow with `vibrancy: 'acrylic'` on Windows, `vibrancy: 'sidebar'` on macOS
- Reuse the web CSS directly; no separate translation needed

Reference implementation: `examples/windows-reference/` skip native WinUI 3 unless explicitly required by a Warp product. Document the Electron path as the primary recommendation for Windows.

### `04-platforms/shopify.md`

Identity budget: **≤ 15% of pixel surface**. Be honest. Polaris went GA October 1, 2025 with web components delivered from `https://cdn.shopify.com/shopifycloud/polaris.js`. App Bridge surfaces (title bar, nav, save bar, modals, toasts) are Shopify-rendered and unstylable.

What Lumen can claim:
- **Brand voice** — copy, tone, error messages, empty states, onboarding language
- **Iconography** — Lumen's 1.5px stroke icon set, replacing default Polaris icons where Polaris allows custom icon slots
- **Chip / badge accent color** — the Spring Green accent appears on status chips and live badges
- **Onboarding illustration** — full Lumen visual control on first-run flows that occupy the full content area
- **Empty state imagery** — gpt-image-2-generated Lumen illustrations in empty states

What Lumen cannot claim:
- Title bar, navigation chrome, save bar, modals, toasts — these are Shopify
- Form controls — Polaris-rendered, Shopify-styled
- Layout grid — Polaris layout primitives only

Reference implementation: no separate reference; document the Polaris integration pattern in the MD file and link to the Vercel `/commerce` surface page as the canonical example.

### `04-platforms/extension.md`

Browser extension content scripts have CSS bleed problems. Every Lumen rule must be scoped under a shadow root. Pattern:

```ts
// content-script.ts
import { createRoot } from "react-dom/client";

const host = document.createElement("div");
host.id = "lumen-extension-root";
document.body.appendChild(host);

const shadow = host.attachShadow({ mode: "open" });

// Inject Lumen CSS into the shadow root
const style = document.createElement("style");
style.textContent = LUMEN_CSS_TEXT; // bundled at build time
shadow.appendChild(style);

const container = document.createElement("div");
shadow.appendChild(container);

createRoot(container).render(<LumenApp />);
```

CSS reset at the shadow root: `:host { all: initial; }` prevents host-page CSS from leaking into the extension UI.

Token availability: full Lumen tokens work inside the shadow root since CSS variables cross shadow boundaries via inheritance. Glass works. Mesh works in expressive mode.

Reference implementation: `examples/extension-reference/` as a Chrome MV3 extension with a single popup using Lumen tokens.

### `04-platforms/cli.md`

Two paths: Go (Charm libraries) and Node (Ink).

**Go path:**
- `lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#0D0D0D", Dark: "#FAFAFA"})` for text.primary; or `CompleteColor` for ANSI 256 / Truecolor downsampling
- `lipgloss.RoundedBorder()` for card surfaces — terminal equivalent of `surface.raised`
- Hierarchy via `Bold()`, `Italic()`, `Underline()`, `Faint()`, `Reverse()` only — no color hex; the terminal has no concept of mesh or glass
- Spring motion via `harmonica` for any animated state — though most CLI surfaces don't animate
- Mono-uppercase tracked label translates to bold + faint dim with literal spaces between characters

**Node path (Ink):**
- `<Box flexDirection="column">` for layout via Yoga Flexbox
- `<Text bold color={LUMEN.accent}>` consuming the color constants exported from `@warp/lumen/cli`
- The `<Static>` component for output that doesn't need to re-render (e.g., past command output above a live input prompt)

Translation losses to acknowledge:
- No glass, no mesh, no gradients
- Color depth depends on terminal (256-color, truecolor, dim mode for old terminals)
- Animation possible but rarely useful in CLI

Reference implementation: `examples/cli-go-reference/` for Go (a `warp quote --interactive` mock) and `examples/cli-node-reference/` for Ink (same mock surface).

### `04-platforms/mcp-host.md`

No UI. The "platform" is the MCP server's tool naming and tool descriptions, which still carry Lumen voice.

Translation rules:
- Tool names follow `verb_noun` pattern with operator-density voice: `quote_lane`, `book_shipment`, `get_rate`, not `executeQuoteLaneAction` or `process_shipment_request`
- Tool descriptions are mono-uppercase tracked label voice — short, direct, instrument-panel mood. "Quote a freight lane between two ZIPs. Returns per-pallet rate, transit days, carrier count."
- Error messages: brutalist hairline frame voice. "Lane unavailable. No carrier capacity on this corridor for the requested pickup window." Not: "We're sorry, but this lane is currently unavailable. Please try a different pickup date or contact support."
- Parameter descriptions: short, precise, freight-domain. `from_zip: "Origin ZIP code, 5 digits"`, not `from_zip: "The starting zip code where the freight will be picked up"`

Reference implementation: skip; this is voice & tone only. Document the pattern in the MD file.

### `04-platforms/responsive.md`

Web responsive web — same React components, different viewport rules:

- Container queries (`@container (min-width: …)`) on every Lumen layout primitive
- Mobile breakpoint at 640px, tablet at 1024px, desktop at 1440px, wide at 1920px
- DataTable collapses to card list below 1024px
- Sidebar collapses to drawer below 1024px
- CommandPalette stays full-screen modal below 768px

Reference implementation: covered by the existing Phase 2 Storybook stories with viewport addon; document the breakpoint rules in this MD.

## Decisions you will likely make unilaterally

- Whether to ship native WinUI 3 reference vs. recommending Electron-only. Default: Electron-only, document the WinUI 3 path for completeness but don't build a reference app.
- Whether to wrap NSVisualEffectView yourself or use an existing community package. Default: ship your own wrapper as `Lumen.VisualEffect` (15 lines of Swift, no external dep).
- How to handle Compose Multiplatform vs. Compose Android-only. Default: Compose Multiplatform for the reference app since it gives you iOS reach via the same code; Haze works in CMP.
- Whether to ship a Polaris bridge library that maps Polaris components to Lumen visual tweaks where Polaris allows it. Default: no — document the integration pattern, ship no code. The 15% identity budget doesn't justify a library.
- How to handle terminal capability detection for the CLI guide. Default: use `lipgloss.HasDarkBackground()` and `lipgloss.ColorProfile()` in Go; check `process.stdout.isTTY` and `chalk.supportsColor` in Node.

## Verification gates for Phase 3

| Gate | Pass condition |
|---|---|
| Per-platform MD complete | All nine MD files exist (ios, android, macos, windows, shopify, extension, cli, mcp-host, responsive) |
| Token mapping table | Every MD contains a token mapping table covering at minimum: surface, text, border, motion, elevation |
| Identity budget stated | Every MD names the realistic identity budget for the platform |
| Reference implementations | iOS, Android, macOS, Extension, CLI Go, CLI Node reference apps exist and build successfully on their respective toolchains (skip Windows native, skip Shopify) |
| Token consumption | Reference apps consume the generated platform artifacts from Phase 0 (`Lumen+Colors.swift`, `LumenColors.kt`, etc.), not duplicated values |
| Reduce-* honored | iOS and Android reference apps demonstrate reduce-transparency and reduce-motion fallbacks under simulated OS settings |
| Voice consistency | MCP MD's example tool names, descriptions, and error messages match the brutalist-instrument-panel voice |
| Self-critique | All 15 questions in master doc §10.1 answered "no" |

## Stop condition

Phase report into `design-system/06-claude-code-briefings/phase-3-report.md` per master doc §10.3. Commit message: `feat(lumen): phase 3 — platform translation guides and reference apps`. **Halt**. Wait for Phase 4.
