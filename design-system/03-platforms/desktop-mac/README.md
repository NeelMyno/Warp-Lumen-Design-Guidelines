# Desktop · macOS (SwiftUI / AppKit)

> Stack: Swift 6 + SwiftUI on macOS 14+. Same Swift Package as iOS — `LumenTokens` works on both. AppKit only when SwiftUI lacks a primitive (rare in 2026).

> **v0.11.13 currency.** This guide reflects the Premium Psychology recolor — anchors are spring green `#00FA8A` (accent), obsidian mint `#171A18` (dark canvas), light anchor `#E6E6E6`, paper `#FAFAFA`. Seven principles now (hierarchy, first-impression, micro-interactions joined the original five) and 35 component contracts. v0.11.13 closes the DTCG inheritance audit; the `LumenMac` target carries the same color resolution as iOS so vibrancy substrates compose cleanly behind obsidian-mint chrome.

## Setup

Same as iOS — add the `LumenTokens` Swift Package and bundle Satoshi.

```swift
.package(url: "https://github.com/warp/lumen-ios.git", from: "0.11.13")
```

For macOS-specific UIs, add the `LumenMac` target which provides:
- `WindowFrame` (traffic-light + sidebar layout)
- `Sidebar` (with vibrancy / `NSVisualEffectView`)
- `Toolbar` (macOS-native toolbar styled with Lumen)

## macOS-specific patterns

### Window frame
```swift
import SwiftUI
import LumenMac

@main
struct OperatorApp: App {
  var body: some Scene {
    WindowGroup {
      WindowFrame {
        NavigationSplitView {
          Sidebar()
        } detail: {
          ContentView()
        }
      }
    }
    .windowStyle(.hiddenTitleBar) // optional, for full-bleed
  }
}
```

### Vibrancy (sidebar)
```swift
import AppKit
import SwiftUI

struct VibrantSidebar: View {
  var body: some View {
    Sidebar()
      .background(.ultraThinMaterial) // SwiftUI material
      // or for NSVisualEffectView precision:
      .background(VisualEffect(material: .sidebar))
  }
}

struct VisualEffect: NSViewRepresentable {
  let material: NSVisualEffectView.Material
  func makeNSView(context: Context) -> NSVisualEffectView {
    let v = NSVisualEffectView()
    v.material = material
    v.blendingMode = .behindWindow
    v.state = .active
    return v
  }
  func updateNSView(_ v: NSVisualEffectView, context: Context) {}
}
```

### Keyboard shortcuts
```swift
.keyboardShortcut("k", modifiers: .command)  // Cmd-K for command palette
.keyboardShortcut("n", modifiers: .command)  // Cmd-N for new shipment
```

## Type rendering

macOS uses CoreText — Satoshi renders identically to iOS. No special handling required. Use `Font.lumen(...)` from the iOS guide.

## Hover states (macOS-only)

```swift
.onHover { hovering in
  withAnimation(.easeOut(duration: LumenTokens.Motion.duration.fast)) {
    isHovered = hovering
  }
}
```

## Dark mode

Honor `@Environment(\.colorScheme)`. Lumen Color assets resolve light/dark automatically.

## Honor system settings

- Reduce motion: `@Environment(\.accessibilityReduceMotion)` — disable LiveDot pulse.
- Reduce transparency: `@Environment(\.accessibilityReduceTransparency)` — switch vibrancy to solid.
- Increase contrast: `@Environment(\.accessibilityContrast)` — switch to `hc-light` / `hc-dark` token mode.
- System accent: SwiftUI's `.tint()` uses Lumen accent green by default; users can override system-wide.

## Distribution

- Mac App Store: bundle Satoshi in app bundle (FFL allows this).
- Direct download / DMG: same.
- Notarization: Lumen package is signed; pass through to your bundle.

## Forms & inputs (v0.6 mapping)

> v0.6 introduced the **field-shell architecture** for all text-entry controls. See [forms-and-inputs.md](../../00-foundations/forms-and-inputs.md) for the canonical guide. This section maps the architecture to macOS — SwiftUI on macOS 14+ is the default; AppKit `NSTextField` only when SwiftUI lacks a primitive.

### The shell pattern in macOS

The same `LumenField` SwiftUI implementation from the iOS guide works on macOS — `@FocusState` + `.textFieldStyle(.plain)` + a custom shell overlay. macOS-specific layering: pair the shell with macOS's frosted-glass surfaces (`NSVisualEffectView` / `.ultraThinMaterial`) and the v0.6 `lit-edge` becomes a natural reflection on top of the vibrancy substrate.

For AppKit-required cases (rare in 2026 — only inspector panels and some toolbar inputs):

```swift
import AppKit

class LumenTextField: NSView {
  let textField = NSTextField()

  override init(frame: NSRect) {
    super.init(frame: frame)
    wantsLayer = true
    layer?.cornerRadius = LumenTokens.radius.control.md
    layer?.borderWidth = 1
    layer?.borderColor = LumenTokens.color.border.default.cgColor
    layer?.backgroundColor = LumenTokens.surface.input.rest.cgColor
    addSubview(textField)
    textField.isBordered = false      // strip default chrome
    textField.drawsBackground = false
    textField.focusRingType = .none   // suppress default ring
    textField.cell?.usesSingleLineMode = true
  }

  override func becomeFirstResponder() -> Bool {
    layer?.borderColor = LumenTokens.color.border.focus.cgColor
    // paint the focus halo as a stacked CALayer.
    // v0.4 → v0.13 this was a spring-green ring (#00FA8A); v0.14 R11 retired it
    // to a neutral border-frame (40%-alpha theme-aware paper/ink) — see ADR 0030.
    return super.becomeFirstResponder()
  }
}
```

The discipline parallel to web: `isBordered = false`, `drawsBackground = false`, `focusRingType = .none` strip AppKit's default chrome. The `NSView` wrapper paints the shell.

### Token mapping

macOS's coordinate system is `pt` (= `px` at 1×; identical at 2× retina). Token heights stay 32 / 40 / 48 px directly.

| Lumen token | macOS equivalent | Notes |
|---|---|---|
| `input.height.sm` | `.frame(height: 32)` / `NSLayoutConstraint(height = 32)` | macOS's natural density default |
| `input.height.md` | `.frame(height: 40)` | |
| `input.height.lg` | `.frame(height: 48)` | only for Mac Catalyst inspector panels |
| `input.padding.x.md` | `.padding(.horizontal, 12)` | |
| `input.background.rest` | `RoundedRectangle.fill(LumenTokens.surface.input.rest)` (SwiftUI) / `layer?.backgroundColor` (AppKit) | |
| `input.border.rest` | `.strokeBorder(LumenTokens.color.border.default, lineWidth: 1)` / `layer?.borderColor` | |
| `input.border.focus` | driven by `@FocusState` (SwiftUI) / `becomeFirstResponder()` (AppKit) | |
| `input.ring.focus` | stacked overlay or `CALayer` with `shadowColor` + `shadowRadius` | platform compromise — see iOS guide |
| `input.ring.litEdge` | composes naturally on top of `NSVisualEffectView` vibrancy | macOS-specific win |
| `input.transition` | `.animation(.easeOut(duration: 0.15), value: isFocused)` (SwiftUI) / `CABasicAnimation` (AppKit) | |

### Density modes

macOS is conventionally **dense** — Finder, Mail, Xcode, the system controls all run tight. `compact` is the **implicit default** on macOS-only surfaces. Switch to `comfortable` only for:
- Mac Catalyst apps deliberately preserving iPad density.
- Marketing-style onboarding flows inside otherwise-dense apps.
- Settings panes that carry a lot of explanatory copy alongside controls.

Wire density via `.controlSize(.small | .regular)` from the iOS guide. `.controlSize(.small)` maps to Lumen `compact` / 32 pt; `.regular` maps to `comfortable` / 40 pt. macOS surfaces don't typically need `.large` (48 pt) — that's a touch-target ceiling, and macOS is mouse-first.

### Validation timing

Same rules as web. macOS-specific notes:

1. **Blur on Tab** — macOS users tab between fields aggressively; `@FocusState` fires `onChange` reliably on Tab.
2. **Submit via Return** — wire `.onSubmit { validate() }` on the form. Return key is the macOS-idiomatic submit affordance.
3. **Server validation announcement** — macOS uses `NSAccessibility.post(element: …, notification: .announcementRequested)` (the AppKit equivalent of `aria-live`).
4. **Async validation spinner** — `ProgressView()` in the trailing slot (SwiftUI) or `NSProgressIndicator(style: .spinning)` (AppKit). macOS users tolerate a slightly longer debounce (500 ms) than web because the cursor stays put after typing.

### Read-only vs disabled

Same SwiftUI mapping as iOS — `.disabled(true)` for disabled, `.allowsHitTesting(false) + .textSelection(.enabled)` for read-only. AppKit equivalents:

| State | AppKit | Visual | In tab order? | Caret? | Copyable? |
|---|---|---|---|---|---|
| `disabled` | `textField.isEnabled = false` | muted bg via Lumen disabled tokens | no | no | no |
| `readOnly` | `textField.isEditable = false` + `textField.isSelectable = true` | rest bg, full contrast | yes | no | yes (Cmd-C works) |

`isSelectable = true` is the macOS detail that makes read-only fields actually copyable via the standard Cmd-C menu shortcut.

### Vibrancy + autofill

`NSVisualEffectView` (the macOS frosted-glass material) composes cleanly **behind** the `.lumen-field` shell — the shell is opaque; only the surrounding chrome (sidebar, toolbar) uses vibrancy. NN/g's "don't glass interactive elements" warning is honored: input surfaces stay fully opaque, and the lit-edge is the only nod to the surrounding glass aesthetic.

**Keychain autofill** respects the field shell as long as `nsTextField.cell.usesSingleLineMode = true` — the autofill popover anchors to the field's bounds, not its inner text view. SwiftUI handles this automatically; AppKit requires the explicit cell setting above.

### Web-only features that don't translate

| Web feature | macOS equivalent | Status |
|---|---|---|
| `:has(:focus-visible)` | `@FocusState` (SwiftUI) / `becomeFirstResponder()` (AppKit) | clean |
| Autofill bg override | Keychain autofill respects the shell natively | clean |
| `field-sizing: content` | `TextEditor` + `GeometryReader` for SwiftUI; `NSTextView` auto-resize for AppKit | partial |
| Lit top edge (inset highlight) | enhanced by `NSVisualEffectView` substrate — composes naturally | platform win |
