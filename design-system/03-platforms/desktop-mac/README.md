# Desktop · macOS (SwiftUI / AppKit)

> Stack: Swift 6 + SwiftUI on macOS 14+. Same Swift Package as iOS — `LumenTokens` works on both. AppKit only when SwiftUI lacks a primitive (rare in 2026).

## Setup

Same as iOS — add the `LumenTokens` Swift Package and bundle Satoshi.

```swift
.package(url: "https://github.com/warp/lumen-ios.git", from: "0.1.0")
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
