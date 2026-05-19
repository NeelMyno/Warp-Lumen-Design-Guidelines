// Lumen Card — iOS SwiftUI example (v0.14)
//
// Native counterpart to /examples/primary.tsx. Renders the Lumen card
// surface contract — rounded corners, optional padding tier, optional
// elevation, optional title block.

import SwiftUI

enum LumenCardTokens {
    static let surfaceRaised = Color(red: 0.082, green: 0.082, blue: 0.082)  // #151515
    static let borderHairline = Color.white.opacity(0.07)
    static let textPrimary = Color(red: 0.902, green: 0.902, blue: 0.902)
    static let textSecondary = Color(red: 0.42, green: 0.42, blue: 0.42)
    static let radiusLg: CGFloat = 12
    static let insetMd: CGFloat = 16
    static let insetLg: CGFloat = 24
}

struct LumenCard<Content: View>: View {
    let title: String?
    let supporting: String?
    let padding: CGFloat
    let elevation: Bool
    @ViewBuilder var content: () -> Content

    init(
        title: String? = nil,
        supporting: String? = nil,
        padding: CGFloat = LumenCardTokens.insetMd,
        elevation: Bool = false,
        @ViewBuilder content: @escaping () -> Content,
    ) {
        self.title = title
        self.supporting = supporting
        self.padding = padding
        self.elevation = elevation
        self.content = content
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let title = title {
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(LumenCardTokens.textPrimary)
                    if let supporting = supporting {
                        Text(supporting)
                            .font(.system(size: 14, weight: .regular))
                            .foregroundStyle(LumenCardTokens.textSecondary)
                    }
                }
            }
            content()
        }
        .padding(padding)
        .background(LumenCardTokens.surfaceRaised)
        .overlay(
            RoundedRectangle(cornerRadius: LumenCardTokens.radiusLg)
                .stroke(LumenCardTokens.borderHairline, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: LumenCardTokens.radiusLg, style: .continuous))
        .shadow(color: elevation ? Color.black.opacity(0.18) : .clear, radius: 12, x: 0, y: 4)
    }
}

#Preview {
    VStack(spacing: 16) {
        LumenCard(title: "Booked", supporting: "Confirmation BK-12345 sent to your inbox.") {
            Text("Pickup at 09:00, delivery by 17:00. Standard LTL.")
                .font(.system(size: 14))
                .foregroundStyle(LumenCardTokens.textPrimary)
        }
        LumenCard(padding: LumenCardTokens.insetLg, elevation: true) {
            Text("Operator card with elevation + lg padding.")
                .foregroundStyle(LumenCardTokens.textPrimary)
        }
    }
    .padding(24)
    .background(Color(red: 0.051, green: 0.051, blue: 0.051).ignoresSafeArea())
    .preferredColorScheme(.dark)
}
