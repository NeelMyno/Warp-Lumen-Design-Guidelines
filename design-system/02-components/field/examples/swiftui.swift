// Lumen Field — iOS SwiftUI example (v0.14)
//
// The form-field shell: visible label + control + optional help / error +
// optional trailing affordance. Mirrors the web React contract (v0.6).

import SwiftUI

enum LumenFieldTokens {
    static let surfaceField = Color(red: 0.082, green: 0.082, blue: 0.082)
    static let borderDefault = Color(red: 0.251, green: 0.251, blue: 0.251)
    static let borderFocus = Color(red: 0.0, green: 0.980, blue: 0.541)
    static let borderInvalid = Color(red: 0.79, green: 0.18, blue: 0.18)
    static let textPrimary = Color(red: 0.902, green: 0.902, blue: 0.902)
    static let textSecondary = Color(red: 0.42, green: 0.42, blue: 0.42)
    static let textTertiary = Color(red: 0.6, green: 0.6, blue: 0.6)
    static let textDanger = Color(red: 0.93, green: 0.34, blue: 0.34)
    static let radiusMd: CGFloat = 6
    static let controlMd: CGFloat = 40
}

enum LumenFieldStatus {
    case normal, invalid
}

struct LumenField: View {
    let label: String
    let placeholder: String
    @Binding var value: String
    var helpText: String? = nil
    var errorText: String? = nil
    var status: LumenFieldStatus = .normal
    var required: Bool = false

    @FocusState private var focused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 4) {
                Text(label)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(LumenFieldTokens.textPrimary)
                if required {
                    Text("*")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(LumenFieldTokens.textDanger)
                }
            }

            TextField(placeholder, text: $value)
                .font(.system(size: 14))
                .foregroundStyle(LumenFieldTokens.textPrimary)
                .padding(.horizontal, 12)
                .frame(height: LumenFieldTokens.controlMd)
                .background(LumenFieldTokens.surfaceField)
                .overlay(
                    RoundedRectangle(cornerRadius: LumenFieldTokens.radiusMd, style: .continuous)
                        .stroke(borderColor, lineWidth: focused ? 2 : 1)
                )
                .clipShape(RoundedRectangle(cornerRadius: LumenFieldTokens.radiusMd, style: .continuous))
                .focused($focused)
                .accessibilityLabel(label)
                .accessibilityHint(helpText ?? "")

            if let errorText = errorText, status == .invalid {
                Text(errorText)
                    .font(.system(size: 12))
                    .foregroundStyle(LumenFieldTokens.textDanger)
                    .accessibilityLabel("Error: \(errorText)")
            } else if let helpText = helpText {
                Text(helpText)
                    .font(.system(size: 12))
                    .foregroundStyle(LumenFieldTokens.textTertiary)
            }
        }
    }

    private var borderColor: Color {
        if status == .invalid { return LumenFieldTokens.borderInvalid }
        if focused { return LumenFieldTokens.borderFocus }
        return LumenFieldTokens.borderDefault
    }
}

// Demo
struct LumenFieldDemo: View {
    @State private var email: String = ""
    @State private var name: String = "Avery Mercer"
    @State private var invalidValue: String = "not-an-email"

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            LumenField(label: "Email", placeholder: "you@warp.com", value: $email, helpText: "We'll use this for shipment notifications.", required: true)
            LumenField(label: "Full name", placeholder: "First Last", value: $name)
            LumenField(label: "Login email", placeholder: "you@warp.com", value: $invalidValue, errorText: "Enter a valid email address.", status: .invalid)
        }
        .padding(24)
        .background(Color(red: 0.051, green: 0.051, blue: 0.051).ignoresSafeArea())
        .preferredColorScheme(.dark)
    }
}

#Preview { LumenFieldDemo() }
