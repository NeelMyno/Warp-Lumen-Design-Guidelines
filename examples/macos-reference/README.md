# macos-reference — Lumen v0.13 macOS reference app

> SwiftUI on macOS 14+ with an `NSVisualEffectView` bridge for sidebar glass. Three surfaces: primary button, stat, glass sidebar. Demonstrates the macOS contract from [`design-system/04-platforms/macos.md`](../../design-system/04-platforms/macos.md).

## What this proves

- The `NSVisualEffectView` bridge pattern works in SwiftUI macOS 14+ — `material: .sidebar` produces the macOS-native source-list vibrancy.
- `NSWorkspace.accessibilityDisplayShouldReduceTransparency` observed via `NSWorkspace.accessibilityDisplayOptionsDidChangeNotification` — `LumenSidebar` swaps glass for solid 92%-alpha surface when the OS preference is on.
- Hard rule 9 — primary button uses `LumenColors.actionPrimaryFg`.
- Hard rule 16 — glass on floating shell (sidebar) only. The canvas, the stat tile, the button all stay solid.

## Build

```bash
cd examples/macos-reference
swift build              # builds the executable
swift run                # runs the app
# or:
open Package.swift       # open in Xcode → Run target LumenMacReferenceApp
```

Requires Xcode 15+ (Swift 5.10+) and the macOS 14 SDK. No external dependencies.

## What's NOT in this reference

- **Satoshi font.** Same ITF-FFL caveat as iOS — the app loads `Satoshi-Variable` by name. In production, drop the OTF into the bundle resources and register via `Info.plist`'s `UIAppFonts` (macOS also honors that key via Core Text).
- **Production token surface.** The token subset is vendored inline. Real apps consume the shared `LumenTokens` Swift Package which generates from the Style Dictionary output at [`../../dist/swift/Lumen+Colors.swift`](../../dist/swift/Lumen+Colors.swift).
- **Toolbar / menu bar.** macOS apps typically customize `NSToolbar`. The reference skips toolbar setup to keep focus on the three surfaces.

## Files

```
macos-reference/
├── Package.swift
├── README.md
└── Sources/
    └── LumenMacReferenceApp.swift   # @main + bridge + three surfaces
```

## Related

- [`../../design-system/04-platforms/macos.md`](../../design-system/04-platforms/macos.md) — full macOS translation guide.
- [`../ios-reference/`](../ios-reference/) — the sister iOS reference; shares the Swift Package pattern.
- [`../../dist/swift/Lumen+Colors.swift`](../../dist/swift/Lumen+Colors.swift) — generated token graph.
