// lumen-lint-allow-block: primitives — React Native example file. Native
// platforms (RN, iOS, Android) cannot reference CSS variables; tokens convert
// to hex literals at the platform-build step. The hex values mirror the
// canonical primitive token values from design-system/01-tokens/. Real consumer
// apps import from _build/react-native/tokens.ts instead of inlining.
// Lumen Card — React Native example (v0.14)

import React, { type ReactNode } from "react";
import { View, Text, StyleSheet, type ViewStyle } from "react-native";

const LumenCardTokens = {
  color: {
    surfaceRaised: "#151515",
    borderHairline: "rgba(255,255,255,0.07)",
    textPrimary: "#E6E6E6",
    textSecondary: "#6B6B6B",
  },
  radius: { lg: 12 },
  inset: { md: 16, lg: 24 },
} as const;

type LumenCardPadding = "md" | "lg";

type LumenCardProps = {
  title?: string;
  supporting?: string;
  padding?: LumenCardPadding;
  elevation?: boolean;
  children?: ReactNode;
  style?: ViewStyle;
};

export function LumenCard({
  title,
  supporting,
  padding = "md",
  elevation = false,
  children,
  style,
}: LumenCardProps) {
  return (
    <View
      style={[
        styles.card,
        { padding: LumenCardTokens.inset[padding] },
        elevation && styles.elevation,
        style,
      ]}
    >
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {supporting && <Text style={styles.supporting}>{supporting}</Text>}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: LumenCardTokens.color.surfaceRaised,
    borderRadius: LumenCardTokens.radius.lg,
    borderWidth: 1,
    borderColor: LumenCardTokens.color.borderHairline,
    gap: 12,
  },
  elevation: {
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  header: {
    gap: 4,
  },
  title: {
    color: LumenCardTokens.color.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
  supporting: {
    color: LumenCardTokens.color.textSecondary,
    fontSize: 14,
  },
});

// Demo
export function LumenCardDemo() {
  return (
    <View style={demoStyles.demo}>
      <LumenCard title="Booked" supporting="Confirmation BK-12345 sent to your inbox.">
        <Text style={{ color: LumenCardTokens.color.textPrimary, fontSize: 14 }}>
          Pickup at 09:00, delivery by 17:00. Standard LTL.
        </Text>
      </LumenCard>
      <LumenCard padding="lg" elevation>
        <Text style={{ color: LumenCardTokens.color.textPrimary, fontSize: 14 }}>
          Operator card with elevation + lg padding.
        </Text>
      </LumenCard>
    </View>
  );
}

const demoStyles = StyleSheet.create({
  demo: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: 24,
    gap: 16,
  },
});
