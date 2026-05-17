/**
 * Lumen v0.13 — vendored token subset for Node CLI consumers.
 *
 * Production would generate this from dist/json/tokens.json via a build step.
 */

export const LumenTheme = {
    color: {
        surfaceCanvas: "#0D0D0D",
        surfaceRaised: "#171717",
        textPrimary:   "#FAFAFA",
        textSecondary: "#A6A6A6",
        textTertiary:  "#737373",
        accent:        "#00FA8A",
        primaryFg:     "#07120D",  // hard rule 9
        statusWarning: "#FBC11C",
        statusDanger:  "#FF4D4D",
        borderDefault: "#2E2E2E",
    },
    spacing: {
        s1: 1, s2: 2, s3: 3, s4: 4, s5: 5, s6: 6,
    },
} as const;

/**
 * `.lumen-label` — uppercase + space-separated characters approximates the
 * web `.lumen-label` letter-spacing: 0.16em tracking.
 */
export function lumenLabel(text: string): string {
    return text.toUpperCase().split("").join(" ");
}
