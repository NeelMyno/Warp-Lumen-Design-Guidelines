/**
 * App.tsx — the Lumen-themed sidebar component rendered inside the shadow root.
 *
 * Three surfaces:
 *   1. Stat — the Lumen signature widget
 *   2. Primary button — hard rule 9 (no white on lime)
 *   3. Glass popover — hard rule 16 (glass on floating shells only)
 *      + LiveDot pulse with prefers-reduced-motion fallback (CSS-only)
 */

import { useState } from "react";

export default function App() {
    const [confirmed, setConfirmed] = useState(false);

    return (
        <div className="lumen-sidebar">
            <header style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <span className="lumen-live-dot" aria-hidden />
                <span className="lumen-label">WARP COMPANION</span>
            </header>

            {/* Surface 1: Stat */}
            <div>
                <div
                    className="lumen-mono"
                    style={{
                        fontSize: 49,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        lineHeight: 1,
                    }}
                >
                    $2,840
                </div>
                <div className="lumen-label" style={{ marginTop: "var(--space-1)" }}>
                    QUOTE · LAX→SFO · 12 PALLETS
                </div>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid var(--border-hairline)" }} />

            {/* Surface 2: Primary button */}
            <button
                className="lumen-btn-primary"
                onClick={() => setConfirmed(true)}
                aria-label="Book shipment"
            >
                Book shipment
            </button>

            {/* Surface 3: Glass popover (appears after action) */}
            {confirmed && (
                <div className="lumen-glass" style={{ padding: "var(--space-4)" }}>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>Confirmed</div>
                    <div
                        style={{
                            color: "var(--text-secondary)",
                            fontSize: 14,
                            marginTop: "var(--space-2)",
                        }}
                    >
                        Shipment AB47 booked. Tracking is live.
                    </div>
                </div>
            )}

            <div style={{ marginTop: "auto", color: "var(--text-tertiary)", fontSize: 11 }}>
                Lumen v0.13.0 · Extension Reference
            </div>
        </div>
    );
}
