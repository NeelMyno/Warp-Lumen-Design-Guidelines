# iOS native (SwiftUI)

> Stack: Swift 6 + SwiftUI on iOS 17+. Lumen tokens distributed as a Swift Package. Satoshi bundled into the app target.

## Setup

### 1. Add the Lumen Swift Package
In Xcode: `File → Add Package Dependencies… → https://github.com/warp/lumen-ios`

Or in `Package.swift`:
```swift
.package(url: "https://github.com/warp/lumen-ios.git", from: "0.1.0"),
```

Then import:
```swift
import LumenTokens
```

### 2. Bundle Satoshi
1. Drop `Satoshi-Regular.otf`, `-Medium.otf`, `-Bold.otf`, `-Black.otf` into your Xcode project.
2. Add to target's "Copy Bundle Resources."
3. Register in `Info.plist`:
   ```xml
   <key>UIAppFonts</key>
   <array>
     <string>Satoshi-Regular.otf</string>
     <string>Satoshi-Medium.otf</string>
     <string>Satoshi-Bold.otf</string>
     <string>Satoshi-Black.otf</string>
   </array>
   ```

### 3. Wrap Satoshi in Dynamic Type
```swift
extension Font {
  static func lumen(_ style: TextStyle, weight: Weight = .regular) -> Font {
    let fontName: String = {
      switch weight {
      case .bold:     return "Satoshi-Bold"
      case .medium:   return "Satoshi-Medium"
      default:        return "Satoshi-Regular"
      }
    }()
    return .custom(fontName, size: style.defaultSize, relativeTo: style)
  }
}

// Usage
Text("Shipments")
  .font(.lumen(.title, weight: .bold))
  .foregroundStyle(LumenTokens.text.primary)
```

This ensures Satoshi scales with system Dynamic Type — non-negotiable for App Store accessibility compliance.

### 4. Apply tokens
```swift
import LumenTokens

VStack(spacing: LumenTokens.space._4) {
  Text("On time")
    .font(.lumen(.caption, weight: .medium))
    .foregroundStyle(LumenTokens.text.tertiary)
  Text("98.2%")
    .font(.system(.largeTitle, design: .monospaced).weight(.bold))
    .foregroundStyle(LumenTokens.text.primary)
}
.padding(LumenTokens.space._4)
.background(LumenTokens.surface.raised)
.clipShape(RoundedRectangle(cornerRadius: LumenTokens.radius.card.default))
.shadow(color: .black.opacity(0.05), radius: 12, y: 4)
```

## Mapping Lumen scale to Apple text styles

See `01-tokens/README.md` for the full table. Highlights:
- `display.md` (39pt Bold) → `.largeTitle`
- `heading.h1` (31pt Bold) → `.title`
- `heading.h2` (25pt Semibold) → `.title2`
- `heading.h3` (20pt Medium) → `.title3`
- `body.md` (16pt Regular) → `.body`
- `body.sm` (14pt Regular) → `.callout` or `.subheadline`
- `caption` (13pt Regular) → `.footnote`
- `micro` (12pt Medium) → `.caption2`

## Live primitives (SwiftUI)

```swift
struct LiveDot: View {
  var color: Color = LumenTokens.accent._500
  var size: CGFloat = 8

  @State private var pulse = false
  @Environment(\.accessibilityReduceMotion) var reduceMotion

  var body: some View {
    ZStack {
      Circle().fill(color).frame(width: size, height: size)
      Circle()
        .strokeBorder(color, lineWidth: 1.5)
        .frame(width: size, height: size)
        .scaleEffect(pulse ? 2.4 : 1)
        .opacity(pulse ? 0 : 0.7)
        .animation(
          reduceMotion ? nil :
            .easeOut(duration: 3).repeatForever(autoreverses: false),
          value: pulse
        )
    }
    .onAppear { if !reduceMotion { pulse = true } }
  }
}
```

## Touch targets and a11y

- Hit targets ≥ 44×44 pt — enforced by `.frame(minWidth: 44, minHeight: 44)` on tappable Lumen primitives.
- VoiceOver labels on every icon-only control.
- Honor `@Environment(\.accessibilityReduceMotion)` for `LiveDot` and `RateTicker`.
- Honor `@Environment(\.accessibilityReduceTransparency)` — when on, switch translucent overlays to opaque.

## Dark mode

Native — handled via SwiftUI's `colorScheme`. Lumen tokens are Color assets that resolve light/dark automatically.

## Common patterns

- Sheet presentation: use `.presentationDetents([.medium, .large])` on iOS 16+.
- Safe area: `.safeAreaInset(edge: .bottom) { ... }` for floating CTAs.
- Lists: `List` with `.listStyle(.insetGrouped)` matches the Lumen card density.
