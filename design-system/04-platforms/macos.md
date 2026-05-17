---
name: macOS (SwiftUI + NSVisualEffectView)
type: platform-guide
platform: macos
runtime: SwiftUI on macOS 14+ · Swift 5.10+
lumen_version: 0.13.0
last_updated: 2026-05-17
status: stable
related: [./ios.md, ./windows.md, ../00-foundations/motion.md]
mcp_install: "swift package add warp-lumen-ios from 0.13.0 (shared with iOS)"
---

# macOS — Lumen v0.13 platform guide

> SwiftUI on macOS 14+. Shares the iOS Swift Package and `LumenTokens` class. AppKit drops in only for `NSVisualEffectView` — the macOS-native vibrancy substrate — bridged through `NSViewRepresentable`. Apple's Reduce Transparency / Reduce Motion preferences carry over verbatim from iOS.

## 1. What this platform is

macOS is the **operator desk-bound surface** — dispatchers, brokers, freight ops managers in a chair, multi-monitor, dense data, all-day usage. The Warp products that live here:

- **Warp desktop app** — the Electron-shimmed wrapper for the web SaaS; full native target ships for power users.
- **Cross-dock command center** — wall-mounted Mac mini at distribution hubs, live shipment grid + camera tiles.
- **Carrier sales workstation** — sales reps with multiple monitors, deep TMS workflows, Lumen-themed mail-merge tooling.
- **Freight executive dashboard** — VPs of operations who want a single full-screen Lumen surface showing weekly OTD, lane heat, exception flow.

Distribution: **the same Swift Package as iOS** — `github.com/NeelMyno/warp-lumen-ios` exports a `LumenMac` target alongside `LumenTokens`. Add the package, import `LumenTokens` for shared APIs, add `import LumenMac` for macOS-specific composables (window chrome, sidebar, toolbar).

## 2. Token mapping table

Generated outputs:
- [`dist/swift/Lumen+Colors.swift`](../../dist/swift/Lumen+Colors.swift) — `UIColor` extensions. **Note:** macOS uses `NSColor`, not `UIColor`. The shared file emits cross-platform `Color(red:green:blue:alpha:)` via a `#if canImport(UIKit) … #else … #endif` guard. On macOS, `LumenColors.surfaceCanvas` resolves to a SwiftUI `Color`, not `UIColor`.
- [`dist/ios/LumenTokens.swift`](../../dist/ios/LumenTokens.swift) — full token class, cross-platform compatible.

### Surface

| Lumen token | SwiftUI / AppKit | Notes |
|---|---|---|
| `surface.canvas` | `Color(LumenColors.surfaceCanvas)` | Window content background. Apply via `.background()` on root. |
| `surface.raised` | `Color(LumenColors.surfaceRaised)` | Card, panel, side-pane background. |
| `surface.sunken` | `Color(LumenColors.surfaceSunken)` | Inset surface — search field, segmented control track. |
| `surface.popover` | `NSVisualEffectView` material `.popover` via bridge | Hover popovers, tooltip-equivalents, dropdown menus. |
| `surface.glass` (sidebar) | `NSVisualEffectView` material `.sidebar` | Source-list / file-tree-style sidebars. macOS-native vibrancy substrate. |
| `surface.glass` (window chrome) | `NSVisualEffectView` material `.hudWindow` | Translucent window-level chrome — title bar, toolbar overlays. |
| `surface.glass-strong` (modal) | `NSVisualEffectView` material `.popover` with stronger `state = .active` | Sheet, alert, modal. |
| `surface.tint-accent` | `Color(LumenColors.surfaceTintAccent)` | Spring-green-tinted surface. |
| `surface.inverse` | `Color(LumenColors.surfaceInverse)` | Paper-on-dark. |

**SwiftUI also exposes Materials directly:** `.background(.regularMaterial)`, `.background(.thickMaterial)`. On macOS 12+ these wrap `NSVisualEffectView` under the hood. Prefer the materials API when it fits; drop to the bridge when you need a specific `NSVisualEffectMaterial` variant Apple hasn't exposed to SwiftUI (e.g., `.sidebar` and `.hudWindow`).

### Text, Border, Action

Same mappings as iOS — see [`./ios.md`](./ios.md) §2. The `LumenColors` constants are identical; the difference is which container they paint into.

### Motion

Same mappings as iOS — SwiftUI's `Animation` API is identical across platforms. See [`./ios.md`](./ios.md) §5. One macOS-specific addition:

| Lumen role | macOS API | Notes |
|---|---|---|
| Window-resize spring | `.transaction { $0.animation = .spring(response: 0.4, dampingFraction: 0.9) }` on `.frame()` | macOS users resize windows frequently. Lumen frames should snap with `motion.spring.gentle` semantics. |

### Elevation

| Lumen token | macOS API |
|---|---|
| `shadow.sm` through `shadow.modal` | Same SwiftUI `.shadow(…)` modifiers as iOS. |
| **Window shadow** | macOS draws its own window shadow (`NSWindow.hasShadow`). Don't paint a shadow on the SwiftUI root — it stacks with the window shadow and creates visible double-edge. |

## 3. Identity budget

**Lumen claim: ~85% of pixel surface.** Higher than iOS because macOS gives the app more chrome control:

- **macOS system chrome** (~10%): traffic-light controls, menu bar, Dock peek, system toolbar items if the app opts in to `.toolbar`, system alert sheets, Save panels, Open panels.
- **Touch Bar surfaces** (~negligible): largely deprecated; almost no current Mac ships with one.
- **Menu Bar surface (top of screen)** — Lumen-paintable for the app's own menus.

The 85% covers the entire window content area + custom-styled toolbar + custom sidebar.

## 4. Glass / blur translation

### NSVisualEffectView bridge

When SwiftUI's built-in materials don't give you the variant you need, bridge `NSVisualEffectView`:

```swift
import SwiftUI
import AppKit

struct VisualEffect: NSViewRepresentable {
    let material: NSVisualEffectView.Material
    let blendingMode: NSVisualEffectView.BlendingMode
    let state: NSVisualEffectView.State

    init(
        material: NSVisualEffectView.Material = .hudWindow,
        blendingMode: NSVisualEffectView.BlendingMode = .behindWindow,
        state: NSVisualEffectView.State = .active
    ) {
        self.material = material
        self.blendingMode = blendingMode
        self.state = state
    }

    func makeNSView(context: Context) -> NSVisualEffectView {
        let view = NSVisualEffectView()
        view.material = material
        view.blendingMode = blendingMode
        view.state = state
        view.isEmphasized = true
        return view
    }

    func updateNSView(_ view: NSVisualEffectView, context: Context) {
        view.material = material
        view.blendingMode = blendingMode
        view.state = state
    }
}

// Lumen-named convenience aliases:
extension VisualEffect {
    static let glassPopover = VisualEffect(material: .popover, blendingMode: .withinWindow)
    static let glassSidebar = VisualEffect(material: .sidebar, blendingMode: .behindWindow)
    static let glassHud     = VisualEffect(material: .hudWindow, blendingMode: .behindWindow)
}

// Usage:
VStack { … }
    .background(VisualEffect.glassPopover)
```

### Material role mapping (Lumen → NSVisualEffectMaterial)

| Lumen surface | NSVisualEffectMaterial | Use case |
|---|---|---|
| `surface.popover` | `.popover` | Hover popovers, dropdown menus. |
| `surface.glass` (sidebar) | `.sidebar` | Source-list-style sidebars. |
| `surface.glass` (window chrome) | `.hudWindow` | Translucent toolbar overlays. |
| `surface.glass-strong` | `.popover` with `.active` state + `.withinWindow` blending | Sheets, modals. |
| Modal background scrim | `.fullScreenUI` | Full-screen modal scrim. |

### Reduce Transparency

```swift
import AppKit

if NSWorkspace.shared.accessibilityDisplayShouldReduceTransparency {
    // Swap NSVisualEffectView for solid surface.raised at 92% alpha.
}
```

Or watch via Combine:

```swift
NotificationCenter.default
    .publisher(for: NSWorkspace.accessibilityDisplayOptionsDidChangeNotification)
    .map { _ in NSWorkspace.shared.accessibilityDisplayShouldReduceTransparency }
    .receive(on: DispatchQueue.main)
```

Apply via a SwiftUI environment value (`@Environment(\.accessibilityReduceTransparency)`) so consumers don't reach into AppKit at every site.

## 5. Motion translation

Same as iOS. SwiftUI's `Animation` API is platform-uniform.

### Window-level animations

macOS animates window changes differently from iOS. Wrap state changes that drive `.frame()` adjustments in:

```swift
withAnimation(.spring(response: 0.44, dampingFraction: 1.0)) {  // gentle spring
    isExpanded.toggle()
}
```

NSWindow-level resize (when the user drags a corner) is OS-driven and unanimated. Don't try to animate window-resize handles.

### Reduce Motion

Identical to iOS:

```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion
```

Apple unified this preference across iOS and macOS. Same fallback contract.

## 6. Typography translation

### Loading Satoshi

Same as iOS — drop OTF files into the bundle, register via `Info.plist`. On macOS, `Info.plist` uses `ATSApplicationFontsPath` for legacy compatibility OR `UIAppFonts` (the iOS key) which macOS also honors via the same Core Text path. Use `UIAppFonts` for cross-platform consistency.

### OpenType features

Identical Core Text path as iOS. `.fontFeatureSettings("tnum", "lnum", "zero")` works.

### Where macOS differs

- **System font fallback** is `.system(.body)` on macOS, which resolves to **SF Pro Text**. Lumen overrides this — use `Font.custom("Satoshi-Variable", size: …)` everywhere.
- **Dynamic Type doesn't exist on macOS.** macOS users adjust display resolution and accessibility zoom rather than scaling app fonts. Lumen body sizes stay fixed at the spec; don't bind to a fontScale variable.
- **Menu bar / Dock typography** is OS-painted; Lumen doesn't claim those surfaces.

## 7. Specific don'ts (macOS Lumen Law)

- **Don't paint a shadow on the SwiftUI root.** macOS draws its own window shadow. Stacking them creates a visible double edge.
- **Don't override the traffic-light controls.** The red / yellow / green window buttons are macOS chrome. Lumen accent does not paint them.
- **Don't apply `.regularMaterial` to source-list rows.** Use solid `surface.raised`. Material under dense data fails legibility (same rule as iOS, web, Android).
- **Don't use SwiftUI's `.menuStyle(.borderlessButton)` as the primary toolbar style.** macOS users expect `NSToolbar` semantics — Lumen's toolbar wraps `NSToolbar` and styles its items.
- **Don't ship custom-painted scrollbars.** macOS scrollbars are OS chrome; users have strong preferences (always show / overlay). Respect them.
- **Don't paint into the menu bar (top of screen) decoratively.** That's a system surface. Items there must be Lumen-voiced (terse, declarative) but the chrome is OS-painted.

## 8. Reference snippets

### Primary button (identical to iOS but uses macOS press cursor)

```swift
import SwiftUI

struct LumenPrimaryButton: View {
    let label: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.custom("Satoshi-Variable", size: 14).weight(.semibold))
                .foregroundStyle(Color(LumenColors.actionPrimaryFg))
                .frame(minWidth: 80, minHeight: 28)  // macOS default control height
                .padding(.horizontal, 14)
                .background(Color(LumenColors.actionPrimaryBgRest))
                .clipShape(RoundedRectangle(cornerRadius: 6))
        }
        .buttonStyle(.plain)
        .onHover { hovering in
            NSCursor.pointingHand.set()
            if !hovering { NSCursor.arrow.set() }
        }
    }
}
```

### Glass sidebar (NSVisualEffectView bridge)

```swift
struct LumenSidebar<Content: View>: View {
    let content: () -> Content
    @Environment(\.accessibilityReduceTransparency) var reduceTransparency

    var body: some View {
        ZStack {
            if reduceTransparency {
                Color(LumenColors.surfaceRaised).opacity(0.92)
            } else {
                VisualEffect.glassSidebar
            }
            VStack(alignment: .leading) {
                content()
            }
            .padding(12)
        }
        .frame(minWidth: 200, idealWidth: 240)
    }
}
```

### Stat (the Lumen signature)

Identical to the iOS implementation — see [`./ios.md`](./ios.md) §8.

A complete reference macOS app with these surfaces (button + sidebar + stat) lives at [`examples/macos-reference/`](../../examples/macos-reference/). Open the Swift package in Xcode; build target is macOS 14+.

## Related

- [`./ios.md`](./ios.md) — sister Apple platform; shares the Swift Package.
- [`./windows.md`](./windows.md) — Windows-native AcrylicBrush is the macOS-side-by-side comparison.
- [`../../examples/macos-reference/`](../../examples/macos-reference/) — reference macOS app.
