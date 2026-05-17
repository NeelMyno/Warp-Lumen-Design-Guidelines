# ios-reference — Lumen v0.13 iOS reference app

> SwiftUI on iOS 17+. Three surfaces: primary button, stat, glass popover. Demonstrates the token map + accessibility contract from [`design-system/04-platforms/ios.md`](../../design-system/04-platforms/ios.md).

## What this proves

- Lumen tokens reach iOS (every color / spacing / motion value comes from `LumenTokens`, never an inline hex literal).
- `accessibilityReduceTransparency` swaps glass surfaces for solid `surface.raised` at 92% alpha.
- `accessibilityReduceMotion` collapses spring + ease animations to instant.
- Hard rule 9 — primary button uses `LumenColors.actionPrimaryFg` (≈ `#07120D`), never white on lime.
- Hard rule 11 — popover focus ring uses `outline` + `box-shadow` halo (via `.overlay` + `.shadow`).
- Hard rule 15 — `LumenPrimaryButton`, `LumenStat`, `LumenGlassPopover` have no `mode:` prop; mode would scope via an environment value (not exercised in this minimal reference).

## Build

```bash
cd examples/ios-reference
swift build              # build the package
open Package.swift       # open in Xcode → Run on simulator
```

Build requires Xcode 15+ (Swift 5.10+) and the iOS 17 SDK. The reference uses only Apple-shipped primitives — no external dependencies.

## What's NOT in this reference

- **Satoshi font files.** The reference target declares `.copy("Resources/Satoshi-Variable.woff2.placeholder")` because Satoshi is ITF-FFL (free for commercial use, do not redistribute publicly). In a real app target, drop `Satoshi-Variable.otf` and `Satoshi-VariableItalic.otf` into the Resources folder and register via `Info.plist`'s `UIAppFonts` array. The Phase 3 ios.md §6 documents the wiring.
- **Full token graph.** `Sources/LumenTokens/LumenTokens.swift` inlines the subset the three surfaces need. The production Swift Package generates the full token surface via Style Dictionary into `dist/swift/Lumen+Colors.swift` and `dist/ios/LumenTokens.swift`.
- **Network / data layer.** The reference is static. Real apps fetch shipment / quote data from the Warp API.

## Files

```
ios-reference/
├── Package.swift
├── README.md
└── Sources/
    ├── LumenTokens/
    │   └── LumenTokens.swift       # Vendored token subset
    └── LumenReferenceApp/
        ├── LumenReferenceApp.swift # @main + three surfaces
        └── Resources/
            └── (Satoshi placeholder)
```

## Related

- [`../../design-system/04-platforms/ios.md`](../../design-system/04-platforms/ios.md) — full iOS translation guide.
- [`../macos-reference/`](../macos-reference/) — shares this Swift Package's `LumenTokens` target in production.
- [`../../dist/swift/Lumen+Colors.swift`](../../dist/swift/Lumen+Colors.swift) — generated full token graph.
