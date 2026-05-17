//
//  LumenMacReferenceApp.swift
//  macOS reference for Lumen v0.13 — primary button, glass sidebar, stat tile.
//
//  Demonstrates the macOS contract from design-system/04-platforms/macos.md:
//   - NSVisualEffectView bridged through NSViewRepresentable (the macOS-native
//     glass primitive Apple has not yet exposed to pure SwiftUI for .sidebar /
//     .hudWindow materials)
//   - NSWorkspace.accessibilityDisplayShouldReduceTransparency honored
//   - Hard rule 9 (no white on accent)
//   - Hard rule 16 (glass on floating shells only — sidebar IS a floating shell)
//

import SwiftUI
import AppKit

// MARK: - Token subset (vendored — production reuses examples/ios-reference's LumenTokens)

enum LumenColors {
    static let surfaceCanvas = Color(red: 0.051, green: 0.051, blue: 0.051)
    static let surfaceRaised = Color(red: 0.090, green: 0.090, blue: 0.090)
    static let surfaceGlassTint = Color(red: 0.051, green: 0.051, blue: 0.051).opacity(0.5)
    static let textPrimary   = Color(red: 0.980, green: 0.980, blue: 0.980)
    static let textTertiary  = Color(red: 0.451, green: 0.451, blue: 0.451)
    static let borderDefault = Color.white.opacity(0.18)
    static let borderHairline = Color.white.opacity(0.06)

    static let actionPrimaryBgRest = Color(red: 0.000, green: 0.980, blue: 0.541)
    static let actionPrimaryFg     = Color(red: 0.027, green: 0.071, blue: 0.051)  // hard rule 9
}

enum LumenRadius { static let md: CGFloat = 6; static let lg: CGFloat = 12 }
enum LumenSpacing { static let s2: CGFloat = 8; static let s3: CGFloat = 12; static let s4: CGFloat = 16; static let s6: CGFloat = 24 }
enum LumenFont {
    static let name = "Satoshi-Variable"
    static func body(_ size: CGFloat = 14) -> Font { Font.custom(name, size: size) }
    static func bold(_ size: CGFloat) -> Font { Font.custom(name, size: size).weight(.bold) }
}

// MARK: - NSVisualEffectView bridge

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

extension VisualEffect {
    /// Source-list / file-tree sidebars
    static let glassSidebar = VisualEffect(material: .sidebar, blendingMode: .behindWindow)
    /// Hover popovers, dropdown menus
    static let glassPopover = VisualEffect(material: .popover, blendingMode: .withinWindow)
    /// Translucent window-level chrome (toolbar overlays)
    static let glassHud     = VisualEffect(material: .hudWindow, blendingMode: .behindWindow)
}

// MARK: - Reduce-transparency observer

class ReduceTransparencyObserver: ObservableObject {
    @Published var isReduceTransparencyEnabled: Bool = NSWorkspace.shared.accessibilityDisplayShouldReduceTransparency

    init() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(didChange),
            name: NSWorkspace.accessibilityDisplayOptionsDidChangeNotification,
            object: nil
        )
    }

    @objc private func didChange() {
        DispatchQueue.main.async {
            self.isReduceTransparencyEnabled = NSWorkspace.shared.accessibilityDisplayShouldReduceTransparency
        }
    }
}

// MARK: - Surfaces

struct LumenPrimaryButton: View {
    let label: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.custom(LumenFont.name, size: 14).weight(.semibold))
                .foregroundStyle(LumenColors.actionPrimaryFg)
                .frame(minWidth: 80, minHeight: 28)
                .padding(.horizontal, 14)
                .background(LumenColors.actionPrimaryBgRest)
                .clipShape(RoundedRectangle(cornerRadius: LumenRadius.md))
        }
        .buttonStyle(.plain)
        .onHover { hovering in
            if hovering { NSCursor.pointingHand.set() }
            else        { NSCursor.arrow.set() }
        }
    }
}

struct LumenStat: View {
    let value: String
    let label: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(value)
                .font(.custom(LumenFont.name, size: 49).weight(.bold))
                .foregroundStyle(LumenColors.textPrimary)
            Text(label)
                .font(.custom(LumenFont.name, size: 11).weight(.semibold))
                .tracking(1.76)
                .foregroundStyle(LumenColors.textTertiary)
        }
    }
}

struct LumenSidebar<Content: View>: View {
    let content: () -> Content
    @ObservedObject var observer: ReduceTransparencyObserver

    var body: some View {
        ZStack {
            if observer.isReduceTransparencyEnabled {
                LumenColors.surfaceRaised.opacity(0.92)
            } else {
                VisualEffect.glassSidebar
            }
            VStack(alignment: .leading, spacing: LumenSpacing.s3) {
                content()
                Spacer()
            }
            .padding(LumenSpacing.s4)
        }
        .frame(minWidth: 200, idealWidth: 240)
    }
}

// MARK: - App shell

@main
struct LumenMacReferenceApp: App {
    @StateObject private var observer = ReduceTransparencyObserver()

    var body: some Scene {
        WindowGroup {
            ContentView(observer: observer)
                .preferredColorScheme(.dark)
        }
        .windowStyle(.hiddenTitleBar)
    }
}

struct ContentView: View {
    @ObservedObject var observer: ReduceTransparencyObserver

    var body: some View {
        HSplitView {
            // Glass sidebar
            LumenSidebar(content: {
                Text("LUMEN v0.13")
                    .font(.custom(LumenFont.name, size: 11).weight(.semibold))
                    .tracking(1.76)
                    .foregroundStyle(LumenColors.textTertiary)
                Text("macOS Reference")
                    .font(LumenFont.bold(16))
                    .foregroundStyle(LumenColors.textPrimary)
                Divider().background(LumenColors.borderHairline)
                Text("Shipments")
                    .font(LumenFont.body(14))
                    .foregroundStyle(LumenColors.textPrimary)
                Text("Lanes")
                    .font(LumenFont.body(14))
                    .foregroundStyle(LumenColors.textPrimary)
                Text("Carriers")
                    .font(LumenFont.body(14))
                    .foregroundStyle(LumenColors.textPrimary)
            }, observer: observer)

            // Canvas
            ZStack {
                LumenColors.surfaceCanvas

                VStack(alignment: .leading, spacing: LumenSpacing.s6) {
                    Text("Today's lanes")
                        .font(LumenFont.bold(22))
                        .foregroundStyle(LumenColors.textPrimary)
                        .padding(.top, LumenSpacing.s6)

                    LumenStat(value: "98.2%", label: "ON-TIME DELIVERY")

                    LumenPrimaryButton(label: "Book shipment") {
                        // book action
                    }

                    Spacer()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                .padding(LumenSpacing.s6)
            }
        }
        .frame(minWidth: 720, minHeight: 480)
    }
}
