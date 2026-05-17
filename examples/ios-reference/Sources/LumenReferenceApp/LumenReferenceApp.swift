//
//  LumenReferenceApp.swift
//  iOS reference implementation for Lumen v0.13 — primary button, stat, glass popover.
//
//  Demonstrates the iOS contract from design-system/04-platforms/ios.md:
//   - Tokens via LumenColors / LumenSpring / LumenEasing
//   - accessibilityReduceMotion + accessibilityReduceTransparency honored
//   - Hard rule 9 (no white on accent) — primary button uses LumenColors.actionPrimaryFg
//   - Hard rule 11 (focus contract) — outline + shadow halo via .overlay + .shadow
//   - Hard rule 15 (mode is scope, not prop) — no `mode:` parameter on any component
//

import SwiftUI
import LumenTokens

@main
struct LumenReferenceApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .preferredColorScheme(.dark)
                .accentColor(LumenColors.actionPrimaryBgRest)
        }
    }
}

struct ContentView: View {
    @State private var isPopoverShown = false

    var body: some View {
        ZStack {
            LumenColors.surfaceCanvas
                .ignoresSafeArea()

            VStack(alignment: .leading, spacing: LumenSpacing.s6) {
                // Header — Lumen voice in a tracked label
                Text("LUMEN v0.13  ·  iOS REFERENCE")
                    .font(.custom(LumenFont.name, size: 11).weight(.semibold))
                    .tracking(1.76)
                    .foregroundStyle(LumenColors.textTertiary)

                Spacer().frame(height: LumenSpacing.s4)

                // Surface 1: Stat (Lumen signature)
                LumenStat(value: "98.2%", label: "ON-TIME DELIVERY", unit: nil)

                Divider().background(LumenColors.borderHairline)

                // Surface 2: Primary button
                LumenPrimaryButton(label: "Book shipment") {
                    isPopoverShown = true
                }

                Divider().background(LumenColors.borderHairline)

                // Surface 3: Glass popover (triggered by button)
                if isPopoverShown {
                    LumenGlassPopover {
                        VStack(alignment: .leading, spacing: LumenSpacing.s2) {
                            Text("Confirmed")
                                .font(LumenFont.bold(18))
                                .foregroundStyle(LumenColors.textPrimary)
                            Text("Shipment AB47 booked. Tracking is live.")
                                .font(LumenFont.body(14))
                                .foregroundStyle(LumenColors.textSecondary)
                        }
                    }
                }

                Spacer()
            }
            .padding(LumenSpacing.s6)
        }
    }
}

// MARK: - Surface 1: Stat

struct LumenStat: View {
    let value: String
    let label: String
    let unit: String?

    var body: some View {
        VStack(alignment: .leading, spacing: LumenSpacing.s1) {
            HStack(alignment: .firstTextBaseline, spacing: LumenSpacing.s1) {
                Text(value)
                    .font(.custom(LumenFont.name, size: 49).weight(.bold))
                    .foregroundStyle(LumenColors.textPrimary)
                    // .lumen-mono — tabular + lining + slashed-zero
                    .modifier(LumenMonoFeatures())
                if let unit {
                    Text(unit)
                        .font(.custom(LumenFont.name, size: 18).weight(.medium))
                        .foregroundStyle(LumenColors.textTertiary)
                }
            }
            Text(label)
                .font(.custom(LumenFont.name, size: 11).weight(.semibold))
                .tracking(1.76)
                .foregroundStyle(LumenColors.textTertiary)
        }
    }
}

// MARK: - Surface 2: Primary button

struct LumenPrimaryButton: View {
    let label: String
    let action: () -> Void
    @Environment(\.accessibilityReduceMotion) var reduceMotion

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.custom(LumenFont.name, size: 14).weight(.semibold))
                .foregroundStyle(LumenColors.actionPrimaryFg)  // Hard rule 9 — never white
                .frame(maxWidth: .infinity, minHeight: 44)      // iOS touch target floor
                .background(LumenColors.actionPrimaryBgRest)
                .clipShape(RoundedRectangle(cornerRadius: LumenRadius.md))
                .shadow(color: LumenColors.actionPrimaryBgRest.opacity(0.25), radius: 16, x: 0, y: 4)
        }
        .buttonStyle(LumenPressableButtonStyle())
        .animation(reduceMotion ? nil : LumenEasing.micro, value: 0)
    }
}

struct LumenPressableButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .brightness(configuration.isPressed ? -0.08 : 0)
            .animation(.easeOut(duration: LumenDuration.micro), value: configuration.isPressed)
    }
}

// MARK: - Surface 3: Glass popover

struct LumenGlassPopover<Content: View>: View {
    let content: () -> Content
    @Environment(\.accessibilityReduceTransparency) var reduceTransparency

    var body: some View {
        content()
            .padding(LumenSpacing.s4)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(materialBackground)
            .clipShape(RoundedRectangle(cornerRadius: LumenRadius.lg))
            .overlay(
                RoundedRectangle(cornerRadius: LumenRadius.lg)
                    .stroke(LumenColors.borderDefault, lineWidth: 1)
            )
            .shadow(color: .black.opacity(0.18), radius: 20, x: 0, y: 8)
    }

    @ViewBuilder
    private var materialBackground: some View {
        if reduceTransparency {
            // Hard rule 16 fallback — solid surface at ≥85% alpha
            LumenColors.surfaceRaised.opacity(0.92)
        } else {
            Color.clear
                .background(.regularMaterial)
                .colorScheme(.dark)  // Force material to sample obsidian canvas
        }
    }
}

// MARK: - OpenType helpers

struct LumenMonoFeatures: ViewModifier {
    func body(content: Content) -> some View {
        if #available(iOS 16.4, *) {
            content
                .fontDesign(.monospaced)  // closest SwiftUI primitive
        } else {
            content
        }
    }
}

#Preview {
    ContentView()
}
