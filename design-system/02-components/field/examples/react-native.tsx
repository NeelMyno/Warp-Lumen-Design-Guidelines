// lumen-lint-allow-block: primitives — React Native example file. Native
// platforms (RN, iOS, Android) cannot reference CSS variables; tokens convert
// to hex literals at the platform-build step. The hex values mirror the
// canonical primitive token values from design-system/01-tokens/. Real consumer
// apps import from _build/react-native/tokens.ts instead of inlining.
// Lumen Field — React Native example (v0.14)

import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, type ViewStyle } from "react-native";

const LumenFieldTokens = {
  color: {
    surfaceField: "#151515",
    borderDefault: "#404040",
    borderFocus: "#00FA8A",
    borderInvalid: "#CA2D2D",
    textPrimary: "#E6E6E6",
    textTertiary: "#9A9A9A",
    textDanger: "#EC5757",
    placeholder: "#6B6B6B",
  },
  radius: { md: 6 },
  size: { controlMd: 40 },
} as const;

type LumenFieldStatus = "normal" | "invalid";

type LumenFieldProps = {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  helpText?: string;
  errorText?: string;
  status?: LumenFieldStatus;
  required?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  style?: ViewStyle;
};

export function LumenField({
  label,
  value,
  onChangeText,
  placeholder,
  helpText,
  errorText,
  status = "normal",
  required = false,
  keyboardType = "default",
  style,
}: LumenFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderColor =
    status === "invalid"
      ? LumenFieldTokens.color.borderInvalid
      : focused
        ? LumenFieldTokens.color.borderFocus
        : LumenFieldTokens.color.borderDefault;
  const borderWidth = focused ? 2 : 1;

  return (
    <View style={[styles.field, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={LumenFieldTokens.color.placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType={keyboardType}
        accessibilityLabel={label}
        accessibilityHint={helpText}
        style={[
          styles.input,
          { borderColor, borderWidth },
        ]}
      />
      {status === "invalid" && errorText ? (
        <Text style={styles.errorText} accessibilityLabel={`Error: ${errorText}`}>{errorText}</Text>
      ) : helpText ? (
        <Text style={styles.helpText}>{helpText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  labelRow: { flexDirection: "row", gap: 4 },
  label: { color: LumenFieldTokens.color.textPrimary, fontSize: 13, fontWeight: "500" },
  required: { color: LumenFieldTokens.color.textDanger, fontSize: 13, fontWeight: "500" },
  input: {
    height: LumenFieldTokens.size.controlMd,
    paddingHorizontal: 12,
    backgroundColor: LumenFieldTokens.color.surfaceField,
    borderRadius: LumenFieldTokens.radius.md,
    color: LumenFieldTokens.color.textPrimary,
    fontSize: 14,
  },
  helpText: { color: LumenFieldTokens.color.textTertiary, fontSize: 12 },
  errorText: { color: LumenFieldTokens.color.textDanger, fontSize: 12 },
});

// Demo
export function LumenFieldDemo() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("Avery Mercer");
  const [invalid, setInvalid] = useState("not-an-email");
  return (
    <View style={demoStyles.demo}>
      <LumenField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@warp.com"
        helpText="We'll use this for shipment notifications."
        required
        keyboardType="email-address"
      />
      <LumenField label="Full name" value={name} onChangeText={setName} placeholder="First Last" />
      <LumenField
        label="Login email"
        value={invalid}
        onChangeText={setInvalid}
        placeholder="you@warp.com"
        errorText="Enter a valid email address."
        status="invalid"
      />
    </View>
  );
}

const demoStyles = StyleSheet.create({
  demo: { flex: 1, backgroundColor: "#0D0D0D", padding: 24, gap: 20 },
});
