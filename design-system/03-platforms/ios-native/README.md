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

## Forms & inputs (v0.6 mapping)

> v0.6 introduced the **field-shell architecture** for all text-entry controls. See [forms-and-inputs.md](../../00-foundations/forms-and-inputs.md) for the canonical guide. This section maps the architecture to SwiftUI on iOS.

### The shell pattern in SwiftUI

SwiftUI's default `TextField` paints its own border via `.textFieldStyle(.roundedBorder)`. The v0.6 pattern asks for the inverse: the **wrapper** owns chrome, the inner control renders bare. Strip the default style with `.textFieldStyle(.plain)`, then wrap in a custom shell view that paints the focus surface — driven by `@FocusState`.

```swift
import SwiftUI
import LumenTokens

struct LumenField<Content: View>: View {
  @FocusState private var isFocused: Bool
  let label: String
  let isInvalid: Bool
  let isDisabled: Bool
  let isReadOnly: Bool
  let leadingIcon: Image?
  let trailingAddon: String?
  @ViewBuilder let content: () -> Content

  var body: some View {
    VStack(alignment: .leading, spacing: LumenTokens.field.gap.labelToControl) {
      Text(label)
        .font(.lumen(.subheadline, weight: .medium))
        .foregroundStyle(LumenTokens.text.secondary)

      HStack(spacing: LumenTokens.input.gap.slot) {
        if let leadingIcon { leadingIcon.foregroundStyle(LumenTokens.text.tertiary) }
        content()
          .textFieldStyle(.plain)        // strip default chrome
          .focused($isFocused)
        if let trailingAddon {
          Text(trailingAddon)
            .font(.system(.caption, design: .monospaced).weight(.medium))
            .foregroundStyle(LumenTokens.text.tertiary)
        }
      }
      .padding(.horizontal, LumenTokens.input.padding.x.md)
      .frame(height: LumenTokens.input.height.md)
      .background(
        RoundedRectangle(cornerRadius: LumenTokens.radius.control.md)
          .fill(isDisabled ? LumenTokens.surface.input.disabled : LumenTokens.surface.input.rest)
      )
      .overlay(
        RoundedRectangle(cornerRadius: LumenTokens.radius.control.md)
          .strokeBorder(borderColor, lineWidth: 1)
      )
      .shadow(color: ringColor, radius: 0, x: 0, y: 0)  // v0.6 lime/red halo
      .animation(.easeOut(duration: LumenTokens.motion.duration.fast), value: isFocused)
      .disabled(isDisabled)
    }
  }

  private var borderColor: Color {
    if isInvalid { return LumenTokens.color.border.error }
    if isFocused { return LumenTokens.color.border.focus }
    return LumenTokens.color.border.default
  }
  private var ringColor: Color {
    guard isFocused else { return .clear }
    return isInvalid ? LumenTokens.color.alpha.danger.32 : LumenTokens.color.accent._500.opacity(0.32)
  }
}
```

The discipline: `textFieldStyle(.plain)` is **non-negotiable** — it strips iOS's default `roundedBorder` so the inner field renders bare. `@FocusState` is SwiftUI's structural equivalent of `:has(:focus-visible)`: the parent observes the inner element's focus state and paints accordingly.

For cases that need real focus-ring depth (the v0.6 `box-shadow` halo doesn't translate cleanly to a SwiftUI single-axis `.shadow`), wrap the `RoundedRectangle` overlay in a stacked second `RoundedRectangle` at +3 pt with the lime tint — the visual is identical to the web halo.

### Token mapping

| Lumen token | SwiftUI / iOS equivalent | Notes |
|---|---|---|
| `input.height.sm` | `.frame(height: 32)` | iOS HIG floor on touch targets is 44 pt — sm is desktop-only territory |
| `input.height.md` | `.frame(height: 40)` | iPad / Mac Catalyst default |
| `input.height.lg` | `.frame(height: 48)` | iPhone default — clears 44 pt comfortably |
| `input.padding.x.md` | `.padding(.horizontal, 12)` | |
| `input.background.rest` | `RoundedRectangle.fill(LumenTokens.surface.input.rest)` | Color asset resolves light/dark |
| `input.border.rest` | `.strokeBorder(LumenTokens.color.border.default, lineWidth: 1)` | |
| `input.border.focus` | `.strokeBorder(LumenTokens.color.border.focus, lineWidth: 1)` (driven by `@FocusState`) | |
| `input.ring.focus` | `.shadow(color: LumenTokens.color.alpha.lime.32, radius: 0, …)` or stacked overlay | SwiftUI `.shadow` is gaussian-blurred; stacked overlay is the closer match to CSS box-shadow |
| `input.ring.error` | same shape, `alpha.danger.32` | |
| `input.transition` | `.animation(.easeOut(duration: 0.15), value: isFocused)` | matches `--motion-fast` |

**Token I wish existed but doesn't:** the `input.ring.litEdge` inset highlight composes via comma-stacked CSS shadows on web. SwiftUI has no native "inset highlight" overlay primitive — you fake it with a 1 pt-tall `.overlay(LinearGradient(...).mask(top edge))`. A platform-aware variant token (`input.ring.litEdge.web` vs `input.ring.litEdge.swift`) would let Style Dictionary emit the right form per target.

### Density modes

SwiftUI's idiomatic density control is `.controlSize(.small | .regular | .large)`. Wire it as a layered modifier:

```swift
LumenField(label: "Pickup ZIP", …) { TextField("90045", text: $zip) }
  .controlSize(.small)  // → 32 pt height, 13 pt body type
```

Implement by reading `\.controlSize` from the environment inside `LumenField` and switching the height / padding / type ramp accordingly. Operator dashboards on iPad in `compact` size class default `.controlSize(.small)`; iPhone forms stay `.regular`.

### Validation timing

Same rules as web. SwiftUI implementation:

1. **Don't validate during typing.** Track `@State var hasInteracted = false`; gate validation on it.
2. **Validate on blur** by attaching `.onChange(of: isFocused) { _, focused in if !focused && hasInteracted { validate() } }`.
3. **Switch to onChange** after first error — once an error is shown, attach `.onChange(of: value) { _, new in validate(new) }`.
4. **On submit**, iterate fields; for the first invalid, set `@FocusState` to its key. SwiftUI scrolls automatically.
5. **Server validation**: announce via UIKit's `UIAccessibility.post(notification: .announcement, argument: message)`.
6. **Async validation**: debounce via `.task(id: value) { try? await Task.sleep(...); validate() }`; render a `ProgressView()` in the trailing slot.

**Submit is never disabled as the only signal of validation failure.** iOS users expect tappable buttons to respond — show the validation summary on tap instead.

### Read-only vs disabled

iOS has both, with distinct idioms:

| State | SwiftUI | Visual | In tab order? | Caret? | Copyable? |
|---|---|---|---|---|---|
| `disabled` | `.disabled(true)` | muted bg, dim text, no interaction | no | no | no |
| `readOnly` | `.allowsHitTesting(false)` + `.textSelection(.enabled)` | rest bg, full contrast, native long-press copy menu | yes (focusable via VoiceOver) | no | yes |

`.disabled(true)` is greedy — it disables the entire subtree (including any trailing slot button). For `readOnly`, attach `.allowsHitTesting(false)` only to the inner `TextField`, leaving slot buttons interactive.

### iOS-specific: Dynamic Type

Form value text **must** scale with `UIContentSizeCategory`. The `Font.lumen(...)` helper from §3 does this via `.custom(name, size:, relativeTo: .body)`. Apply consistently to label, value, hint, error, and addon text.

```swift
Text(label).font(.lumen(.subheadline, weight: .medium))
TextField("…", text: $value).font(.lumen(.body))
```

At extra-large Dynamic Type sizes, the field height grows past 48 pt — that's correct. Don't pin the shell to a fixed pt height; use `.frame(minHeight: LumenTokens.input.height.md)` so the field can grow.

### Web-only features that don't translate

| Web feature | iOS / SwiftUI equivalent | Status |
|---|---|---|
| `:has(:focus-visible)` | `@FocusState` observed by parent view | clean |
| Autofill bg override (`-webkit-box-shadow`) | iOS Keychain autofill paints natively into `TextField`; respects the shell as long as the inner `TextField` is the source of truth | clean |
| `field-sizing: content` (auto-grow Textarea) | `TextEditor` + manual height measurement via `GeometryReader` | partial |
| Lit top edge (inset highlight) | stacked overlay or 1 pt linear gradient at top | platform compromise |
