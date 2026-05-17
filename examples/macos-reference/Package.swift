// swift-tools-version: 5.10
//
// LumenMacReference — macOS reference app for Lumen v0.13.
// Renders three surfaces: primary button, sidebar with NSVisualEffectView glass,
// stat tile. Demonstrates the macOS translation contract from
// design-system/04-platforms/macos.md.

import PackageDescription

let package = Package(
    name: "LumenMacReference",
    platforms: [
        .macOS(.v14),
    ],
    products: [
        .executable(name: "LumenMacReferenceApp", targets: ["LumenMacReferenceApp"]),
    ],
    dependencies: [],
    targets: [
        .executableTarget(
            name: "LumenMacReferenceApp",
            path: "Sources"
        ),
    ]
)
