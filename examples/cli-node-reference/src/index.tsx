#!/usr/bin/env node
/**
 * warp-quote-mock — Lumen v0.13 Node CLI reference with Ink.
 *
 * Three surfaces: stat, primary button, glass-equivalent card.
 * Demonstrates the CLI contract from design-system/04-platforms/cli.md.
 *
 * Pipe-friendly: when stdout isn't a TTY, emit final state as plain text.
 * NO_COLOR honored — chalk respects the env var automatically.
 */

import React, { useState, useEffect } from "react";
import { render, Box, Text, useApp, useInput, useStdout } from "ink";
import { LumenTheme, lumenLabel } from "./lumen-theme.js";

// ============================================================================
// Surface 1: Stat — the Lumen signature
// ============================================================================
const Stat: React.FC<{ value: string; label: string; unit?: string }> = ({
    value,
    label,
    unit,
}) => (
    <Box flexDirection="column">
        <Box flexDirection="row" alignItems="flex-end">
            <Text bold color={LumenTheme.color.textPrimary}>{value}</Text>
            {unit && <Text color={LumenTheme.color.textTertiary}>  {unit}</Text>}
        </Box>
        <Text bold color={LumenTheme.color.textTertiary}>
            {lumenLabel(label)}
        </Text>
    </Box>
);

// ============================================================================
// Surface 2: Primary button — hard rule 9 (PrimaryFg on accent, never white)
// ============================================================================
const PrimaryButton: React.FC<{ label: string }> = ({ label }) => (
    <Box>
        <Text
            bold
            color={LumenTheme.color.primaryFg}
            backgroundColor={LumenTheme.color.accent}
        >
            {` ${label}   → `}
        </Text>
    </Box>
);

// ============================================================================
// Surface 3: Card — composed surface with rounded border
// ============================================================================
const Card: React.FC<{ children: React.ReactNode; width?: number }> = ({
    children,
    width = 50,
}) => (
    <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={LumenTheme.color.borderDefault}
        paddingX={2}
        paddingY={1}
        width={width}
    >
        {children}
    </Box>
);

// ============================================================================
// LiveDot equivalent — Bold accent character
// ============================================================================
const LiveDot: React.FC = () => (
    <Text bold color={LumenTheme.color.accent}>●</Text>
);

// ============================================================================
// Interactive app
// ============================================================================
const App: React.FC = () => {
    const [step, setStep] = useState(0);
    const { exit } = useApp();

    useInput((input, key) => {
        if (input === "q" || (key.ctrl && input === "c")) {
            exit();
            return;
        }
        if (key.return || input === " ") {
            setStep((s) => {
                if (s >= 2) {
                    exit();
                    return s;
                }
                return s + 1;
            });
        }
    });

    return (
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text bold color={LumenTheme.color.textTertiary}>
                    {lumenLabel("Lumen v0.13 · CLI · Node")}
                </Text>
            </Box>

            {step === 0 && (
                <Card>
                    <Text bold color={LumenTheme.color.textTertiary}>
                        {lumenLabel("Quote · LAX→SFO · 12 Pallets")}
                    </Text>
                    <Box marginTop={1}>
                        <Stat value="$2,840" label="Total" />
                    </Box>
                    <Box marginTop={1}>
                        <Text color={LumenTheme.color.textSecondary}>
                            Estes · 2 days · 98.2% OTD
                        </Text>
                    </Box>
                    <Box marginTop={1}>
                        <PrimaryButton label="BOOK SHIPMENT" />
                    </Box>
                </Card>
            )}

            {step === 1 && (
                <Box flexDirection="column" gap={1}>
                    <Stat value="98.2%" label="On-Time Delivery" />
                    <Stat value="$0.42" label="Per Pallet Average" unit="/lb" />
                    <Stat value="12" label="Pallets" />
                </Box>
            )}

            {step === 2 && (
                <Box flexDirection="column" gap={1}>
                    <Box flexDirection="row" gap={2}>
                        <PrimaryButton label="BOOK" />
                        <Text color={LumenTheme.color.textSecondary}>·</Text>
                        <Box flexDirection="row">
                            <LiveDot />
                            <Text bold>  LIVE</Text>
                        </Box>
                    </Box>
                    <Text color={LumenTheme.color.textTertiary}>
                        Shipment AB47 is in transit. ETA 2026-05-19 14:00 PST.
                    </Text>
                </Box>
            )}

            <Box marginTop={2}>
                <Text color={LumenTheme.color.textTertiary}>
                    [ENTER] next  [q] quit
                </Text>
            </Box>
        </Box>
    );
};

// ============================================================================
// Pipe-friendly fallback
// ============================================================================
function emitStatic(): void {
    const lines = [
        lumenLabel("Lumen v0.13 · CLI · Node"),
        "",
        "Quote: LAX→SFO · 12 pallets",
        "Total: $2,840",
        "Carrier: Estes · 2 days · 98.2% OTD",
        "",
        "Run interactively with: pnpm start",
    ];
    for (const line of lines) {
        process.stdout.write(line + "\n");
    }
}

// ============================================================================
// Main
// ============================================================================
if (!process.stdout.isTTY || process.env.CI === "true") {
    emitStatic();
} else {
    render(<App />);
}
